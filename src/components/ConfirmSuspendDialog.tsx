import { Ban, CheckCircle } from "lucide-react";
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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isSuspending ? "Suspend User" : "Activate User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isSuspending ? "suspend" : "activate"} {userName}? 
            This will {isSuspending ? "prevent" : "allow"} them from accessing the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={isSuspending ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {isPending ? (
              "Processing..."
            ) : (
              <>
                {isSuspending ? (
                  <Ban className="h-4 w-4 mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isSuspending ? "Suspend" : "Activate"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}