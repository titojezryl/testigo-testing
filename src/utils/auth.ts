import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { database } from "../db";
import { privateEnv } from "~/config/privateEnv";
import { publicEnv } from "~/config/publicEnv";
import { user } from "~/db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  baseURL: publicEnv.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(database, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // Disable public signup - users can only be created by super_admin through the admin panel
    disableSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: privateEnv.GOOGLE_CLIENT_ID,
      clientSecret: privateEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  // Default redirect path after successful authentication
  redirectTo: "/dashboard/projects",
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Check if user is suspended before allowing session creation
          const [userData] = await database
            .select({ status: user.status })
            .from(user)
            .where(eq(user.id, session.userId))
            .limit(1);

          if (userData?.status === "suspended") {
            throw new APIError("FORBIDDEN", {
              message: "Account suspended: Your account has been suspended. Please contact support for assistance.",
            });
          }

          return { data: session };
        },
      },
    },
  },
});
