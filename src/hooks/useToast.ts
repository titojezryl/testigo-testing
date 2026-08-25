import { toast as sonnerToast, ToastT } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
  position?: ToastT['position'];
}

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, variant = 'default', duration, position } = props;

    const toastOptions: any = {
      duration: duration || 4000,
      position: position || 'top-right',
    };

    switch (variant) {
      case 'success':
        return sonnerToast.success(title || 'Success', {
          ...toastOptions,
          description,
        });
      case 'destructive':
        return sonnerToast.error(title || 'Error', {
          ...toastOptions,
          description,
        });
      default:
        return sonnerToast(title || 'Notification', {
          ...toastOptions,
          description,
        });
    }
  };

  return { toast };
}
