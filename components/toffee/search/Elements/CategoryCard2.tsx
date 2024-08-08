import { Category as BaseCategory, Character } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
interface Category extends BaseCategory {
  characters: Character[];
}
const CategoryCard2 = ({ category, index }: { category: Category, index: number }) => {
  const colors = ["#7046D5", "#B059CE", "#24A580", "#466BD5", "#BD748E", "#D5574D", "#2B76E0", "#2B76E0"];
  const fromColor = colors[index % 8];
  return (
    <Link href={`/categories/${category.id}`} className={`flex h-[180px] w-[266px] flex-col items-center justify-center rounded-2xl relative overflow-hidden`} style={{ backgroundColor: fromColor }}>
      <div className="flex flex-col gap-1 items-start w-full p-5 flex-grow absolute top-0 left-0">
        <span className=" font-[500] text-white text-lg">{category.name}</span>
        <span className=" text-xs text-text-sub">
          {category.characters.length}{" "}
          {category.characters.length > 1 ? "Characters" : "Character"}
        </span>
      </div>
      {category.characters.length>0 && <>
        <div className="w-[121px] h-[154px] left-[81px] top-[130px] absolute origin-top-left rotate-[-12deg] bg-gradient-to-l from-white to-white/30 rounded-lg border border-white/30 backdrop-blur-[50.05px]" />
        <div className="w-[121px] h-[154px] left-[104px] top-[87px] absolute origin-top-left rotate-[-1.5deg] bg-gradient-to-l from-white to-white/30 rounded-lg border border-white/30 backdrop-blur-[50.05px]" />
        <Image className="w-[121px] h-[154px] left-[136px] top-[56px] absolute origin-top-left rotate-[11deg] rounded-xl border border-white/30 object-cover" src={category.characters[0].image} alt="" width={0} height={0} sizes="100vw"/>
        </>}
    </Link>
  );
};

export default CategoryCard2;
