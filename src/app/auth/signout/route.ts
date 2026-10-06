import { SIGNED_OUT_PATH, SUPABASE_CONFIG } from "@/config/supabase";
import { authRedirect, authRedirectUrl } from "@/lib/supabase/redirects";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (SUPABASE_CONFIG.isConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  
  return authRedirect(authRedirectUrl(request, SIGNED_OUT_PATH), 303);
}
