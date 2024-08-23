import { TagPage } from "@/components/toffee/tag";
import { getTag, getCharacters } from "@/lib/query";
import {auth} from '@/auth'
const TagSearch = async ({ params }: { params: { tagId: string | number } }) => {
  const session = await auth();
  const userId = session?.user.id
  const tag = await getTag(params.tagId);
  const characterlist = await getCharacters({userId});
  const matchedList = characterlist.filter((item) => item.tags.some(characterTag => characterTag.id === params.tagId));
  let totChats = 0;
  matchedList.map((item) => totChats + item._count.messages);
  return (
    <TagPage tag={tag} characters={matchedList} chats={totChats}/>
  )
}

export default TagSearch;
