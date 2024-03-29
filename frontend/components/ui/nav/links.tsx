"use client";

import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../button";
import { UserAvatar } from "./user-avatar";

export function NavLinks() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUser();
  return (
    <ul className="flex gap-4">
      {!user ? (
        <li>
          <Button
            onClick={() => router.push("/signin")}
            className="bg-emerald-600 hover:bg-emerald-600/90"
          >
            <Link href="/signin">Sign in</Link>
          </Button>
        </li>
      ) : (
        <>
          <li>
            <Button
              disabled={pathname === "/dashboard"}
              onClick={() => router.push("/dashboard")}
              className="bg-emerald-600 hover:bg-emerald-600/90"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </li>
          <li>{user.username && <UserAvatar user={user} logout={logout} />}</li>
        </>
      )}
    </ul>
  );
}
