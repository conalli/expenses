import { AuthContext } from "@/components/providers/AuthProvider";
import { useContext } from "react";

export function useUser() {
  return useContext(AuthContext);
}
