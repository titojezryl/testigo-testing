import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

interface CreateUserDialogProps {
  trigger?: React.ReactNode;
}

export function CreateUserDialog({ trigger }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Button onClick={() => setOpen(true)}>
      <Plus className="h-4 w-4 mr-2" />
      Add User
    </Button>
  );
}