"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState, useTransition } from "react";
import { useDebounce } from "@/app/hooks/use-debounce";
import qs from "query-string";
import { BeatLoader } from "react-spinners";

export function SearchInputComponent({
  value,
  setValue,
  placeholder = "Search...",
}: {
  value: string;
  setValue: (s: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative flex items-center p-0">
      <span className="sr-only">Add-ons Search Input</span>
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder={placeholder}
        className="bg-primary/5 pl-10"
      />
    </div>
  );
}

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const name = searchParams.get("name");
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(name || "");
  const debouncedValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debouncedValue,
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
  }, [debouncedValue, router, categoryId]);

  return (
    <>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          onChange={onChange}
          value={value}
          placeholder="Search..."
          className="bg-primary/5 pl-10"
        />
      </div>
      {isPending ? <BeatLoader size={5} className="inline" /> : ""}
    </>
  );
};
