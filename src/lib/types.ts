export type RoiSummaryRow = {
  app_id: string;
  app_name: string;
  total_launches: number | null;
  total_work_hours: number | null;
  latest_loc: number | null;
  time_roi: number | null;
  code_roi: number | null;
};

export type DailyMetricRow = {
  app_id: string;
  metric_date: string;
  launch_count: number | null;
  work_hours: number | null;
};
