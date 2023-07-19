import { ReactNode, createContext, useState } from "react";

export type DashboardDialogType =
  | "add-expense"
  | "add-receipt"
  | "delete-expense"
  | null;

type DashboardDialogContext = {
  type: DashboardDialogType;
  open: boolean;
  setOpen: (open: boolean, dialogType: DashboardDialogType) => void;
};

export const DialogContext = createContext<DashboardDialogContext>(
  {} as DashboardDialogContext
);

export function DialogProvider({
  children,
}: {
  children: ReactNode | undefined;
}) {
  const [type, setType] = useState<DashboardDialogType>(null);
  const [open, setOpen] = useState(false);
  const toggleOpen = (isOpen: boolean, dialogType: DashboardDialogType) => {
    setOpen(isOpen);
    setType(dialogType);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen: toggleOpen, type }}>
      {children}
    </DialogContext.Provider>
  );
}
