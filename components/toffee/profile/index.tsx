"use client";
import { useEffect, useState } from "react";
import {
  Character,
  CharacterFeedback,
  CharacterKnowledgePack,
  Follow,
  KnowledgePack,
  UserSettings,
  Voice,
} from "@prisma/client";
import Image from "next/image";
import { VerifiedFill } from "../icons/Badge";
import { RiPencilRuler2Line } from "../icons/PencilRuler";
import {
  PrimeLinkedin,
  PrimeTwitter,
  MageInstagramSquare,
  IcSharpTelegram,
} from "../icons/Socials";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Characters from "./Elements/CharacterPanel";
import Candies from "./Elements/CandyPanel";
import Voices from "./Elements/VoicePanel";
import All from "./Elements/AllPanel";
import clsx from "clsx";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { ArrowLeft, PlusIcon } from "lucide-react";
import { SortDescIcon } from "../icons/SortDescIcon";
import { useRouter } from "next/navigation";

type CharacterWeightType = {
  likesWeight: number;
  starsWeight: number;
  messagesWeight: number;
};

type CandyWeightType = {
  connectedCharacters: number;
};

type VoiceWeightType = {
  connectedCharacters: number;
};

const ProfilePage = ({
  data,
}: {
  data: {
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
  };
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const addContents = ["all", "character", "candie", "voice"];
  const linkContents = ["all", "character", "candy", "voice"];
  const [popularity, setPopularity] = useState<boolean>(false);

  const [sortedCharacter, setSortedCharacter] = useState<
    Partial<Character & { _count: { messages: number } }>[]
  >([]);
  const [sortedCandies, setSortedCandies] = useState<Partial<KnowledgePack>[]>(
    [],
  );

  const [sortedVoices, setSortedVoices] = useState<Partial<Voice>[]>([]);

  // Define weights for each factor

  const weights: CharacterWeightType = {
    likesWeight: 0.4, // 40% weight for likes
    starsWeight: 0.3, // 30% weight for stars
    messagesWeight: 0.3, // 30% weight for number of messages
  };

  // Function to calculate popularity score
  function calculatePopularity(
    likes: number,
    stars: number,
    numOfMessages: number,
    weights: CharacterWeightType,
  ) {
    return (
      likes * weights.likesWeight +
      stars * weights.starsWeight +
      numOfMessages * weights.messagesWeight
    );
  }

  function getCharacterByPopularityScore(
    _character: Partial<Character & { _count: { messages: number } }>,
    _characterFeedbacks: Partial<CharacterFeedback>[],
  ) {
    let popularityScore = 0;
    let numOfMessages = _character._count?.messages ?? 0;
    let feedbacks: Partial<CharacterFeedback>[] = _characterFeedbacks.filter(
      (feedback) => feedback.characterId === _character.id,
    );
    let likes = 0;
    let stars = 0;
    if (feedbacks.length > 0) {
      feedbacks.forEach((feedback) => {
        let like = feedback.like;
        if (like) {
          likes++;
        }

        let star = feedback.star;
        if (star) {
          stars++;
        }
      });
    }

    popularityScore = calculatePopularity(likes, stars, numOfMessages, weights);

    return popularityScore;
  }

  // Function to sort chatbots based on popularity
  function sortCharacterByPopularity(
    _characters: Partial<Character & { _count: { messages: number } }>[],
    _characterFeedbacks: Partial<CharacterFeedback>[],
    popularity: boolean,
  ) {
    if (!popularity) {
      return _characters
        .map((character) => ({
          ...character,
          popularityScore: getCharacterByPopularityScore(
            character,
            _characterFeedbacks,
          ),
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore);
    } else {
      return _characters
        .map((character) => ({
          ...character,
          popularityScore: getCharacterByPopularityScore(
            character,
            _characterFeedbacks,
          ),
        }))
        .sort((a, b) => a.popularityScore - b.popularityScore);
    }
  }

  const togglePopularity = () => {
    setPopularity((prev) => !prev);
  };

  // Define weights for each factor

  const voiceWeights: VoiceWeightType = {
    connectedCharacters: 1, // 100% weight for connectedCharacters
  };

  // Function to calculate popularity score
  function calculateVoicePopularity(
    numOfMessages: number,
    weights: CandyWeightType,
  ) {
    return numOfMessages * weights.connectedCharacters;
  }

  const getVoiceByPopularityScore = (
    voice: Partial<Voice>,
    _character: Partial<Character & { _count: { messages: number } }>[],
  ) => {
    let popularityScore = 0;
    let voiceId = voice.id;
    let connectedCharacters = _character.filter(
      (item) => item.voiceId == voiceId,
    ).length;

    popularityScore = calculateVoicePopularity(
      connectedCharacters,
      voiceWeights,
    );

    return popularityScore;
  };

  const sortVoicesByPopularity = (
    _voices: Partial<Voice>[],
    _character: Partial<Character & { _count: { messages: number } }>[],
    popularity: boolean,
  ) => {
    if (!popularity) {
      return _voices
        .map((voice) => ({
          ...voice,
          popularityScore: getVoiceByPopularityScore(voice, _character),
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore);
    } else {
      return _voices
        .map((voice) => ({
          ...voice,
          popularityScore: getVoiceByPopularityScore(voice, _character),
        }))
        .sort((a, b) => a.popularityScore - b.popularityScore);
    }
  };

  // Define weights for each factor

  const candyWeights: CandyWeightType = {
    connectedCharacters: 1, // 100% weight for connectedCharacters
  };

  // Function to calculate popularity score
  function calculateCandyPopularity(
    numOfMessages: number,
    weights: CandyWeightType,
  ) {
    return numOfMessages * weights.connectedCharacters;
  }

  const getCandyByPopularityScore = (
    candy: Partial<KnowledgePack>,
    _characterKnowledgePacks: Partial<CharacterKnowledgePack>[],
  ) => {
    let popularityScore = 0;
    let candyId = candy.id;
    let connectedCharacters = _characterKnowledgePacks.filter(
      (item) => item.knowledgePackId === candyId,
    ).length;

    popularityScore = calculateCandyPopularity(
      connectedCharacters,
      candyWeights,
    );
    return popularityScore;
  };

  const sortCandiesByPopularity = (
    _candies: Partial<KnowledgePack>[],
    _characterKnowledgePacks: Partial<CharacterKnowledgePack>[],
    popularity: boolean,
  ) => {
    if (!popularity) {
      return _candies
        .map((candy) => ({
          ...candy,
          popularityScore: getCandyByPopularityScore(
            candy,
            _characterKnowledgePacks,
          ),
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore);
    } else {
      return _candies
        .map((candy) => ({
          ...candy,
          popularityScore: getCandyByPopularityScore(
            candy,
            _characterKnowledgePacks,
          ),
        }))
        .sort((a, b) => a.popularityScore - b.popularityScore);
    }
  };

  useEffect(() => {
    if (data.characters && data.characterFeedbacks) {
      setSortedCharacter(
        sortCharacterByPopularity(
          data.characters,
          data.characterFeedbacks,
          popularity,
        ),
      );
    }
    if (data.candies && data.characterKnowledgePacks) {
      setSortedCandies(
        sortCandiesByPopularity(
          data.candies,
          data.characterKnowledgePacks,
          popularity,
        ),
      );
    }

    if (data.voiceList && data.characters) {
      setSortedVoices(
        sortVoicesByPopularity(data.voiceList, data.characters, popularity),
      );
    }
  }, [popularity]);

  const categories = {
    All: (
      <All
        characters={sortedCharacter}
        candies={sortedCandies}
        type={data.type}
        voiceList={sortedVoices}
      />
    ),
    Characters: <Characters characters={sortedCharacter} type={data.type} />,
    Candies: <Candies candies={sortedCandies} type={data.type} />,
    Voices: (
      <Voices
        type={data.type}
        voicelist={sortedVoices}
        characters={sortedCharacter}
      />
    ),
  };
  const [followingList, setFollowingList] = useState<Partial<Follow>[]>(
    data.userFollowings,
  );
  const [currentFollowers, setCurrentFollowers] = useState<Partial<Follow>[]>(
    data.currentFollowers,
  );
  const [currentFollowings, setCurrentFollowings] = useState<Partial<Follow>[]>(
    data.currentFollowings,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    followingList.some((item) => item.following_id === data.currentUserId),
  );
  const [name, setName] = useState<string | null>(data.user?.name || null);
  const [banner, setBanner] = useState<string | null>(
    data.user?.banner_image || null,
  );
  const router = useRouter();
  const onFollow = () => {
    let newFollow = {
      id: "new",
      folloer_id: data.userId,
      following_id: data.currentUserId,
    };
    setFollowingList((current) =>
      current.length ? [...current, newFollow] : [newFollow],
    );
    setCurrentFollowers((current) =>
      current.length ? [...current, newFollow] : [newFollow],
    );
    setIsFollowing(true);
    setIsLoading(true);
    axios
      .post(`/api/user/${data.userId}/follow`, {
        following_id: data.currentUserId,
      })
      .then((res) => {
        setFollowingList((current) =>
          current.length > 1
            ? [...current.slice(0, -1), res.data.createdFollow]
            : [res.data.createdFollow],
        );
        setCurrentFollowers((current) =>
          current.length > 1
            ? [...current.slice(0, -1), res.data.createdFollow]
            : [res.data.createdFollow],
        );
        setIsLoading(false);
      })
      .catch((error) => {
        setFollowingList((current) => current.slice(0, -1));
        setCurrentFollowers((current) => current.slice(0, -1));
        setIsFollowing(false);
        setIsLoading(false);
        toast.error(
          "Something went wrong while following the user. Please try again.",
          {
            theme: "colored",
            autoClose: 1500,
            hideProgressBar: true,
          },
        );
      });
  };

  const onUnfollow = () => {
    const followId = followingList.find(
      (item) =>
        item.follower_id === data.userId &&
        item.following_id === data.currentUserId,
    )?.id;
    const deleteFollow = followingList.filter(
      (item) => item.id === followId,
    )[0];
    const deleteFollower = currentFollowers.filter(
      (item) => item.id === followId,
    )[0];
    setFollowingList((current) =>
      current.filter((item) => item.id !== followId),
    );
    setCurrentFollowers((current) =>
      current.filter((item) => item.id !== followId),
    );
    setIsFollowing(false);
    setIsLoading(true);
    axios
      .delete(`/api/user/${data.userId}/follow/${followId}`)
      .then((res) => {
        setIsLoading(false);
      })
      .catch((error) => {
        setFollowingList((current) =>
          current.length ? [...current, deleteFollow] : [deleteFollow],
        );
        setCurrentFollowers((current) =>
          current.length ? [...current, deleteFollower] : [deleteFollower],
        );
        setIsFollowing(true);
        setIsLoading(false);
        console.log(error);
        toast.error(
          "Something went wrong while unfollowing the user. Please try again.",
          {
            theme: "colored",
            autoClose: 1500,
            hideProgressBar: true,
          },
        );
      });
  };

  return (
    <div className="no-scrollbar h-screen w-full overflow-y-auto sm:p-2">
      <div className="flex min-h-full w-full flex-col bg-bg-2 sm:rounded-lg">
        <div
          className={`z-10 ${banner === null && "bg-gradient-to-r from-[#3A1A56] to-[#7034A5]"} relative flex h-fit w-full flex-col items-end justify-center overflow-hidden px-5 py-6 sm:h-[280px] sm:flex-row sm:justify-start sm:rounded-t-lg sm:px-6 sm:py-8`}
        >
          {banner && (
            <Image
              src={banner}
              alt="Background"
              className="absolute top-0 -z-10 h-[280px] w-full sm:rounded-lg"
              width={0}
              height={0}
              sizes="100vw"
            />
          )}
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start sm:gap-8">
            <div className="absolute left-5 top-4 flex h-9 w-9 cursor-pointer flex-col items-center justify-center rounded-none sm:left-[18px] sm:top-[14px] sm:rounded-[20px] sm:bg-bg-3">
              <ArrowLeft className="h-6 w-6 text-white" />
            </div>
            <Image
              src={
                data.user?.profile_image ||
                "https://source.boringavatars.com/marble/120"
              }
              width={0}
              height={0}
              sizes="100vw"
              className="h-24 w-24 rounded-full object-cover sm:h-[180px] sm:w-[180px] sm:min-w-[180px]"
              alt="Profile Logo"
            />
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:mt-auto sm:items-start sm:justify-start sm:gap-6">
              <div className="text-[40px] font-semibold leading-[48px] text-white sm:text-[80px] sm:font-bold sm:leading-[100px]">
                {name}
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Link href={`${data.userId}/following`}>
                    <span className="text-sm text-text-additional">
                      {Number(currentFollowings?.length || 0).toLocaleString(
                        "en",
                      )}{" "}
                      Following
                    </span>
                  </Link>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#B1B1B1]" />
                  <Link href={`${data.userId}/followers`}>
                    <span className="text-sm text-text-additional">
                      {Number(currentFollowers?.length || 0).toLocaleString(
                        "en",
                      )}{" "}
                      Followers
                    </span>
                  </Link>
                  <div className="hidden flex-row items-center gap-3 sm:flex">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#B1B1B1]" />
                    <VerifiedFill className="h-6 w-6 text-white" />
                    <RiPencilRuler2Line className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex w-full flex-col gap-4 sm:w-fit sm:flex-row sm:gap-6">
                  <div className="flex w-full flex-row items-center justify-center gap-2 rounded-full px-1 py-0 text-white">
                    <PrimeLinkedin className="h-10 w-10 cursor-pointer p-1" />
                    <IcSharpTelegram className="h-10 w-10 cursor-pointer p-1.5" />
                    <MageInstagramSquare className="h-10 w-10 cursor-pointer p-1.5" />
                    <PrimeTwitter className="h-8 w-8 cursor-pointer p-1.5" />
                  </div>
                  {data.type === "personal" ? (
                    <div className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-1.5 text-black sm:min-w-[120px]">
                      <button
                        className="py-[3px] text-sm font-medium"
                        onClick={() =>
                          router.push(`/profile/${data.userId}/edit`)
                        }
                      >
                        Edit profile
                      </button>
                    </div>
                  ) : isFollowing ? (
                    <div className="flex min-w-[120px] flex-row items-center justify-center gap-2 rounded-full border border-white px-4 py-1.5 text-white">
                      <button
                        className="px-1 py-[3px] text-sm font-medium"
                        onClick={onUnfollow}
                        disabled={isLoading}
                      >
                        Unfollow
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full min-w-[120px] flex-row items-center justify-center gap-1 rounded-full bg-white px-4 py-1.5 text-black sm:w-[120px]">
                      <button
                        className="px-1 py-[3px] text-sm font-medium"
                        onClick={onFollow}
                        disabled={isLoading}
                      >
                        Follow
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <TabGroup
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
          className="relative z-10 flex w-full flex-grow flex-col gap-8 bg-bg-2 px-5 py-6 sm:px-6 sm:py-8"
        >
          <div className="absolute left-0 top-0 h-[180px] w-full bg-gradient-to-b from-[#2D1542] to-[#121212]" />
          <div className="z-10 flex flex-col gap-6 sm:flex-row sm:justify-between">
            <TabList className="flex h-10 w-full rounded-full bg-black p-0.5 sm:w-fit">
              {Object.keys(categories).map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    clsx(
                      "w-full px-4 text-center",
                      selected
                        ? "rounded-full border-none bg-bg-2 text-white outline-none"
                        : "text-text-tertiary",
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </TabList>
            <div className="flex items-center justify-end gap-6">
              <div className="flex items-center gap-3">
                <span className=" text-sm font-medium text-white">
                  Popularity
                </span>
                <button
                  className="bg-transparent p-0"
                  style={{
                    transform: `${!popularity ? "rotateX(0deg)" : "rotateX(-180deg)"}`,
                  }}
                  onClick={togglePopularity}
                >
                  <SortDescIcon className="h-6 w-6 text-[#B1B1B1] " />
                </button>
              </div>
              {selectedIndex > 0 && data.type === "personal" && (
                <div className="flex w-[164px] items-center justify-center gap-1 rounded-[20px] bg-bg-2 px-4 py-[6px]">
                  <PlusIcon className="h-6 w-6 text-[#B1B1B1]" />
                  <Link href={`/create/${linkContents[selectedIndex]}`}>
                    <span className=" text-sm font-medium leading-[18px] text-text-sub">{`Add ${addContents[selectedIndex]}`}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <TabPanels className="z-10 flex w-full flex-grow flex-col overflow-y-auto">
            {Object.values(categories).map((content, idx) => (
              <TabPanel key={idx} className={"flex flex-grow flex-col"}>
                {content}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default ProfilePage;
