import { Category as BaseCategory, Character } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface Category extends BaseCategory {
  characters: Character[];
}
const CategoryCard = ({ category, index }: { category: Category, index:number }) => {
  const colors = ["#6E3FF34D", "#F7604C4D", "#BCB8C54D", "#FEDEAD4D", "#FEDEAD4D"];
  const fromColor = colors[index % 5];
  const router = useRouter();
  return (
    <div className="flex h-64 w-52 flex-col items-center justify-center rounded-2xl cursor-pointer" onClick={()=>router.push(`/categories/${category.id}`)}>
      <div className="flex flex-col items-center p-2 w-full justify-end rounded-t-2xl h-40"
        style={{ backgroundImage: `linear-gradient(to bottom, ${fromColor}, #202020)` }}>
        {category.characters.length > 2 && <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="57"
            height="72"
            viewBox="0 0 57 72"
            fill="none"
          >
            <mask id="path-1-inside-1_793_5723" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 71.0239C35.062 71.0239 57 49.0858 57 22.0239C57 19.9985 56.8771 18.0018 56.6384 16.0409C55.0667 3.13027 40.618 -3.2521 29.4321 3.3835C11.8117 13.8362 0 33.0506 0 55.0239C0 58.3704 0.273969 61.6529 0.800701 64.8502C1.3856 68.4005 4.40178 71.0239 8 71.0239Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 71.0239C35.062 71.0239 57 49.0858 57 22.0239C57 19.9985 56.8771 18.0018 56.6384 16.0409C55.0667 3.13027 40.618 -3.2521 29.4321 3.3835C11.8117 13.8362 0 33.0506 0 55.0239C0 58.3704 0.273969 61.6529 0.800701 64.8502C1.3856 68.4005 4.40178 71.0239 8 71.0239Z"
              fill={`url(#${category.characters[0].id})`}
            />
            <path
              d="M55 22.0239C55 47.9813 33.9574 69.0239 8 69.0239V73.0239C36.1665 73.0239 59 50.1904 59 22.0239H55ZM54.6531 16.2826C54.882 18.1635 55 20.0795 55 22.0239H59C59 19.9175 58.8722 17.8401 58.6237 15.7992L54.6531 16.2826ZM2 55.0239C2 33.7855 13.4142 15.211 30.4525 5.10361L28.4117 1.66338C10.2092 12.4614 -2 32.3158 -2 55.0239H2ZM2.7741 64.5251C2.265 61.4348 2 58.261 2 55.0239H-2C-2 58.4797 -1.71707 61.8709 -1.1727 65.1753L2.7741 64.5251ZM-1.1727 65.1753C-0.432744 69.6668 3.3977 73.0239 8 73.0239V69.0239C5.40586 69.0239 3.20394 67.1342 2.7741 64.5251L-1.1727 65.1753ZM58.6237 15.7992C56.861 1.31904 40.7192 -5.63758 28.4117 1.66338L30.4525 5.10361C40.5167 -0.866627 53.2724 4.9415 54.6531 16.2826L58.6237 15.7992Z"
              fill="#121212"
              mask="url(#path-1-inside-1_793_5723)"
            />
            <defs>
              <pattern
                id={category.characters[0].id}
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref={`#${category.characters[0].name}`}
                  transform="matrix(0.00120436 0 0 0.000976562 -0.116635 0)"
                />
              </pattern>
              <image
                id={category.characters[0].name}
                width="1024"
                height="1024"
                xlinkHref={category.characters[0].image}
              />
            </defs>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="61"
            height="75"
            viewBox="0 0 61 75"
            fill="none"
          >
            <mask id="path-1-inside-1_793_5729" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.33763 7.34555C5.54512 1.69041 11.7247 -1.20098 17.5605 0.471304C42.6435 7.65891 61 30.7641 61 58.1567C61 59.8932 60.9262 61.6124 60.7817 63.3114C60.2652 69.3817 55.3363 74.1264 49.2441 74.1561C49.1628 74.1565 49.0814 74.1567 49 74.1567C21.938 74.1567 0 52.2187 0 25.1567C0 18.8733 1.1827 12.8661 3.33763 7.34555Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.33763 7.34555C5.54512 1.69041 11.7247 -1.20098 17.5605 0.471304C42.6435 7.65891 61 30.7641 61 58.1567C61 59.8932 60.9262 61.6124 60.7817 63.3114C60.2652 69.3817 55.3363 74.1264 49.2441 74.1561C49.1628 74.1565 49.0814 74.1567 49 74.1567C21.938 74.1567 0 52.2187 0 25.1567C0 18.8733 1.1827 12.8661 3.33763 7.34555Z"
              fill={`url(#${category.characters[1].id})`}
            />
            <path
              d="M49.2441 74.1561L49.249 75.1561L49.2441 74.1561ZM3.33763 7.34555L2.40609 6.98192L3.33763 7.34555ZM17.2851 1.43261C41.9505 8.5006 60 31.2221 60 58.1567H62C62 30.3061 43.3364 6.81723 17.836 -0.490007L17.2851 1.43261ZM60 58.1567C60 59.8648 59.9274 61.5558 59.7853 63.2266L61.7781 63.3962C61.925 61.669 62 59.9215 62 58.1567H60ZM49.2393 73.1561C49.1595 73.1565 49.0798 73.1567 49 73.1567V75.1567C49.083 75.1567 49.1661 75.1565 49.249 75.1561L49.2393 73.1561ZM49 73.1567C22.4903 73.1567 1 51.6664 1 25.1567H-1C-1 52.7709 21.3858 75.1567 49 75.1567V73.1567ZM1 25.1567C1 18.9997 2.15876 13.1157 4.26918 7.70918L2.40609 6.98192C0.206647 12.6165 -1 18.7469 -1 25.1567H1ZM59.7853 63.2266C59.3107 68.8042 54.7912 73.129 49.2393 73.1561L49.249 75.1561C55.8814 75.1237 61.2196 69.9593 61.7781 63.3962L59.7853 63.2266ZM17.836 -0.490007C11.5272 -2.29782 4.81001 0.823571 2.40609 6.98192L4.26918 7.70918C6.28024 2.55725 11.9222 -0.10414 17.2851 1.43261L17.836 -0.490007Z"
              fill="#121212"
              mask="url(#path-1-inside-1_793_5729)"
            />
            <defs>
              <pattern
                id={category.characters[1].id}
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref={`#${category.characters[1].name}`}
                  transform="matrix(0.00118719 0 0 0.000976562 -0.107842 0)"
                />
              </pattern>
              <image
                id={category.characters[1].name}
                width="1024"
                height="1024"
                xlinkHref={category.characters[1].image}
              />
            </defs>
          </svg>
        </div>
        <div className="-mt-4 mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="85"
            height="56"
            viewBox="0 0 85 56"
            fill="none"
          >
            <mask id="path-1-inside-1_793_5726" fill="white">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.21398 44.2766C-0.532614 37.8097 -2.41398 25.3207 4.67737 17.0723C13.6637 6.61979 26.9831 0 41.8487 0C58.0484 0 72.412 7.86129 81.3327 19.9771C87.7759 28.728 84.9606 41.029 75.7634 46.8173C66.5197 52.6348 55.5772 56 43.8487 56C30.505 56 18.1786 51.6441 8.21398 44.2766Z"
              />
            </mask>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.21398 44.2766C-0.532614 37.8097 -2.41398 25.3207 4.67737 17.0723C13.6637 6.61979 26.9831 0 41.8487 0C58.0484 0 72.412 7.86129 81.3327 19.9771C87.7759 28.728 84.9606 41.029 75.7634 46.8173C66.5197 52.6348 55.5772 56 43.8487 56C30.505 56 18.1786 51.6441 8.21398 44.2766Z"
              fill={`url(#${category.characters[2].id})`}
            />
            <path
              d="M81.3327 19.9771L80.5275 20.57L81.3327 19.9771ZM75.7634 46.8173L75.2308 45.971L75.7634 46.8173ZM8.21398 44.2766L7.61946 45.0807L8.21398 44.2766ZM5.43566 17.7242C14.2401 7.48326 27.2867 1 41.8487 1V-1C26.6795 -1 13.0872 5.75632 3.91908 16.4204L5.43566 17.7242ZM41.8487 1C57.7171 1 71.7871 8.69915 80.5275 20.57L82.138 19.3842C73.0369 7.02343 58.3797 -1 41.8487 -1V1ZM75.2308 45.971C66.1419 51.691 55.3833 55 43.8487 55V57C55.7712 57 66.8976 53.5786 76.2961 47.6636L75.2308 45.971ZM43.8487 55C30.7262 55 18.6069 50.7171 8.80849 43.4725L7.61946 45.0807C17.7503 52.5711 30.2837 57 43.8487 57V55ZM80.5275 20.57C86.5988 28.8159 83.9762 40.467 75.2308 45.971L76.2961 47.6636C85.945 41.591 88.953 28.6401 82.138 19.3842L80.5275 20.57ZM3.91908 16.4204C-3.58102 25.1443 -1.55681 38.2961 7.61946 45.0807L8.80849 43.4725C0.49158 37.3233 -1.24694 25.4972 5.43566 17.7242L3.91908 16.4204Z"
              fill="#121212"
              mask="url(#path-1-inside-1_793_5726)"
            />
            <defs>
              <pattern
                id={category.characters[2].id}
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref={`#${category.characters[2].name}`}
                  transform="matrix(0.005 0 0 0.0075441 0 -0.246866)"
                />
              </pattern>
              <image
                id={category.characters[2].name}
                width="200"
                height="198"
                xlinkHref={category.characters[2].image}
              />
            </defs>
          </svg>
        </div>
        </div>}
        {category.characters.length === 2 && 
        <div className="flex flex-row items-center pb-6">
          <Image src={category.characters[0].image} alt={category.characters[0].name} width={80} height={80} className="rounded-full"/>
          <Image src={category.characters[1].image} alt={category.characters[1].name} width={80} height={80} className="-ml-6 rounded-full"/>
        </div>}
        {category.characters.length === 1 && 
        <div className="flex flex-row items-center pb-6">
          <Image src={category.characters[0].image} alt={category.characters[0].name} width={100} height={100} className="rounded-full"/>
        </div>}
      </div>
      <div className="flex flex-col gap-1 items-center bg-[#202020] rounded-b-2xl w-full p-4 flex-grow">
      <span className=" font-[500] text-white">{category.name}</span>
      <span className=" text-sm text-[#777777]">
        {category.characters.length}{" "}
        {category.characters.length > 1 ? "Characters" : "Character"}
      </span>
      </div>
    </div>
  );
};

export default CategoryCard;
