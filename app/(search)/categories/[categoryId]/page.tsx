import { GetServerSideProps } from 'next';  
import { CategoryPage } from '@/components/toffee/category';  
import prismadb from '@/lib/prismadb';  
import { Category, Character as BaseCharacter, Tag as BaseTag } from "@prisma/client";  

interface Character extends BaseCharacter {  
  _count: {  
    messages: number;  
  };  
  tags: Tag[];  
}  

interface Tag extends BaseTag {  
  tag: {  
    id: string;  
    name: string;  
    categoryId: string;  
  }  
}  

const CategorySearch = async ({ params }: { params: { categoryId: string | number } }) => {  
  const categoryData = await prismadb.category.findUnique({  
    where: {  
      id: params.categoryId as string,  
    },  
    include: {  
      characters: {  
        include: {  
          tags: {  
            include: {  
              tag: true  
            }  
          },  
          _count: { select: { messages: true } }  
        }  
      },  
      tags: true  
    },  
  });  

  if (categoryData && categoryData.characters) {  
    // Transform the character data to fit the structure expected by the front end  
    const transformedCharacters = categoryData.characters.map(character => ({  
      ...character,  
      tags: character.tags.map((tagRelation) => tagRelation.tag)  
    }));  

    const transformedData = {  
      ...categoryData,  
      characters: transformedCharacters  
    };  

    return <CategoryPage data={transformedData} />;  
  }  

  return <CategoryPage data={null} />;  
};  

export default CategorySearch;