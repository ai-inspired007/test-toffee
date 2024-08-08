"use client";
import { useState } from 'react';
import { Character, Follow, KnowledgePack } from "@prisma/client";
import Image from "next/image";
import { VerifiedFill } from "../icons/Badge";
import { RiPencilRuler2Line } from '../icons/PencilRuler';
import { PrimeLinkedin, PrimeTwitter, MageInstagramSquare, IcSharpTelegram } from '../icons/Socials';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import Characters from './Elements/CharacterPanel';
import Candies from './Elements/CandyPanel';
import Voices from './Elements/VoicePanel';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from "@/components/ui/use-toast";
import EditProfile from "./Elements/EditProfile";
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
const ProfilePage = ({ data }: {
  data: {
    name: string | null | undefined;
    type: string;
    image: string | null | undefined;
    linkedin: string | null | undefined;
    telegram: string | null | undefined;
    instagram: string | null | undefined;
    twitter: string | null | undefined;
    characters: Partial<Character & { _count: { messages: number } }>[];
    candies: Partial<KnowledgePack>[];
    userFollowings: Partial<Follow>[];
    currentUserId: string;
    userId: string;
    currentFollowers: Partial<Follow>[];
    currentFollowings: Partial<Follow>[];
  }
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const categories = {
    Characters: <Characters characters={data.characters} type={data.type} />,
    Candies: <Candies candies={data.candies} type={data.type} />,
    Voices: <Voices type={data.type} />
  }
  const [followingList, setFollowingList] = useState(data.userFollowings);
  const [currentFollowers, setCurrentFollowers] = useState(data.currentFollowers);
  const [currentFollowings, setCurrentFollowings] = useState(data.currentFollowings);
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string>(data.name ? data.name : "");
  const [linkedin, setLinkedin] = useState<string>(data.linkedin ? data.linkedin : "");
  const [telegram, setTelegram] = useState<string>(data.telegram ? data.telegram : "");
  const [instagram, setInstagram] = useState<string>(data.instagram ? data.instagram : "");
  const [twitter, setTwitter] = useState<string>(data.twitter ? data.twitter : "");

  const onFollow = () => {
    let newFollow = {
      id: "new",
      folloer_id: data.userId,
      following_id: data.currentUserId
    }
    setFollowingList((current) => current.length ? [...current, newFollow] : [newFollow]);
    setCurrentFollowers((current) => current.length ? [...current, newFollow] : [newFollow]);
    axios.post(`/api/user/${data.userId}/follow`, {
      following_id: data.currentUserId,
    })
      .then(res => {
        setFollowingList((current) => current.length > 1 ? [...current.slice(0, -1), res.data.createdFollow] : [res.data.createdFollow]);
        setCurrentFollowers((current) => current.length > 1 ? [...current.slice(0, -1), res.data.createdFollow] : [res.data.createdFollow]);
      })
      .catch(error => {
        setFollowingList((current) => current.slice(0, -1));
        setCurrentFollowers((current) => current.slice(0, -1));
        toast({
          description:
            "Something went wrong while toggling share. Make sure your bot is allowed under OpenAI moderation rules. If the error persists, please contact the developers.",
          variant: "destructive",
        });
      });
  }

  const onUnfollow = () => {
    console.log(followingList);
    const followId = followingList.find(item => item.follower_id === data.userId && item.following_id === data.currentUserId)?.id;
    const deleteFollow = followingList.filter(item => item.id === followId)[0];
    const deleteFollower = currentFollowers.filter(item => item.id === followId)[0];
    setFollowingList((current) => current.filter(item => item.id !== followId));
    setCurrentFollowers((current) => current.filter(item => item.id !== followId));
    axios.delete(`/api/user/${data.userId}/follow/${followId}`)
      .then(res => {
        // setFollowingList((current) => current.filter(item => item.id !== followId));
        // setCurrentFollowers((current) => current.filter(item => item.id !== followId));
      })
      .catch(error => {
        setFollowingList((current) => current.length ? [...current, deleteFollow] : [deleteFollow]);
        setCurrentFollowers((current) => current.length ? [...current, deleteFollower] : [deleteFollower]);
        console.log(error);
        toast({
          description: `Something went wrong in character deletion.`,
          variant: "destructive",
        });
      })

  }

  return (
    <div className="h-screen w-full sm:p-2 overflow-y-auto no-scrollbar">
      <div className="flex flex-col sm:rounded-lg bg-bg-2 w-full min-h-full">
        {isEdit ? (
          <EditProfile
            setIsEdit={setIsEdit}
            userId={data.userId}
            nowImage={data.image}
            name={name}
            setName={setName}
            linkedin={linkedin}
            setLinkedin={setLinkedin}
            telegram={telegram}
            setTelegram={setTelegram}
            instagram={instagram}
            setInstagram={setInstagram}
            twitter={twitter}
            setTwitter={setTwitter}
          />
        ) : (
          <>
            <div className="z-10 bg-gradient-to-r from-[#3A1A56] to-[#7034A5] h-fit sm:h-[280px] w-full flex flex-col sm:flex-row justify-center sm:justify-start items-end px-5 sm:px-6 sm:rounded-t-lg py-6 sm:py-8">
              <div className='flex flex-col sm:flex-row items-center justify-center sm:justify-start w-full gap-4 sm:gap-8'>
                <div className='w-full sm:hidden'>
                  <ArrowLeft className='text-white cursor-pointer' />
                </div>
                <Image src={data.image || "https://source.boringavatars.com/marble/120"} width={0} height={0} sizes='100vw' className='rounded-full h-24 w-24 sm:w-[180px] sm:h-[180px]' alt='Profile Logo' />
                <div className="flex flex-col gap-4 sm:gap-6 sm:mt-auto justify-center sm:justify-start items-center sm:items-start w-full">
                  <div className="text-white text-[40px] sm:text-[80px] font-semibold sm:font-bold leading-[48px] sm:leading-[100px]">{name}</div>
                  <div className='flex flex-col sm:flex-row sm:justify-between justify-center items-center w-full gap-4'>
                    <div className="flex flex-row items-center gap-3">
                      <Link href={data.userId + "/following"}><span className="text-sm  text-text-additional">{Number(currentFollowings ? currentFollowings.length : 0).toLocaleString('en')} Following</span></Link>
                      <div className="h-1.5 w-1.5 bg-[#B1B1B1] rounded-full" />
                      <Link href={data.userId + "/followers"}><span className="text-sm  text-text-additional">{Number(currentFollowers ? currentFollowers.length : 0).toLocaleString('en')} Followers</span></Link>
                      <div className='hidden sm:flex flex-row gap-3 items-center'>
                        <div className="h-1.5 w-1.5 bg-[#B1B1B1] rounded-full" />
                        <VerifiedFill className="h-6 w-6 text-white" />
                        <RiPencilRuler2Line className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-fit'>
                      <div className='flex flex-row gap-2 rounded-full w-full py-0 px-1 items-center justify-center text-white'>
                        <PrimeLinkedin className="h-10 w-10 p-1 cursor-pointer" />
                        <IcSharpTelegram className="h-10 w-10 p-1.5 cursor-pointer" />
                        <MageInstagramSquare className="h-10 w-10 p-1.5 cursor-pointer" />
                        <PrimeTwitter className="h-8 w-8 p-1.5 cursor-pointer" />
                      </div>
                      {data.type === "personal" ? (<div className="flex flex-row items-center py-1.5 px-4 gap-2 text-black bg-white rounded-full justify-center w-full sm:w-[120px] h-9">
                        <Button variant="ghost" className="text-sm py-[3px] font-medium" onClick={() => setIsEdit(true)}>Edit profile</Button>
                      </div>) : (followingList?.map(item => item.following_id).includes(data.currentUserId) ? (<div className="flex flex-row items-center py-1.5 px-4 gap-2 text-text-sub bg-white rounded-full justify-center">
                        <Button variant="ghost" className="text-sm py-[3px] font-medium" onClick={() => onUnfollow()}>Unfollow</Button>
                      </div>) : (<div className="flex flex-row items-center py-1.5 px-4 gap-1 text-white bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full w-full sm:w-[120px] h-9 justify-center">
                        <Button variant="ghost" className="text-sm py-[3px] medium" onClick={() => onFollow()}>Follow</Button>
                      </div>))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex} className="flex flex-col gap-8 w-full px-5 sm:px-6 py-6 sm:py-8 flex-grow relative z-10 bg-bg-2">
              <div className='h-[180px] w-full absolute top-0 left-0 bg-gradient-to-b from-[#2D1542] to-[#121212]' />
              <TabList className="flex bg-black rounded-full p-0.5 w-full sm:w-fit h-10 z-10">
                {Object.keys(categories).map((category) => (
                  <Tab key={category} className={({ selected }) => clsx('px-4 w-full text-center', selected ? 'text-white rounded-full bg-bg-2 border-none outline-none' : 'text-text-tertiary')}>
                    {category}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="w-full overflow-y-auto flex-grow flex flex-col z-10">
                {Object.values(categories).map((content, idx) => (
                  <TabPanel key={idx} className={"flex-grow flex flex-col"}>
                    {content}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfilePage;