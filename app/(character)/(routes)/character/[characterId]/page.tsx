import prismadb from "@/lib/prismadb";
import { auth, signIn } from "auth";
import CharacterPage from "@/components/toffee/character";
import { getCharacter, getCategoriesWithTag, getCandies, getVoices } from "@/lib/query";
const CharacterIdPage = async ({ params }: {params: {characterId: string}}) => {
  const session = await auth();

  if (!session?.user) {
    await signIn();
    return;
  }
  const character = await getCharacter(params.characterId)
  const categories = await getCategoriesWithTag();
  const voices = await getVoices();
  const candies = await getCandies({})

  return (
    <CharacterPage character={character} knowledges={candies} voices={voices} categories={categories}/>
  );
};

export const metadata = {
  title: "Edit Character",
  description: "",
};

export default CharacterIdPage;
