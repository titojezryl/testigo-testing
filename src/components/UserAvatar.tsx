import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-24 w-24",
};

export function UserAvatar({
  imageUrl,
  name,
  email,
  className = "",
  size = "md",
}: UserAvatarProps) {
  // Get fallback text - use name initials, or first letter of email, or "U"
  const fallbackText =
    name
      ? getInitials(name)
      : email
        ? email.charAt(0).toUpperCase()
        : "U";

  return (
    <Avatar className={`${sizeMap[size]} ${className}`}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name || "User"} />}
      <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground font-semibold">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
