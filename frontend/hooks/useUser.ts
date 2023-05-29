import { useEffect, useState } from "react";
import { AuthResponse } from "../components/auth/Auth";
import { Group, User, userFromAuthResponse } from "../lib/models";

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

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user !== null) return;
    const data = getLocalUser();
    if (!data) window.location.assign("/");
    else {
      const addGroupToUser = async (res: AuthResponse) => {
        try {
          const groups = await getGroups(res.token);
          const filteredGroups = groups.map((g) => {
            const members = g.members.filter((m) => m.id !== res.user_id);
            return { ...g, members } as Group;
          });
          console.log(filteredGroups);
          setUser((prev) => {
            if (!prev) return { groups: filteredGroups } as User;
            else return { ...prev, groups: filteredGroups };
          });
        } catch (error) {
          console.error(error);
        }
      };
      setUser(userFromAuthResponse(data as AuthResponse));
      addGroupToUser(data);
    }
  }, [user]);

  return { user };
}
