import {
  Collection,
  UserWithToken,
  userFromAuthResponse,
} from "@/lib/api/models";
import { AuthResponse } from "@/lib/api/response";
import { COLLECTIONS_KEY } from "@/lib/query-keys";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";

type AuthContext = {
  user?: UserWithToken;
  isError: boolean;
  isLoading: boolean;
  collections: UseQueryResult<Collection[], unknown>;
};

export const AuthContext = createContext<AuthContext>({} as AuthContext);

const getSessionUser = (): AuthResponse | null => {
  const userData = window.sessionStorage.getItem("EXPENSES_USER");
  if (!userData) {
    return null;
  }
  return JSON.parse(userData) as AuthResponse;
};

const getCollections = (token?: string) => {
  if (!token) return;
  return async (): Promise<Collection[]> => {
    const response = await fetch("/api/group/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.status !== 200) {
      throw new Error("could not get users groups");
    }
    return response.json() as Promise<Collection[]>;
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithToken>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const collections = useQuery<Collection[]>({
    queryKey: [COLLECTIONS_KEY, user?.token],
    queryFn: getCollections(user?.token),
    enabled: !!user,
    onSuccess: (data: Collection[]) => {
      if (!user) return;
      setUser((prev) => {
        return { ...prev, collections: data } as UserWithToken;
      });
    },
  });

  useEffect(() => {
    if (user !== undefined) return;
    console.log("hello");
    setIsLoading(true);
    const data = getSessionUser();
    if (!data) {
      setIsLoading(false);
      setIsError(true);
      window.location.assign("/");
    } else {
      setIsLoading(false);
      setUser(userFromAuthResponse(data));
    }
  }, [user]);

  const authMemo = useMemo(
    () => ({
      collections,
      isError,
      isLoading,
      user,
    }),
    [collections, isError, isLoading, user]
  );
  return (
    <AuthContext.Provider value={authMemo}>{children}</AuthContext.Provider>
  );
}
