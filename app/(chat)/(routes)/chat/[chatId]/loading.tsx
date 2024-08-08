import { BottomBar } from "@/components/BottomBar";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function ChatLoading() {
  return <LoadingSkeleton />;
}

function LoadingSkeleton() {
  return (
    <>
      <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl lg:text-5xl">
        Loading...
      </h1>
    </>
  );
}
