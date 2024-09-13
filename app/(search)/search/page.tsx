import { SearchPage } from "@/components/toffee/search";
import { auth } from "auth";
import { sortedCharacters, getCandies, getCategories, getTags, getUsers, getVoices } from "@/lib/query";

const Search = async () => {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id || "public";

  const characters = await sortedCharacters(userId)
  const knowledges = await getCandies(userId)
  const categories = await getCategories();
  const tags = await getTags();
  const users = await getUsers();
  const voicelist = await getVoices();
  return (
    <SearchPage
      characterlist={characters}
      userlist={users}
      knowledges={knowledges}
      categories={categories}
      tags={tags}
      voicelist={voicelist}
    />
  );
};

export default Search;