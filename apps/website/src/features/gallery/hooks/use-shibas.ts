import { useInfiniteQuery } from "@tanstack/react-query";
import { getShibas } from "../actions/get-shibas";

export function useShibas() {
  return useInfiniteQuery({
    queryKey: ["shibas"],
    queryFn: ({ pageParam }) => getShibas({ data: { cursor: pageParam } }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
