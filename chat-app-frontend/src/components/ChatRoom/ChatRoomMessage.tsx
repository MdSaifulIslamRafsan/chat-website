import { cn } from "../../lib/utils";

const ChatRoomMessage = () => {
  const messages = [
    {
      id: "1",
      text: "Wait. I'm looking into it!",
      sender: "me",
      time: "10:58 AM",
    },
    {
      id: "2",
      text: "Let me know if it works or not?",
      sender: "other",
      time: "11:11 AM",
    },
    {
      id: "3",
      text: "I checked it. Yep, that works!",
      sender: "me",
      time: "11:13 AM",
    },
    {
      id: "4",
      text: "Perfect! I'll prepare the next phase then.",
      sender: "other",
      time: "11:14 AM",
    },
    {
      id: "5",
      text: "Sounds good. When do you think it'll be ready?",
      sender: "me",
      time: "11:15 AM",
    },
    {
      id: "6",
      text: "Should be done by tomorrow morning.",
      sender: "other",
      time: "11:15 AM",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-muted/10">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex flex-col max-w-[80%]",
            msg.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-2 text-sm shadow-sm",
              msg.sender === "me"
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-muted text-foreground rounded-tl-none"
            )}
          >
            {msg.text}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1">
            {msg.time}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomMessage;
