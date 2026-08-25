import { Link } from "@tanstack/react-router";
import { UserAvatar } from "./UserAvatar";

interface UserAvatarLinkProps {
  userId: string;
  imageUrl?: string | null;
  name: string | null;
  email?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatarLink({
  userId,
  imageUrl,
  name,
  email,
  className = "",
  size = "md",
}: UserAvatarLinkProps) {
  return (
    <Link
      to="/profile/$userId"
      params={{ userId }}
      className={`inline-block hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full ${className}`}
    >
      <UserAvatar imageUrl={imageUrl} name={name} email={email} size={size} />
    </Link>
  );
}

