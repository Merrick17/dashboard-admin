import { useToast } from "@/components/ui/use-toast";
import { del, get, post, put } from "@/lib/apiHelpers"; // Assuming this fetches data using appropriate authentication
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorageState } from "ahooks";

export const useProducts = () => {
  const { toast } = useToast();
  const BASE_ENDPOINT = "posts";
  const queryClient = useQueryClient();
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
    isLoading: isProductFetchingLoading,
    error: productFetchError,
    data: productData
  } = useQuery({
    queryKey: ["post-list"],
    queryFn: async () => {
      const fetchedProducts = await get(BASE_ENDPOINT, headers);
      return fetchedProducts; // Assuming successful response parsing in get()
    },
    enabled: !!authToken // Only fetch Products if authToken is available
  });
  const createProductMutation = useMutation({
    mutationFn: ({
      market,
      description
    }: {
      market: string;
      description: string;
    }) => post(BASE_ENDPOINT, { market, description }, headers),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Produit Ajouter avec success"
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post-list"] });
    }
  });
  const updateProductMutation = useMutation({
    mutationFn: ({
      market,
      description,
      ProductId
    }: {
      market: string;
      description: string;
      ProductId: string;
    }) =>
      put(`${BASE_ENDPOINT}/${ProductId}`, { market, description }, headers),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Produit Modifier avec success"
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post-list"] });
    }
  });
  const deleteProductMutation = useMutation({
    mutationFn: ({ ProductId }: { ProductId: string }) =>
      del(`${BASE_ENDPOINT}/${ProductId}`, headers),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Produit Supprimer avec success"
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post-list"] });
    }
  });

  return {
    isProductFetchingLoading,
    productFetchError,
    productData,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation
  };
};
