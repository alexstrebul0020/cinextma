import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "../env";
import { Database } from "./types";

export async function createClient(admin?: boolean) {
  const cookieStore = await cookies();

  const key = admin ? env.SUPABASE_SERVICE_ROLE_KEY : env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (error) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.error("Failed to set cookies:", error);
        }
      },
    },
  });
}
/**
 * The Supabase project URL used to initialize the Supabase client.
 *
 * This should be the HTTPS endpoint for your project (for example: "https://<project-ref>.supabase.co").
 * It is combined with a Supabase key to form authenticated requests to the REST, Realtime, and Storage APIs.
 *
 * Expectations:
 * - Must be a valid HTTPS URL.
 * - Host should include the "supabase.co" domain.
 *
 * Usage:
 * - Provide via an environment variable (e.g., SUPABASE_URL) and avoid hard-coding in source.
 * - Pair with an appropriate key (anon key for client-side use, service role key for trusted server operations).
 *
 * Security:
 * - The URL is not secret, but associated API keys are sensitive and must be kept confidential.
 */
const SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
