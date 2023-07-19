import { useToast } from "@/components/ui/use-toast";
import { Category, UserWithToken } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { CATEGORIES_KEY } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

const getCategories = (token?: string) => {
  return async () => {
    const res = await fetch(apiURL("/category/"), {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (res.status !== 200) throw new Error("OMG");
    return (await res.json()) as Category[];
  };
};

export function useCategory(user?: UserWithToken) {
  const { toast } = useToast();
  return useQuery({
    queryKey: [CATEGORIES_KEY, user?.token],
    queryFn: getCategories(user?.token),
    enabled: !!user,
    onError: (_err) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "could not get collection categories",
      });
    },
  });
}
