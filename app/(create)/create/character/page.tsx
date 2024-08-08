import CharacterCreate from "@/components/toffee/create/Character";
import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
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
   const addons = await prismadb.knowledgePack.findMany({
      where: {
         AND: {
            OR: [
               {userId: "public" || userId},
               {sharing: "public"}
            ],
            type: "PACK"
         }
      }
   })
   return <CharacterCreate categorielist={categories} addons={addons}/>
}