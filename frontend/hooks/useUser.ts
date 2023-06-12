import { AuthContext } from "@/components/auth/AuthProvider";
import { useContext } from "react";

export function useUser() {
  return useContext(AuthContext);
}
