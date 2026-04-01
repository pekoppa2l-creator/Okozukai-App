import { redirect } from "next/navigation";
import { RoiDashboard } from "@/components/roi-dashboard";
import { UsageTracker } from "@/components/usage-tracker";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { normalizeRoiRows, type DailyMetricRow } from "@/lib/roi";
import { getMockDashboardData } from "@/lib/mock-dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let mode: "live" | "mock" = "live";
  let summaryRows = [];
  let dailyRows: DailyMetricRow[] = [];

  const [{ data: summary, error: summaryError }, { data: daily, error: dailyError }] =
    await Promise.all([
      supabase.from("app_roi_summary").select("*").order("time_roi", { ascending: false }),
      supabase.from("app_daily_metrics").select("*").order("metric_date", { ascending: true }),
    ]);

  if (summaryError || dailyError) {
    const mock = getMockDashboardData();
    mode = "mock";
    summaryRows = normalizeRoiRows(mock.summary);
    dailyRows = mock.daily;
  } else {
    summaryRows = normalizeRoiRows(summary ?? []);
    dailyRows = (daily ?? []) as DailyMetricRow[];
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1600px] p-6 lg:p-10">
      <UsageTracker appId="dev-roi-dashboard" />
      <RoiDashboard
        userEmail={user.email ?? ""}
        summaryRows={summaryRows}
        dailyRows={dailyRows}
        mode={mode}
      />
    </main>
  );
}
