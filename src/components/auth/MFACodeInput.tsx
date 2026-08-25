import { useState, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {useAxios} from "~/hooks/useAxios";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { useNavigate } from "@tanstack/react-router";

interface MFACodeInputProps {
  onSubmit?: (code: string) => void | Promise<void>;
  onCancel?: () => void;
  error?: string | null;
  loading?: boolean;
  showCancelButton?: boolean;
  data?: any;
}

export function MFACodeInput({
  loading = false,
  showCancelButton = true,
  data,
}: MFACodeInputProps) {
  const { $http } = useAxios();
  const { authenticate } = useAuthenticationStore();
  const navigate = useNavigate();
  const [mfaCode, setMfaCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const mfaData = data;

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - focus previous input
    if (e.key === 'Backspace' && !mfaCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          setMfaCode(digits.split(''));
        }
      }).catch(() => {
        // Silently handle paste errors
      });
    }
    // Handle Enter key - submit if code is complete
    if (e.key === 'Enter' && mfaCode.join('').length === 6) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const code = mfaCode.join('');
    if (code.length !== 6) {
      return;
    }
    try {
      const { data } = await $http.post('/mfa/verify', { 
        mfaToken: mfaData.mfaToken,
        code: code,
        method: 'TOTP',
       });
      authenticate(data.tokens, data.user)
      navigate({ to: `/${data.user.role}/dashboard` })
    } catch (error: any) {
      console.log(error.response.data);
      setError(error.response.data.message);
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing an input
    inputRefs[index].current?.select();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Enter Verification Code</h3>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          {mfaCode.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              disabled={loading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="w-full max-w-xs">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button
            onClick={handleSubmit}
            disabled={loading || mfaCode.join('').length !== 6}
            className="flex-1"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
          {showCancelButton && (
            <Button
              onClick={() => navigate({ to: '/auth/signin' })}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
