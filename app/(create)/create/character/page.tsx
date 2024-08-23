import CharacterCreate from "@/components/toffee/create/Character";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
import { getCandies, getCharacters } from "@/lib/query";
export default async function ChracterreatePage () {
   const session = await auth();
   const userId = session?.user.id
   const categories = await prismadb.category.findMany({
      select: {
         id: true,
         name: true,
         tags: true
      },
   });
   const addons = await getCandies(userId) 
   return <CharacterCreate categorielist={categories} addons={addons}/>
}