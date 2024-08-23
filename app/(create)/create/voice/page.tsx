import VoiceCreate from "@/components/toffee/create/Voice";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";

export type VoiceType = {
  name: string;
  voiceId: number;
  description: string;
  itemTypeId: number;
};

export default async function VoiceCreatePage() {
  const session = await auth();
  const userId = session?.user.id;

  return <VoiceCreate />;
}
