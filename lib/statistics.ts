import { Subscription } from "@prisma/client";
import prismadb from "./prismadb";
import { SimpleLinearRegression } from 'ml-regression-simple-linear';
import { addMetadataToCharacters } from "./character/util";
import { max } from "date-fns";

export interface Statistic {
    characterId: string,
    subscriptions: Subscription[],
    numInteractions: number,
}

const memo = new Map();

/**
 * Currently retrieves trending or popular character statistics for public/shared characters. 
 * @returns {Promise<Statistic>[]} The resulting statistics
 */
export default async function getStatistics(
  type: "trending" | "popular",
  count: number,
  hours: number,
): Promise<Statistic[]> {
  if (memo.has(type + "/" + count + "/" + hours)) {
    return memo.get(type + "/" + count + "/" + hours);
  }

  // console.log("COMPUTING");

  let cur = new Date();

    cur.setHours(cur.getHours() - hours);
    const characters = await prismadb.character.findMany({
        where: {
            OR: [{
                AND: {
                    shared: true,
                    private: false,
                }
            }, {
                id: {
                    equals: "public"
                }
            }]

    },
    include: {
      subscriptions: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          createdAt: {
            gt: cur,
          },
        },
      },

    },
  });

  const compWithMetadata = await addMetadataToCharacters(characters);
  let stats: Statistic[] = [];
  stats.sort((a, b) => b.subscriptions.length - a.subscriptions.length);

  // console.log(characters);

  for (let i = 0; i < compWithMetadata.length; i++) {
    stats.push({
      characterId: compWithMetadata[i].id,
      subscriptions: characters[i].subscriptions,
      numInteractions: compWithMetadata[i].numChats,
    });
  }

  //  Setting a threshold so only top x% (40%) are shown in the trending page in order to avoid small characters being shown
  const threshold = Math.ceil(stats.length * 0.4);

  /*
      Splits subscriptions into number of subscriptions by hour for the last "hours" hours.
  */
  const split = (subs: Subscription[]) => {
    let date_map: Record<string, number> = {};
    for (const sub of subs) {
      let time = sub.createdAt;
      time.setMinutes(0);
      time.setSeconds(0);
      const hash = time.toUTCString();
      if (hash in date_map) {
        date_map[hash]++;
      } else {
        date_map[hash] = 1;
      }
    }
    let res = [];
    let cur = new Date();
    cur.setMinutes(0);
    cur.setSeconds(0);
    for (let i = 0; i < hours; i++) {
      // add the number of subscriptions of this hour
      const check = cur.toUTCString();
      if (check in date_map) {
        res.push(date_map[check]);
      } else {
        res.push(0);
      }

      // decrement hours by 1
      cur.setHours(cur.getHours() - 1);
    }
    return res;
  };

  /*
        Check whether the graph looks like it's increasing. 
    */

  // compute the best fit line slope of an array of subscriptions
  // const compute_best_fit = (subs: Subscription[]) => {
  //     if (subs.length == 0) {
  //         return 0;
  //     }
  //     // split subscriptions by hour
  //     const split_subs = split(subs);
  //     if (subs.length > 0) {
  //         console.log("SPLIT: " + split_subs);
  //     }
  //     const x_vals = Array.from(new Array(split_subs.length), (x, i) => i);
  //     const regression = new SimpleLinearRegression(x_vals, split_subs);
  //     return regression.slope;
  // }

  // Calculating the ZScore of Subs to see which ones are trending

  const zscore = (subs: Subscription[]) => {
    const split_subs = split(subs);

    // Getting the most recent sub count
    const cur = split_subs[split_subs.length - 1];
    //  Population size
    const size = split_subs.length;

    // Calculating sum, average, and sum of deviations for standard deviation
    let sumOfDeviation = 0;
    let sum = 0;
    for (let i = 0; i < split_subs.length; i++) {
      sum += split_subs[i];
    }
    const avg = sum / size;
    for (let i = 0; i < split_subs.length; i++) {
      sumOfDeviation += Math.pow(split_subs[i] - avg, 2);
    }

    // Calculating standard deviation and zscore
    const std = Math.sqrt(sumOfDeviation / size);
    const zscore = (cur - avg) / std;
    if (Number.isNaN(zscore)) {
      return 0;
    }
    return zscore;
  }

  // A map to store ids and their scores
  let comp_scores: Record<string, number> = {};

  // Getting max interactions and sub count Z score to normalize them 
  let maxInts = 0;
  let maxZScore = 0;
  for (let stat of stats) {
    maxInts = Math.max(maxInts, stat.numInteractions)
    maxZScore = Math.max(zscore(stat.subscriptions), maxZScore);
  }

  // Making sure only characters above the threshold are accounted for
  // Calculating normalized sub Z score and normalized interactions, then adding weights to priorirtize subs over interactions
  for (let i = 0; i < threshold; i++) {
    const subZscore = zscore(stats[i].subscriptions);
    const normalizedSubZScore = maxZScore !== 0 ? subZscore / maxZScore : 0;
    const normalizedInts = maxInts !== 0 ? stats[i].numInteractions / maxInts : 0;
    const totalScore = (normalizedSubZScore * 0.7) + (normalizedInts * 0.3);
    comp_scores[stats[i].characterId] = totalScore;
  }

  // Sorting by descending
  stats.sort((a: Statistic, b: Statistic) => {
    let a_score = -1;
    let b_score = -1;
    switch (type) {
      case "trending":
        a_score = comp_scores[a.characterId];
        b_score = comp_scores[b.characterId];
        break;
      case "popular":
        break;
      default:
        console.error("Something went wrong.");
        break;
    }
    return b_score - a_score;
  });
  const res = stats.slice(0, count);

  memo.set(type + "/" + count + "/" + hours, res);

  return res;

}
