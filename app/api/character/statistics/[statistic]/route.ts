import { MemoryManager } from "@/lib/memory/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { Subscription } from "@prisma/client";
import { NextResponse } from "next/server";
import { SimpleLinearRegression } from "ml-regression-simple-linear";

export const maxDuration = 35;

interface Statistic {
  id: string;
  subscriptions: Subscription[];
}

export async function POST(
  req: Request,
  { params }: { params: { statistic: string } },
) {
  try {
    const body = await req.json();

    const { count, hours } = body;
    let cur = new Date();

    const poss_stats = ["trending", "popular"];
    let found = false;
    for (let stat of poss_stats) {
      if (params.statistic == stat) {
        found = true;
      }
    }

    if (!found) {
      return new NextResponse("Unsupported statistic.", { status: 401 });
    }

    cur.setHours(cur.getHours() - hours);
    const characters = await prismadb.character.findMany({
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

    let stats: Statistic[] = [];

    // console.log(characters);

    for (let comp of characters) {
      stats.push({
        id: comp.id,
        subscriptions: comp.subscriptions,
      });
    }

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
        console.log("INCREMENT: " + hash);
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
    const compute_best_fit = (subs: Subscription[]) => {
      if (subs.length == 0) {
        return 0;
      }
      // split subscriptions by hour
      const split_subs = split(subs);
      if (subs.length > 0) {
        // console.log("SPLIT: " + split_subs);
      }
      const x_vals = Array.from(new Array(split_subs.length), (x, i) => i);
      const regression = new SimpleLinearRegression(x_vals, split_subs);
      return regression.slope;
    };

    let best_fits: Record<string, number> = {};

    for (let stat of stats) {
      best_fits[stat.id] = compute_best_fit(stat.subscriptions);
    }

    stats.sort((a: Statistic, b: Statistic) => {
      let a_score = -1;
      let b_score = -1;
      switch (params.statistic) {
        case "trending":
          a_score = best_fits[b.id];
          b_score = best_fits[a.id];
          break;
        case "popular":
          a_score = a.subscriptions.length;
          b_score = b.subscriptions.length;
          break;
        default:
          console.log("Something went wrong.");
          break;
      }
      return b_score - a_score;
    });
    const res = stats.slice(0, count);
    // console.log("RES:", res);
    const resWithcharacters = await prismadb.character.findMany({
      select: {
        name: true,
        id: true,
        image: true,
        description: true,
        subscriptions: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: {
          in: res.map((stat) => stat.id),
        },
      },
    });
    // console.log("SERVER:", res.length, resWithcharacters.length)
    return NextResponse.json(JSON.stringify(resWithcharacters));
  } catch (error) {
    console.log("[CHARACTER_STATISTICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
