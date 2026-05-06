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
    setDisplayedItems(items.slice(0, page * itemsPerPage));
  }, [items, page, itemsPerPage]);

  const hasMore = displayedItems.length < items.length;

  const loadMore = useCallback(() => {
    const nextPage = Math.min(page + 1, Math.ceil(items.length / itemsPerPage));
    if (nextPage === page) return;

    setPage(nextPage);
  }, [page, items.length, itemsPerPage]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset,
  };
};
