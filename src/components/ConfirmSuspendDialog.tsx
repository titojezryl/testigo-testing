import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

interface ConfirmSuspendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
  userName?: string;
  isSuspending: boolean;
}

export function ConfirmSuspendDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  userName,
  isSuspending,
}: ConfirmSuspendDialogProps) {
  const title = isSuspending ? "Suspend User" : "Activate User";
  const description = isSuspending
    ? `Are you sure you want to suspend ${userName ? `"${userName}"` : "this user"}? They will immediately lose access to the system.`
    : `Are you sure you want to activate ${userName ? `"${userName}"` : "this user"}? They will regain access to the system.`;
  const confirmLabel = isSuspending ? "Suspend" : "Activate";
  const pendingLabel = isSuspending ? "Suspending..." : "Activating...";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={
              isSuspending
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {pendingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
