import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import prismadb from "@/lib/prismadb";

const FollowerPage = async ({ params }: { params: { userId: string } }) => {
  const followers = await prismadb.follow.findMany({
    where: {
      following_id: params.userId
    },
    select: {
      follower_id: true,
    }
  });
  const users = await prismadb.userSettings.findMany({
    where: {
      OR: followers.map((item) => ({ userId: item.follower_id }))
    }
  });

  const elements = users.map((item, index) => (
    <Link
      key={index}
      href={`/profile/${item.userId}`}
      className="w-[152px] h-[145px] px-4 pt-5 pb-4 bg-[#202020] rounded-2xl border border-white/5 flex-col justify-end items-center gap-[19px] inline-flex"
    >
      <Image
        className="w-[72px] h-[72px] rounded-full border border-black object-cover"
        src={item.profile_image || ""}
        alt=""
        width={0}
        height={0}
        sizes="100vw"
      />
      <div
        className="self-stretch text-center text-white text-sm font-medium  leading-[18px]"
      >
        {item.name}
      </div>
    </Link>
  ));
  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <div className="text-white min-h-full w-full overflow-auto bg-bg-2 rounded-xl p-6 flex flex-col gap-8">
        <div className="flex flex-row items-center gap-4">
          <Link href={"/profile/" + params.userId}><ArrowLeft className="text-icon-3 w-6 h-6" /></Link>
          <span className="text-white text-2xl font-semibold ">Followers</span>
        </div>
        <div className="grid grid-cols-auto-fit min-w-max gap-4 justify-center">
          {elements}
        </div>
      </div>
    </div>
  )
}

export default FollowerPage;