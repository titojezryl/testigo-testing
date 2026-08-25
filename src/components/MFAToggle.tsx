import { useState, useRef, useEffect } from "react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useAxios } from "~/hooks/useAxios";
import { Alert, AlertDescription } from "./ui/alert";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";
import { z } from "zod";

export const MFAToggleSchema = z.object({
  mfaEnabled: z.boolean().optional(),
})
export type MFAToggle = z.infer<typeof MFAToggleSchema>;

export function MFAToggle() {
  const { $http } = useAxios();
  const { mfaEnabled, setMfaEnabled, user } = useAuthenticationStore();
  const { getItem, setItem } = useLocalStorage();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState<string[]>(['', '', '', '', '', '']);
  const [backupCode, setBackupCode] = useState<string[]>([]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleMfaToggle = async (checked: boolean) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setMfaCode(['', '', '', '', '', '']);

    try {
      if (checked) {
        // Enable MFA
        const { data } = await $http.post('/mfa/totp/setup');
        setMfaEnabled(true);
        setQrCode(data.qrCodeDataUrl);
        setInstructions(data.instructions);
        setSuccessMessage('Multi-factor authentication has been enabled. Please scan the QR code with your authenticator app.');
      } else {
        // Disable MFA
        await $http.post('/mfa/disable');
        setMfaEnabled(false);
        setSuccessMessage('Multi-factor authentication has been disabled.');
        setQrCode(null);
        setMfaCode(['', '', '', '', '', '']);
        setBackupCode([]);
        setInstructions([]);
        setQrCode(null);
      }
    } catch (err: any) {
      if(err.response.status === 429){
        setError('Too many requests. Please try again later.');
      }else{
        setError(err.response?.data?.message || 'Failed to update MFA settings. Please try again.');
      }
      // Revert the toggle state on error
      setMfaEnabled(!checked);
    } finally {
      setLoading(false);
    }
  };

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
      });
    }
  };

  const handleVerifyCode = async () => {
    const code = mfaCode.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const res = await $http.post('/mfa/totp/verify', { code });
      setMfaEnabled(true);
      setSuccessMessage('MFA verified successfully!');
      setInstructions([]);
      setQrCode(null);
      setMfaCode(['', '', '', '', '', '']);
      setBackupCode(res.data.backupCodes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
      // Clear the code inputs on error
      setMfaCode(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Enable MFA</div>
            <p className="text-sm text-muted-foreground">
              Require a code from your authenticator app when signing in
            </p>
          </div>
          <Switch
            checked={mfaEnabled}
            onCheckedChange={handleMfaToggle}
            disabled={loading}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {instructions.length > 0 && instructions.map((instruction, index) => (
          <Alert key={index}>
            <AlertDescription>{instruction}</AlertDescription>
          </Alert>
        ))}
        {backupCode.length > 0 && (
        <>
          <div className="space-y-2">
            <p className="text-sm font-medium">Backup Codes</p>
            <p className="text-sm text-muted-foreground">
              Use these codes to login if you don't have your authenticator app.
              <br />
              <span className="text-red-500">save these codes in a secure location. You will not be able to access them again.</span>
            </p>
          </div>
          <ul className="list-disc list-inside">
            {backupCode.map((code, index) => (
              <li className="text-sm text-muted-foreground">{code}</li>
            ))}
          </ul>
        </>
        )}
        {/* {successMessage && (
          <Alert>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )} */}

        {qrCode && mfaEnabled && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium">Scan QR Code</p>
              </div>
              <img
                src={qrCode}
                alt="MFA QR Code"
                className="w-48 h-48 border rounded-lg p-2 bg-white"
              />
            </div>

            <div className="flex flex-col items-center space-y-4 pt-4">
              <div className="text-center">
                <p className="text-sm font-medium">Enter Verification Code</p>
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
                    className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={verifying}
                  />
                ))}
              </div>

              <Button
                onClick={handleVerifyCode}
                disabled={verifying || mfaCode.join('').length !== 6}
                className="w-full max-w-xs"
              >
                {verifying ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
