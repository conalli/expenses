"use client";

import { User } from "@/lib/api/models";
import { stringToColor } from "@/lib/avatar";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../avatar";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";

export function UserAvatar({ user }: { user: User }) {
  const router = useRouter();
  const logOut = () => {
    window.sessionStorage.removeItem("EXPENSES_USER");
    router.push("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback
            style={{ backgroundColor: stringToColor(user.username) }}
            className="text-white border-white border-2 shadow"
          >
            {user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{`@${user.username}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button className="w-full" onClick={() => logOut()}>
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
