import { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollOptions {
  onLoadMore: () => void; 
  isLoading?: boolean; 
  direction?: "up" | "down"; 
}

export const useInfiniteScroll = ({
  onLoadMore,
  isLoading = false,
  direction = "up",
}: InfiniteScrollOptions) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (direction === "down") {
      if (scrollHeight - scrollTop - clientHeight < 5) {
        onLoadMore();
      }
    } else {
      if (scrollTop <= 0) {
        onLoadMore();
      }
    }
  }, [isLoading, onLoadMore, direction]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return containerRef;
};
