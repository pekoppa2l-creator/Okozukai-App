"use client";

import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { groupDailyByApp, type DailyMetricRow, type NormalizedRoiRow } from "@/lib/roi";
import { RoiMixedChart } from "@/components/roi-mixed-chart";

type SortKey = "time" | "code";

type Props = {
  userEmail: string;
  summaryRows: NormalizedRoiRow[];
  dailyRows: DailyMetricRow[];
  mode: "live" | "mock";
};

export function RoiDashboard({ userEmail, summaryRows, dailyRows, mode }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [selectedAppId, setSelectedAppId] = useState(summaryRows[0]?.appId ?? "");

  const groupedDaily = useMemo(() => groupDailyByApp(dailyRows), [dailyRows]);
  const sortedRows = useMemo(() => {
    const copied = [...summaryRows];
    copied.sort((a, b) => {
      if (sortKey === "time") return b.timeRoi - a.timeRoi;
      return b.codeRoi - a.codeRoi;
    });
    return copied;
  }, [summaryRows, sortKey]);

  const selected = sortedRows.find((row) => row.appId === selectedAppId) ?? sortedRows[0];

  const signOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[440px_1fr]">
      <aside className="card p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-slate-500">
              ROI RANKING
            </p>
            <h2 className="mt-1 font-[var(--font-heading)] text-2xl font-semibold">アプリ評価一覧</h2>
          </div>
          <button
            onClick={signOut}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">{userEmail}</p>
        <div className="mt-2 inline-flex rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          {mode === "live" ? "Live Data" : "Mock Data"}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setSortKey("time")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              sortKey === "time" ? "bg-white text-slate-900" : "text-slate-500"
            }`}
          >
            Time-ROI
          </button>
          <button
            onClick={() => setSortKey("code")}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              sortKey === "code" ? "bg-white text-slate-900" : "text-slate-500"
            }`}
          >
            Code-ROI
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {sortedRows.map((row, index) => {
            const active = row.appId === selected?.appId;
            return (
              <li key={row.appId}>
                <button
                  onClick={() => setSelectedAppId(row.appId)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-orange-300 bg-orange-50/70"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-[var(--font-mono)] text-[11px] text-slate-500">#{index + 1}</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">{row.appName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500">
                        {sortKey === "time" ? "起動/作業h" : "起動/LOC"}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {sortKey === "time" ? row.timeRoi.toFixed(2) : row.codeRoi.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-500">
                    <span>起動 {row.totalLaunches}</span>
                    <span>工数 {row.totalWorkHours.toFixed(1)}h</span>
                    <span>LOC {row.latestLoc}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <article className="card p-5 lg:p-6">
        {selected ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  DETAIL ANALYSIS
                </p>
                <h3 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-slate-900">
                  {selected.appName}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-right text-sm">
                <div>
                  <p className="text-slate-500">Time-ROI</p>
                  <p className="font-semibold text-slate-900">{selected.timeRoi.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Code-ROI</p>
                  <p className="font-semibold text-slate-900">{selected.codeRoi.toFixed(4)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <RoiMixedChart data={groupedDaily[selected.appId] ?? []} />
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-600">表示対象のアプリがありません。DBにアプリを登録してください。</p>
        )}
      </article>
    </section>
  );
}
