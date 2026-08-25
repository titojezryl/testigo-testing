import { useState } from "react";
import { TextField } from "./ui/TextField";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useAxios } from "~/hooks/useAxios";
import { toast } from "sonner";
import { useLoader } from "~/store/useLoader";

interface PasswordForm {
  currentPassword: string | null;
  newPassword: string | null;
  confirmNewPassword: string | null;
}

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const { $http } = useAxios();
  const { loading, start, stop } = useLoader();
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: null,
    newPassword: null,
    confirmNewPassword: null
  });
  const [passwordFormErrors, setPasswordFormErrors] = useState<Record<string, any>>({});

  const passwordValidator = (password: string) => {
    const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
    const validPassword = regExp.test(password);

    if (password) {
      return validPassword || 'Password must contain at least one number, one special character, and both uppercase and lowercase letters';
    }
  };

  const passwordConfirmValidator = (value: string, target: string) => 
    value === target || 'Password do not match';

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm({ ...passwordForm, [field]: value });

    // Clear error when user starts typing in any field
    if (passwordFormErrors[field]) {
      setPasswordFormErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      return;
    }

    // Clear error if field is empty
    if (!value) {
      setPasswordFormErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      return;
    }

    // Validate new password
    if (field === 'newPassword' && value) {
      const passwordError = passwordValidator(value);
      if (typeof passwordError === 'string') {
        setPasswordFormErrors((prev) => ({ ...prev, newPassword: passwordError }));
      } else {
        setPasswordFormErrors((prev) => {
          const { newPassword, ...rest } = prev;
          return rest;
        });
      }
    }

    // Validate password confirmation
    if (field === 'confirmNewPassword' || (field === 'newPassword' && passwordForm.confirmNewPassword)) {
      const confirmError = passwordConfirmValidator(
        field === 'confirmNewPassword' ? value : passwordForm.confirmNewPassword || '',
        field === 'newPassword' ? value : passwordForm.newPassword || ''
      );
      if (typeof confirmError === 'string') {
        setPasswordFormErrors((prev) => ({ ...prev, confirmNewPassword: confirmError }));
      } else {
        setPasswordFormErrors((prev) => {
          const { confirmNewPassword, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors: Record<string, any> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Required field';
    }

    if (passwordForm.newPassword) {
      const passwordError = passwordValidator(passwordForm.newPassword);
      if (typeof passwordError === 'string') {
        errors.newPassword = passwordError;
      }
    } else {
      errors.newPassword = 'Required field';
    }

    if (!passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = 'Required field';
    } else if (typeof passwordConfirmValidator(passwordForm.confirmNewPassword, passwordForm.newPassword || '') === 'string') {
      errors.confirmNewPassword = passwordConfirmValidator(passwordForm.confirmNewPassword, passwordForm.newPassword || '');
    }

    setPasswordFormErrors(errors);

    // Call the API to update the password
    try {
      start();
      const { data } = await $http.patch('/users/change-password', passwordForm);
      
      // Reset form
      setPasswordForm({
        currentPassword: null,
        newPassword: null,
        confirmNewPassword: null
      });
    } catch (error: any) {
      console.log(error.response);
      if(error.response?.status === 429){
        setPasswordFormErrors({ currentPassword: null, newPassword: null, confirmNewPassword: null })
      }else{
        setPasswordFormErrors(error.response?.data?.errors || {});
      }
    } finally {
      stop();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your password and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TextField
          id="current-password"
          label="Current Password"
          type="password"
          value={passwordForm.currentPassword || ''}
          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
          error={passwordFormErrors.currentPassword}
        />
        <TextField
          id="new-password"
          label="New Password"
          type="password"
          value={passwordForm.newPassword || ''}
          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
          error={passwordFormErrors.newPassword}
        />
        <TextField
          id="confirm-password"
          label="Confirm New Password"
          type="password"
          value={passwordForm.confirmNewPassword || ''}
          onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
          error={passwordFormErrors.confirmNewPassword}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdatePassword} disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
      </CardFooter>
    </Card>
  );
}
