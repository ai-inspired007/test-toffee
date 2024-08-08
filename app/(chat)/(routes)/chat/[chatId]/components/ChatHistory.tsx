import { DropdownWrapper } from "@/components/tulpa/chat/dropdown-wrapper";
import { Message } from "@prisma/client";
import { formatHistoryDate } from "./time-format";
type ChatHistoryProps = {
  messages: Message[];
};

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <DropdownWrapper label="Chat History">
      <div className={`flex max-h-full w-full flex-col gap-2 overflow-y-auto no-scrollbar`}>
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className="flex max-h-full cursor-pointer flex-col items-start gap-1 rounded-lg p-3 hover:bg-bg-3"
              onClick={() => {
                console.log(
                  `Clicked on message with characterId: ${message.characterId}`,
                );
              }}
            >
              <span className="text-xs  text-[#727272]">{formatHistoryDate(message.createdAt)}</span>
              <span className="line-clamp-1  text-sm text-text-sub">
                {message.content}
              </span>
            </div>
          );
        })}
      </div>
    </DropdownWrapper>
  );
}
