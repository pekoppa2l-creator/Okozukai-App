import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function logUsage(appId: string, eventType = "launch") {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.from("app_usage_logs").insert({
    app_id: appId,
    event_type: eventType,
  });

  if (error) {
    console.error("logUsage failed:", error.message);
  }
}
