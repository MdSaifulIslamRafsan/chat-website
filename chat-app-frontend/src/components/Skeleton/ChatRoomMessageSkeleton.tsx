import { Skeleton } from "../ui/skeleton";

const ChatRoomSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-muted/10">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex flex-col w-full animate-pulse">
          {/* Randomize left/right alignment */}
          <div
            className={`flex items-center gap-5  ${
              index % 2 === 0
                ? "flex-row-reverse ml-auto items-end"
                : "flex-row mr-auto items-start"
            }`}
          >
            <Skeleton className="w-8 h-8 rounded-full bg-muted/50" />
            <div className="flex flex-col space-y-2">
              <Skeleton className="w-40 h-6 rounded-2xl bg-muted/50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomSkeleton;
