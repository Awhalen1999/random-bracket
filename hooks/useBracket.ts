import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTodaysBracket,
  submitBracket,
  getResults,
  type SubmitBracketRequest,
} from "@/api/bracket";
import { QueryKeys } from "@/lib/query-keys";

// Hook to get today's bracket items
export function useTodaysBracket() {
  return useQuery({
    queryKey: [QueryKeys.Bracket],
    queryFn: getTodaysBracket,
  });
}

// Hook to submit bracket winner
export function useSubmitBracket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitBracketRequest) => submitBracket(data),
    onSuccess: () => {
      // Invalidate results to refetch after submission
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Results] });
    },
  });
}

// Hook to get results for a specific date
export function useResults(date: string) {
  return useQuery({
    queryKey: [QueryKeys.Results, date],
    queryFn: () => getResults(date),
    enabled: !!date, // Only run query if date is provided
  });
}
