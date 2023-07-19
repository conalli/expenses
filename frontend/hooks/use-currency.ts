import { useToast } from "@/components/ui/use-toast";
import { Currency, UserWithToken } from "@/lib/api/models";
import { apiURL } from "@/lib/api/url";
import { CURRENCIES_KEY } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

const getCurrencies = (token?: string) => {
  return async () => {
    const res = await fetch(apiURL("/currency/"), {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (res.status !== 200) throw new Error("OMG");
    return (await res.json()) as Currency[];
  };
};

export function useCurrency(user?: UserWithToken) {
  const { toast } = useToast();
  return useQuery({
    queryKey: [CURRENCIES_KEY, user?.token],
    queryFn: getCurrencies(user?.token),
    enabled: !!user,
    onError: (_err) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "could not get expense currencies",
      });
    },
  });
}
