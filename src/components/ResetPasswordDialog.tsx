import { Key } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ResetPasswordDialogProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  trigger: React.ReactNode;
}

export function ResetPasswordDialog({ user, trigger }: ResetPasswordDialogProps) {
  return (
    <>{trigger}</>
  );
}