import { RefreshCwIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16">
          <RefreshCwIcon className="origin-center animate-spin" />
        </div>
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    </div>
  );
}
