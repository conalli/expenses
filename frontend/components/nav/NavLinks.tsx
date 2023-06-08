"use client";

import { User } from "@/lib/models";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { UserAvatar } from "./UserAvatar";

export function NavLinks() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!user) {
      const userJSON = window.localStorage.getItem("EXPENSES_USER");
      if (userJSON) {
        const u = JSON.parse(userJSON);
        setUser(u);
      }
    }
  }, [user, pathname]);
  return (
    <ul className="flex gap-4">
      {!user ? (
        <li>
          <Button className="bg-emerald-600">
            <Link href="/signin">Sign in</Link>
          </Button>
        </li>
      ) : (
        <>
          <li>
            <Button className="bg-emerald-600">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </li>
          <li>
            <UserAvatar user={user} />
          </li>
        </>
      )}
    </ul>
  );
}
