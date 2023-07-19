import { DialogContext } from "@/components/providers/dialog";
import { useContext } from "react";

export function useDialog() {
  return useContext(DialogContext);
}
