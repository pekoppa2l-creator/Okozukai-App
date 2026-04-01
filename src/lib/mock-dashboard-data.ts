import type { DailyMetricRow, RoiSummaryRow } from "@/lib/types";

type MockDashboardData = {
  summary: RoiSummaryRow[];
  daily: DailyMetricRow[];
};

const APPS = [
  { appId: "dev-roi-dashboard", appName: "ROI Dashboard", loc: 1280 },
  { appId: "kids-allowance", appName: "Kids Allowance", loc: 980 },
  { appId: "task-focus-timer", appName: "Focus Timer", loc: 760 },
  { appId: "dev-log-app", appName: "Dev Log App", loc: 1540 },
];

const HOURS = [1.4, 0.7, 2.2, 1.8, 0.6, 1.1, 2.5];
const LAUNCHES = [5, 3, 8, 6, 2, 4, 9];

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getMockDashboardData(days = 14): MockDashboardData {
  const daily: DailyMetricRow[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const app of APPS) {
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const idx = (days - 1 - i) % HOURS.length;
      const wave = app.appId.length % 3;

      const workHours = Number((HOURS[idx] + wave * 0.2).toFixed(2));
      const launchCount = LAUNCHES[idx] + wave;

      daily.push({
        app_id: app.appId,
        metric_date: formatDate(d),
        launch_count: launchCount,
        work_hours: workHours,
      });
    }
  }

  const summary: RoiSummaryRow[] = APPS.map((app) => {
    const appRows = daily.filter((d) => d.app_id === app.appId);
    const totalLaunches = appRows.reduce((sum, row) => sum + (row.launch_count ?? 0), 0);
    const totalWorkHours = Number(
      appRows.reduce((sum, row) => sum + (row.work_hours ?? 0), 0).toFixed(2),
    );
    const timeRoi = totalWorkHours > 0 ? Number((totalLaunches / totalWorkHours).toFixed(4)) : 0;
    const codeRoi = app.loc > 0 ? Number((totalLaunches / app.loc).toFixed(6)) : 0;

    return {
      app_id: app.appId,
      app_name: app.appName,
      total_launches: totalLaunches,
      total_work_hours: totalWorkHours,
      latest_loc: app.loc,
      time_roi: timeRoi,
      code_roi: codeRoi,
    };
  });

  return { summary, daily };
}
