import React from 'react';
import ProfilePage from "@/components/toffee/profile";
import { Character, Follow, KnowledgePack, UserSettings } from "@prisma/client";
import { auth, signIn } from "auth";
import prismadb from "@/lib/prismadb";

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

const Profile = async ({ params }: ProfilePageProps) => {
  const session = await auth();
  let userId = session?.user?.id;
  if (!userId) {
    await signIn();
    return;
  }

  const user = await prismadb.userSettings.findUnique({
    where: {
      userId: params.userId
    },
    select: {
      name: true,
      email: true,
      profile_image: true,
      banner_image: true,
      shared: true,
      language: true,
      password: true,
      // chat_background_image: true,
      linkedin: true,
      telegram: true,
      instagram: true,
      twitter: true,
      characters: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          _count: {
            select: {
              messages: true
            }
          }
        }
      }
    }
  });

  const knowledgePacks = await prismadb.knowledgePack.findMany({
    where: {
      AND: [
        { userId: params.userId },
        { sharing: "public" }
      ]
    }
  })

  const currentFollowers = await prismadb.follow.findMany({
    where: {
      following_id: params.userId
    },
    select: {
      follower_id: true,
    }
  });

  const currentFollowings = await prismadb.follow.findMany({
    where: {
      follower_id: params.userId
    },
    select: {
      following_id: true,
    }
  })

  const userFollowings = await prismadb.follow.findMany({
    where: {
      follower_id: userId
    },
    select: {
      id: true,
      follower_id: true,
      following_id: true,
    }
  })

  const data: {
    type: string;
    user: Partial<UserSettings | null>;
    characters: Partial<Character & { _count: { messages: number } }>[];
    candies: Partial<KnowledgePack>[];
    userFollowings: Partial<Follow>[];
    currentUserId: string;
    userId: string;
    currentFollowers: Partial<Follow>[];
    currentFollowings: Partial<Follow>[];
  } = {
    type: params.userId === userId ? "personal" : "user",
    user: user,
    characters: user?.characters || [],
    candies: knowledgePacks,
    userFollowings: userFollowings,
    currentUserId: params.userId,
    userId: userId,
    currentFollowers,
    currentFollowings
  }

  return <ProfilePage data={data} />;
}

export default Profile;