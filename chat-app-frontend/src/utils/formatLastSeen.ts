// utils/formatLastSeen.ts
export default function formatLastSeen(dateString?: string): string {
  if (!dateString) return "Last seen recently";

  const lastSeen = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) return `Last seen recently`;
  // Minutes ago
  if (diffMin < 60)
    return `Last seen ${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;

  // Hours ago (today)
  if (lastSeen.toDateString() === now.toDateString() && diffHour < 24) {
    return `Last seen ${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  }

  // Yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (lastSeen.toDateString() === yesterday.toDateString()) {
    return `Last seen yesterday at ${lastSeen.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Older dates
  return `Last seen on ${lastSeen.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} at ${lastSeen.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
