const ConversationsListSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {skeletonItems.map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between gap-3 p-3 rounded-xl animate-pulse bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted/50" />{" "}
            {/* Avatar */}
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 rounded bg-muted/50" /> {/* Name */}
              <div className="w-48 h-3 rounded bg-muted/50" />{" "}
              {/* Last message */}
            </div>
          </div>
          <div className="w-5 h-5 rounded-full bg-muted/50" /> {/* Badge */}
        </div>
      ))}
    </div>
  );
};

export default ConversationsListSkeleton;
