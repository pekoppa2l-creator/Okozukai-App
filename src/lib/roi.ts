import type { DailyMetricRow, RoiSummaryRow } from "@/lib/types";

export type { DailyMetricRow } from "@/lib/types";

export type NormalizedRoiRow = {
  appId: string;
  appName: string;
  totalLaunches: number;
  totalWorkHours: number;
  latestLoc: number;
  timeRoi: number;
  codeRoi: number;
};

const toNumber = (v: number | null | undefined) => (typeof v === "number" ? v : 0);

export function normalizeRoiRows(rows: RoiSummaryRow[]): NormalizedRoiRow[] {
  return rows.map((row) => ({
    appId: row.app_id,
    appName: row.app_name,
    totalLaunches: toNumber(row.total_launches),
    totalWorkHours: toNumber(row.total_work_hours),
    latestLoc: toNumber(row.latest_loc),
    timeRoi: toNumber(row.time_roi),
    codeRoi: toNumber(row.code_roi),
  }));
}

export function groupDailyByApp(rows: DailyMetricRow[]) {
  return rows.reduce<Record<string, DailyMetricRow[]>>((acc, row) => {
    if (!acc[row.app_id]) {
      acc[row.app_id] = [];
    }
    acc[row.app_id].push(row);
    return acc;
  }, {});
}
