"use client";

import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { Button } from "../button";
import { UserAvatar } from "./UserAvatar";

export function NavLinks() {
  const { user } = useUser();
  return (
    <ul className="flex gap-4">
      {!user ? (
        <li>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/signin">Sign in</Link>
          </Button>
        </li>
      ) : (
        <>
          <li>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </li>
          <li>{user.username && <UserAvatar user={user} />}</li>
        </>
      )}
    </ul>
  );
}
