import { useToast } from "@/components/ui/use-toast";
import { del, get, post, put } from "@/lib/apiHelpers"; // Assuming this fetches data using appropriate authentication
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorageState } from "ahooks";

export const useMarkets = () => {
  const BASE_ENDPOINT = "markets";
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [authToken, setAuthToken] = useLocalStorageState<string | null>(
    "authToken",
    { defaultValue: null }
  );

  const headers = {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  };

  const {
    isLoading: isMarketFetchingLoading,
    error: marketFetchError,
    data: marketsData
  } = useQuery({
    queryKey: ["market-list"],
    queryFn: async () => {
      const fetchedMarkets = await get(BASE_ENDPOINT, headers);
      return fetchedMarkets; // Assuming successful response parsing in get()
    },
    enabled: !!authToken // Only fetch markets if authToken is available
  });
  const createMarketMutation = useMutation({
    mutationFn: ({
      marketName,
      state,
      city
    }: {
      marketName: String;
      state: String;
      city: String;
    }) => post(BASE_ENDPOINT, { marketName, city, state }, headers),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Marché ajouter avec success"
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["market-list"] });
    }
  });
  const updateMarketMutation = useMutation({
    mutationFn: ({
      marketName,
      state,
      city,
      marketId
    }: {
      marketName: String;
      state: String;
      city: String;
      marketId: string;
    }) =>
      put(`${BASE_ENDPOINT}/${marketId}`, { marketName, city, state }, headers),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Marché Modifier avec success"
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["market-list"] });
    }
  });
  const deleteMarketMutation = useMutation({
    mutationFn: ({ marketId }: { marketId: string }) =>
      del(`${BASE_ENDPOINT}/${marketId}`, headers),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Marché Supprimer avec success"
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["market-list"] });
    }
  });

  return {
    isMarketFetchingLoading,
    marketFetchError,
    marketsData,
    createMarketMutation,
    updateMarketMutation,
    deleteMarketMutation
  };
};
