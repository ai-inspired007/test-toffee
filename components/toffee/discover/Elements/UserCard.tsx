import Image from "next/image"
const UserCard = ({image, name, detail}: {image: string, name: string, detail: string})=> {
  return(
    <div className="flex flex-row gap-2 items-center hover:bg-button sm:p-2 rounded-lg cursor-pointer">
      <Image src={image} width={0} height={0} sizes="100vw" alt={name} className="rounded-full object-cover sm:h-10 sm:w-10 w-8 h-8"/>
      <div className="hidden sm:flex flex-col">
        <span className="text-white text-sm font-medium ">{name}</span>
        <span className="text-zinc-400 text-xs font-light ">{detail.length>30? detail.slice(0.30) + "...": detail}</span>
      </div>
    </div>
  )
}
export default UserCard