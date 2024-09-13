import React from "react";
import ProfilePage from "@/components/toffee/profile";
import {
  Character,
  CharacterFeedback,
  CharacterKnowledgePack,
  Follow,
  KnowledgePack,
  UserSettings,
  Voice,
} from "@prisma/client";
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
      userId: params.userId,
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
          voiceId: true,
          _count: {
            select: {
              messages: true,
            },
          },
        },
      },
    },
  });

  const characterFeedbacks = await prismadb.characterFeedback.findMany({});

  const knowledgePacks = await prismadb.knowledgePack.findMany({
    where: {
      AND: [{ userId: params.userId }, { sharing: "public" }],
    },
  });

  const characterKnowledgePacks =
    await prismadb.characterKnowledgePack.findMany({});

  const currentFollowers = await prismadb.follow.findMany({
    where: {
      following_id: params.userId,
    },
  });

  const voiceList = await prismadb.voice.findMany({});

  const currentFollowings = await prismadb.follow.findMany({
    where: {
      follower_id: params.userId,
    },
  });

  const userFollowings = await prismadb.follow.findMany({
    where: {
      follower_id: userId,
    },
    select: {
      id: true,
      follower_id: true,
      following_id: true,
    },
  });

  const data: {
    type: string;
    user: Partial<UserSettings | null>;
    characters: Partial<Character & { _count: { messages: number } }>[];
    characterFeedbacks: Partial<CharacterFeedback>[];
    candies: Partial<KnowledgePack>[];
    characterKnowledgePacks: Partial<CharacterKnowledgePack>[];
    userFollowings: Partial<Follow>[];
    currentUserId: string;
    userId: string;
    currentFollowers: Partial<Follow>[];
    currentFollowings: Partial<Follow>[];
    voiceList: Partial<Voice>[];
  } = {
    type: params.userId === userId ? "personal" : "user",
    user: user,
    characters: user?.characters || [],
    characterFeedbacks: characterFeedbacks,
    characterKnowledgePacks: characterKnowledgePacks,
    candies: knowledgePacks,
    userFollowings: userFollowings,
    currentUserId: params.userId,
    voiceList: voiceList,
    userId: userId,
    currentFollowers,
    currentFollowings,
  };

  return <ProfilePage data={data} />;
};

export default Profile;
