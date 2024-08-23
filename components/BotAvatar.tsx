import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface BotAvatarProps {
  image: string;
  size: number;
}

export const BotAvatar = ({ image, size }: BotAvatarProps) => {
  return (
    <Avatar className={cn(`h-${size} w-${size}`)}>
      <AvatarImage className="object-cover object-center" src={image} />
    </Avatar>
  );
};
