"use client";
import {
  Collection,
  UserWithToken,
  userFromAuthResponse,
} from "@/lib/api/models";
import { AuthResponse } from "@/lib/api/response";
import { apiURL } from "@/lib/api/url";
import { COLLECTIONS_KEY } from "@/lib/query-keys";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContext = {
  user?: UserWithToken;
  isError: boolean;
  isLoading: boolean;
  collections: UseQueryResult<Collection[], unknown>;
  logout: () => void;
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
    const response = await fetch(apiURL("/group/"), {
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

const ALLOWED_PATHS = ["/", "/signin", "/signup"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithToken>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
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

  const logout = useCallback(() => {
    window.sessionStorage.removeItem("EXPENSES_USER");
    setUser(undefined);
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (user !== undefined) return;
    setIsLoading(true);
    const data = getSessionUser();
    if (!data) {
      if (!ALLOWED_PATHS.includes(pathname)) {
        setIsLoading(false);
        setIsError(true);
        window.location.assign("/");
      }
    } else {
      setIsLoading(false);
      setUser(userFromAuthResponse(data));
    }
  }, [pathname, user]);

  const authMemo = useMemo(
    () => ({
      collections,
      isError,
      isLoading,
      user,
      logout,
    }),
    [collections, isError, isLoading, logout, user]
  );
  return (
    <AuthContext.Provider value={authMemo}>{children}</AuthContext.Provider>
  );
}
