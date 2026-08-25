import { createFileRoute } from '@tanstack/react-router';
import { CreateAccountPage } from '~/components/auth/CreateAccountPage';

export const Route = createFileRoute('/auth/signup/')({
  component: CreateAccountPage,
});
