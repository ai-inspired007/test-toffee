// Backend for character creation

import prismadb from "@/lib/prismadb";
import { auth } from "auth";
import { NextResponse } from "next/server";
import qs from "qs";
export const maxDuration = 30;
const cosinesim = (A: number[], B: number[]) => {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;

  for (let i = 0; i < A.length; i++) {
      dotproduct += A[i] * B[i];
      mA += A[i] * A[i];
      mB += B[i] * B[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return (mA === 0 || mB === 0) ? 1 : dotproduct / (mA * mB);
};

export async function GET(req: Request) {
  try {
    const rawParams = req.url.split("?")[1];
    const searchParams = qs.parse(rawParams);
    const session = await auth();
    const user = session?.user;
    const tag = searchParams.tag ? (searchParams.tag as string) : "";
    const query = searchParams.query ? (searchParams.query as string) : "";
    console.log(searchParams)

    let result = {};
    
    if (tag === "All") {

    }
    
    if (tag === "Characters") {
      const characters = await prismadb.character.findMany({
          where: {
            AND: {
              name: {
                contains: query,
              },
              OR: [
                {
                  userId: "public",
                },
                {
                  AND: {
                    shared: true,
                    private: false,
                  },
                },
                {
                  userId: user?.id
                }
              ],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            userId: true,
            image: true,
            name: true,
            description: true,
            instructions: true,
            greeting: true,
            seed: true,
            vectors: true,
            shared: true,
            private: true,
            createdAt: true,
            updatedAt: true,
            categoryId: true,
            // messages: {
            //   select: {
            //     id: true,
            //     userId: true,
            //     characterId: true
            //   }
            // },
            characterKnowledgePacks: true,
            _count: {
              select: {
                characterKnowledgePacks: true,
                messages: true
              },
            },
            // knowledgePacks: {
            //   select: {
            //     _count: {
            //       select: { id: true },
            //     },
            //   }
            // }
          },
        });
      const scoredCharacters = characters.map((item) => ({
        ...item,
        score: (item._count.messages * 0.5 + item._count.characterKnowledgePacks * 0.5)
      })
      );
      const sortedCharacters = scoredCharacters.sort((a, b) => b.score - a.score); // Sorting by score descending

      const topCharacter = sortedCharacters ? sortedCharacters[0] : null;
      if (topCharacter) {
        const knowledgePacks = await prismadb.knowledgePack.findMany({
          where: {
            OR: topCharacter.characterKnowledgePacks.map(item => ({id: item.knowledgePackId}))
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
            _count: {
              select: {
                characterKnowledgePacks: true,
              },
            },
          }
        });
        const scoredKnowledgePacks = knowledgePacks.map((item: any) => ({
          ...item,
          score: item._count.characterKnowledgePacks
        })
        );
        const sortedKnowledgePacks = scoredKnowledgePacks.sort((a, b) => b.score - a.score); // Sorting by score descending
        result = {
          ...result,
          topCandies: sortedKnowledgePacks
        }
      }
      result = {
        ...result,
        topCharacter: sortedCharacters ? sortedCharacters[0] : null,
        characters: sortedCharacters
      }
    }
    
    if (tag === "Candies") {
      const knowledgePacks = await prismadb.knowledgePack.findMany({
        where: {
          AND: {
            name: {
              contains: query,
            },
            OR: [
              {
                userId: "public",
              },
              {
                sharing: "public"
              },
              {
                userId: user?.id
              }
            ],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
          characterKnowledgePacks: true,
          _count: {
            select: {
              characterKnowledgePacks: true,
            },
          },
        }
      });
      const scoredKnowledgePacks = knowledgePacks.map((item) => ({
        ...item,
        score: item._count.characterKnowledgePacks
      })
      );
      const sortedKnowledgePacks = scoredKnowledgePacks.sort((a, b) => b.score - a.score); // Sorting by score descending

      const topCandy = sortedKnowledgePacks ? sortedKnowledgePacks[0] : null;

      if (topCandy) {
        const characters = await prismadb.character.findMany({
          where: {
            OR: topCandy.characterKnowledgePacks.map(item => ({id: item.characterId}))
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            userId: true,
            image: true,
            name: true,
            description: true,
            instructions: true,
            greeting: true,
            seed: true,
            vectors: true,
            shared: true,
            private: true,
            createdAt: true,
            updatedAt: true,
            categoryId: true,
            // messages: {
            //   select: {
            //     id: true,
            //     userId: true,
            //     characterId: true
            //   }
            // },
            characterKnowledgePacks: true,
            _count: {
              select: {
                characterKnowledgePacks: true,
                messages: true
              },
            },
            // knowledgePacks: {
            //   select: {
            //     _count: {
            //       select: { id: true },
            //     },
            //   }
            // }
          },
        });
        const scoredCharacters = characters.map((item) => ({
          ...item,
          score: (item._count.messages * 0.5 + item._count.characterKnowledgePacks * 0.5)
        })
        );
        const sortedCharacters = scoredCharacters.sort((a, b) => b.score - a.score); // Sorting by score descending
        result = {
          ...result,
          characters: sortedCharacters
        }
      }
      result = {
        ...result,
        topCandy,
        knowledgePacks: sortedKnowledgePacks
      }
    }

    if (tag === "Tags") {
      const tags = await prismadb.tag.findMany({
        where: {
          AND: {
            name: {
              contains: query,
            }
          }
        },
        select: {
          name: true,
          characters: true,
          _count: {
            select: {
              characters: true
            }
          }
        }
      });

      const scoredTags = tags.map((item) => ({
        ...item,
        score: item._count.characters
      })
      );
      const sortedTags = scoredTags.sort((a, b) => b.score - a.score); // Sorting by score descending

      const topTag = sortedTags ? sortedTags[0] : null;
      if (topTag) {
        const characters = await prismadb.character.findMany({
          where: {
            OR: topTag.characters.map(item => ({id: item.characterId}))
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            userId: true,
            image: true,
            name: true,
            description: true,
            instructions: true,
            greeting: true,
            seed: true,
            vectors: true,
            shared: true,
            private: true,
            createdAt: true,
            updatedAt: true,
            categoryId: true,
            characterKnowledgePacks: true,
            _count: {
              select: {
                characterKnowledgePacks: true,
                messages: true
              },
            },
          },
        });
        const scoredCharacters = characters.map((item) => ({
          ...item,
          score: (item._count.messages * 0.5 + item._count.characterKnowledgePacks * 0.5)
        })
        );
        const sortedCharacters = scoredCharacters.sort((a, b) => b.score - a.score); // Sorting by score descending
        result = {
          ...result,
          characters: sortedCharacters
        }
      }
      result = {
        ...result,
        topTag,
      }
    }
    
    if (tag === "Users") {
      const users = await prismadb.userSettings.findMany({
        where: {
          AND: {
            name: {
              contains: query,
            },
            OR: [
              {
                userId: "public",
              },
              {
                userId: user?.id
              }
            ],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          userId: true,
          name: true,
          profile_image: true,
          _count: {
            select: {
              characters: true
            }
          }
        }
      })
      const newUsers = users.map((item: any) => ({
        ...item,
        characters: item._count.characters
      }))
      const sortedUsers = newUsers.sort((a, b) => b.characters - a.characters); // Sorting by score descending
      result = {
        ...result,
        users: sortedUsers
      }
    }

    return NextResponse.json({
      ...result
    });
  } catch (error) {
    console.log("[CHARACTER_GET_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
