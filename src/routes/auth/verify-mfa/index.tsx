import { createFileRoute } from '@tanstack/react-router';
import { MFACodeInput } from '~/components/auth/MFACodeInput';

function VerifyMFAPage() {
  const { data } = Route.useSearch();
  return <MFACodeInput data={data} />;
}

export const Route = createFileRoute('/auth/verify-mfa/')({
  component: VerifyMFAPage,
  validateSearch: (search: Record<string, unknown>) => ({
    data: search.data as any,
  }),
});
