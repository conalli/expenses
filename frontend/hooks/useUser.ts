import { COLLECTIONS_KEY } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AuthResponse } from "../components/auth/Auth";
import { Collection, User, userFromAuthResponse } from "../lib/models";

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

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const collections = useQuery<Collection[]>({
    queryKey: [COLLECTIONS_KEY, user?.token],
    queryFn: getCollections(user?.token),
    enabled: !!user,
  });

  useEffect(() => {
    if (user !== null) return;
    const data = getSessionUser();
    if (!data) window.location.assign("/");
    else {
      setUser(userFromAuthResponse(data));
    }
  }, [user]);

  return {
    user: { ...user, collections: collections.data || [] } as User,
    collections,
  };
}
