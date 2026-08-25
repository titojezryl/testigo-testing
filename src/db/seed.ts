import { database } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";
import { createUserByAdmin } from "../data-access/users";

/**
 * Database seed script to create a default super_admin user.
 * This ensures at least one super_admin exists for initial system access.
 *
 * Credentials can be configured via environment variables:
 * - SEED_ADMIN_EMAIL (default: super_admin@clara.ai)
 * - SEED_ADMIN_PASSWORD (default: Password123#)
 * - SEED_ADMIN_NAME (default: Super Administrator)
 */

async function seedDatabase() {
  try {
    // Read credentials from environment variables with fallback defaults
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "super_admin@clara.ai";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Password123#";
    const adminName = process.env.SEED_ADMIN_NAME || "Super Administrator";

    console.log("🌱 Starting database seed...");
    console.log(`📧 Checking for existing super admin: ${adminEmail}`);

    // Check if super_admin user already exists
    const existingUser = await database
      .select()
      .from(user)
      .where(eq(user.email, adminEmail))
      .limit(1);

    if (existingUser.length > 0) {
      console.log(`✅ Super admin user already exists: ${adminEmail}`);
      console.log("🌱 Database seed completed (no changes needed)");
      process.exit(0);
    }

    // Create the super_admin user
    console.log(`👤 Creating super admin user: ${adminEmail}`);

    await createUserByAdmin({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "super_admin",
      isAdmin: true,
    });

    console.log(`✅ Created super admin user: ${adminEmail}`);

    // Warn if using default credentials
    if (adminPassword === "Password123#") {
      console.log("\n⚠️  WARNING: Using default password 'Password123#'");
      console.log("⚠️  Please change this password immediately in production!");
      console.log(
        "⚠️  Set SEED_ADMIN_PASSWORD environment variable to use a different password.\n"
      );
    }

    console.log("🌱 Database seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
