import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
interface UserAvatarProps {
  size?: number;
}
export const UserAvatar = ({ size }: UserAvatarProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <Avatar className={size ? cn(`h-${size} w-${size}`) : "h-8 w-8"}>
      <AvatarImage className="object-cover" src={user?.image ?? "/profile/default_user.png"} />
    </Avatar>
  );
};
