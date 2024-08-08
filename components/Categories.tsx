"use client";

import { Category } from "@prisma/client";
import { BeatLoader } from "react-spinners";
import { revalidatePath } from "next/cache";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  ChevronDown,
  FilterIcon,
  FilterXIcon,
  ListFilterIcon,
} from "lucide-react";
import { SearchInput } from "./SearchInput";
import { useState, useTransition } from "react";

interface CategoriesProps {
  data: Category[];
  hideSort?: boolean;
}

export const Categories = ({ data, hideSort }: CategoriesProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toLoad, setLoad] = useState("");

  const searchParams = useSearchParams();

  let categoryId = searchParams.get("categoryId");
  let sortBy = searchParams.get("sortBy");
  let name = searchParams.get("name");
  let currentCategory = data.find((item) => item.id == categoryId);

  const onTabChange = (id: string | undefined) => {
    // console.log(id);
    const query = { categoryId: id };
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true },
    );
    setLoad(id ?? "");
    startTransition(() => {
      router.push(url);
    });
  };

  const onTabChangeSort = (id: string | undefined) => {
    // console.log(id);
    const query = { sortBy: id };
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true },
    );
    setLoad(id + "sort");
    startTransition(() => {
      router.push(url);
    });
  };

  const updatePublic = (checked: boolean) => {
    const query = {
      hidePublic: checked ? "" : "true",
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipEmptyString: true, skipNull: true },
    );
    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <div className="items-between flex w-full flex-col justify-center gap-x-20 overflow-x-auto pb-3 pl-7 pt-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-row justify-between pr-4 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-0">
              <p className="pr-2 text-xl">Categories</p>
              <ChevronDown size={"xl"} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem key={""} onClick={() => onTabChange("")}>
              All
            </DropdownMenuItem>
            {data.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => onTabChange(item.id)}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {!hideSort && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-0">
                <ListFilterIcon size={"xl"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem key={""} onClick={() => onTabChangeSort("")}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem key={""} onClick={() => onTabChangeSort("1")}>
                Trending
              </DropdownMenuItem>
              <DropdownMenuItem key={""} onClick={() => onTabChangeSort("2")}>
                Popular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* <div className = "w-full">
          {<SearchInput />}
        </div> */}
      </div>
      <div className="hidden w-full items-center justify-between gap-x-2 lg:flex">
        <div className="mr-10 flex w-full justify-between">
          <Tabs
            key="main-tabs"
            defaultValue={categoryId || ""}
            onValueChange={onTabChange}
          >
            <TabsList className="hidden sm:grid sm:w-full sm:grid-cols-6">
              <TabsTrigger value="">All</TabsTrigger>
              {data.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {isPending && item.id == toLoad ? (
                    <BeatLoader size={5} />
                  ) : (
                    item.name
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {!hideSort && (
            <Tabs
              key="secondary-tabs"
              defaultValue={sortBy || ""}
              onValueChange={onTabChangeSort}
            >
              <TabsList className="hidden gap-1 sm:grid sm:w-full sm:grid-cols-3">
                <TabsTrigger value="">
                  {isPending && toLoad == "sort" ? (
                    <BeatLoader size={5} />
                  ) : (
                    "Trending"
                  )}
                </TabsTrigger>
                <TabsTrigger value="1">
                  {isPending && toLoad == "1sort" ? (
                    <BeatLoader size={5} />
                  ) : (
                    "Newest"
                  )}
                </TabsTrigger>
                <TabsTrigger value="2">
                  {isPending && toLoad == "2sort" ? (
                    <BeatLoader size={5} />
                  ) : (
                    "Popular"
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        {/* <div className = "pr-10">
          {<SearchInput />}
        </div> */}
      </div>
      {/* <div className = "flex items-center gap-x-2 pl-3 lg:pr-10 xl:pr-32">
                <Switch id = "switch" defaultChecked={true} onCheckedChange={((checked) => {updatePublic(checked)})}/>
                <Label className = "text-gray-700"> Show Public Models </Label>
            </div> */}
    </div>
  );
};
