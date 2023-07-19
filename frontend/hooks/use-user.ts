import { AuthContext } from "@/components/providers/auth";
import { useContext } from "react";

export function useUser() {
  return useContext(AuthContext);
}
