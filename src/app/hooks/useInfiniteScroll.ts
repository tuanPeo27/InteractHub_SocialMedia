import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  items: T[];
  itemsPerPage?: number;
}

interface UseInfiniteScrollReturn<T> {
  displayedItems: T[];
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

export const useInfiniteScroll = <T,>({
  items,
  itemsPerPage = 5,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> => {
  const [page, setPage] = useState(1);
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);

  useEffect(() => {
    setDisplayedItems(items.slice(0, itemsPerPage));
    setPage(1);
  }, [items, itemsPerPage]);

  const hasMore = displayedItems.length < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    
    const nextPage = page + 1;
    const newItems = items.slice(0, nextPage * itemsPerPage);
    setDisplayedItems(newItems);
    setPage(nextPage);
  }, [page, items, itemsPerPage, hasMore]);

  const reset = useCallback(() => {
    setDisplayedItems(items.slice(0, itemsPerPage));
    setPage(1);
  }, [items, itemsPerPage]);

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset,
  };
};
