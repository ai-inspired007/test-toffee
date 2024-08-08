import prismadb from "@/lib/prismadb";
import { auth, signIn } from "auth";


const CharacterIdPage = async ({ params }: {params: {characterId: string}}) => {
  const session = await auth();

  if (!session?.user) {
    await signIn();
    return;
  }

  const categories = await prismadb.category.findMany();

  return (
    <div className="-mt-4 flex-1 overflow-x-hidden md:pr-4">

    </div>
  );
};

export const metadata = {
  title: "Edit Character",
  description: "",
};

export default CharacterIdPage;
