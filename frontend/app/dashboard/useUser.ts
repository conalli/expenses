import { useEffect, useState } from "react";
import { AuthResponse } from "../Auth";
import { Group, User, userFromAuthResponse } from "./User";

const getLocalUser = (): AuthResponse | null => {
  const userData = window.localStorage.getItem("EXPENSES_USER");
  if (!userData) {
    return null;
  }
  return JSON.parse(userData) as AuthResponse;
};

const getGroups = async (token: string): Promise<Group[]> => {
  const response = await fetch("/api/group/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("could not get users groups");
  }
  return response.json() as Promise<Group[]>;
};

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user !== null) return;
    const data = getLocalUser();
    if (!data) window.location.assign("/");
    else {
      const addGroupToUser = async () => {
        try {
          const groups = await getGroups(data.token);
          setUser((prev) => {
            if (!prev) return { groups } as User;
            else return { ...prev, groups };
          });
        } catch (error) {
          console.error(error);
        }
      };
      addGroupToUser();
      setUser(userFromAuthResponse(data as AuthResponse));
    }
  }, [user]);

  console.log("USER", user);

  return { user };
}
