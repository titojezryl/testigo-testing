import { Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";

interface EditUserDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string | null;
  };
  trigger: React.ReactNode;
}

export function EditUserDialog({ user, trigger }: EditUserDialogProps) {
  return (
    <>{trigger}</>
  );
}