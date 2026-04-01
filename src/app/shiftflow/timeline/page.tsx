"use client";

import { useMemo, useState } from "react";

type BlockKind = "portrait" | "print" | "pack" | "break";

type TimelineBlock = {
  id: string;
  label: string;
  kind: BlockKind;
  start: string;
  end: string;
};

type StaffTimeline = {
  staffName: string;
  blocks: TimelineBlock[];
};

type TaskFilter = "all" | "portrait" | "print" | "pack";

const DAY_START = 8;
const DAY_END = 20;
const DAY_SPAN_MINUTES = (DAY_END - DAY_START) * 60;

const HOUR_TICKS = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i);

const MOCK_ROWS: StaffTimeline[] = [
  {
    staffName: "Akiyama",
    blocks: [
      { id: "a1", label: "似顔絵", kind: "portrait", start: "09:00", end: "11:30" },
      { id: "a2", label: "休", kind: "break", start: "11:30", end: "12:00" },
      { id: "a3", label: "プリント", kind: "print", start: "12:00", end: "15:00" },
      { id: "a4", label: "梱包", kind: "pack", start: "15:30", end: "18:00" },
    ],
  },
  {
    staffName: "Yamada",
    blocks: [
      { id: "y1", label: "梱包", kind: "pack", start: "08:30", end: "11:00" },
      { id: "y2", label: "休", kind: "break", start: "11:00", end: "11:30" },
      { id: "y3", label: "似顔絵", kind: "portrait", start: "12:30", end: "16:00" },
    ],
  },
  {
    staffName: "Suzuki",
    blocks: [
      { id: "s1", label: "プリント", kind: "print", start: "09:00", end: "12:00" },
      { id: "s2", label: "梱包", kind: "pack", start: "13:00", end: "17:30" },
    ],
  },
  {
    staffName: "Kobayashi",
    blocks: [
      { id: "k1", label: "似顔絵", kind: "portrait", start: "10:00", end: "13:00" },
      { id: "k2", label: "休", kind: "break", start: "13:00", end: "13:30" },
      { id: "k3", label: "プリント", kind: "print", start: "13:30", end: "18:30" },
    ],
  },
];

const KIND_STYLES: Record<BlockKind, string> = {
  portrait: "border-amber-300 bg-amber-100 text-amber-900",
  print: "border-cyan-300 bg-cyan-100 text-cyan-900",
  pack: "border-emerald-300 bg-emerald-100 text-emerald-900",
  break: "border-slate-300 bg-slate-100 text-slate-700",
};

function toOffsetMinutes(timeText: string) {
  const [hourText, minuteText] = timeText.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  return (hour - DAY_START) * 60 + minute;
}

function toBlockPosition(start: string, end: string) {
  const startOffset = Math.max(0, toOffsetMinutes(start));
  const endOffset = Math.min(DAY_SPAN_MINUTES, toOffsetMinutes(end));
  const left = (startOffset / DAY_SPAN_MINUTES) * 100;
  const width = (Math.max(30, endOffset - startOffset) / DAY_SPAN_MINUTES) * 100;
  return { left: `${left}%`, width: `${width}%` };
}

export default function TimelineManagementPage() {
  const [staffFilter, setStaffFilter] = useState("all");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");

  const visibleRows = useMemo(() => {
    return MOCK_ROWS.filter((row) => {
      const staffMatched = staffFilter === "all" || row.staffName === staffFilter;
      if (!staffMatched) return false;
      if (taskFilter === "all") return true;
      return row.blocks.some((block) => block.kind === taskFilter);
    });
  }, [staffFilter, taskFilter]);

  return (
    <div>
      <p className="font-[var(--font-mono)] text-[11px] tracking-[0.2em] text-slate-500">TIMELINE MANAGEMENT</p>
      <h2 className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-slate-900">スタッフ別タイムライン管理</h2>
      <p className="mt-2 text-sm text-slate-600">
        横軸が時刻、縦軸がスタッフのガントビューです。今夜版はローカルデータで表示し、操作感を固めます。
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2">
          <span className="px-1 text-sm text-slate-700">業務</span>
          <button
            type="button"
            onClick={() => setTaskFilter("all")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              taskFilter === "all"
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            全て
          </button>
          <button
            type="button"
            onClick={() => setTaskFilter("portrait")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              taskFilter === "portrait"
                ? "border border-amber-400 bg-amber-200 text-amber-950"
                : "border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            似顔絵
          </button>
          <button
            type="button"
            onClick={() => setTaskFilter("print")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              taskFilter === "print"
                ? "border border-cyan-400 bg-cyan-200 text-cyan-950"
                : "border border-cyan-300 bg-cyan-100 text-cyan-900 hover:bg-cyan-200"
            }`}
          >
            プリント
          </button>
          <button
            type="button"
            onClick={() => setTaskFilter("pack")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              taskFilter === "pack"
                ? "border border-emerald-400 bg-emerald-200 text-emerald-950"
                : "border border-emerald-300 bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
            }`}
          >
            梱包
          </button>
        </div>

        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          スタッフ
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm outline-none ring-orange-200 focus:ring"
          >
            <option value="all">全員</option>
            {MOCK_ROWS.map((row) => (
              <option key={row.staffName} value={row.staffName}>
                {row.staffName}
              </option>
            ))}
          </select>
        </label>

      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 lg:p-5">
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="mb-3 grid grid-cols-[120px_1fr] items-end gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Staff</span>
              <div className="relative h-8">
                {HOUR_TICKS.map((hour) => {
                  const left = ((hour - DAY_START) / (DAY_END - DAY_START)) * 100;
                  return (
                    <span
                      key={hour}
                      className="absolute -translate-x-1/2 text-xs text-slate-500"
                      style={{ left: `${left}%` }}
                    >
                      {`${String(hour).padStart(2, "0")}:00`}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              {visibleRows.map((row) => (
                <div key={row.staffName} className="grid grid-cols-[120px_1fr] items-center gap-3">
                  <p className="text-sm font-semibold text-slate-700">{row.staffName}</p>
                  <div className="relative h-12 rounded-lg border border-slate-200 bg-slate-50">
                    {HOUR_TICKS.map((hour) => {
                      const left = ((hour - DAY_START) / (DAY_END - DAY_START)) * 100;
                      return (
                        <span
                          key={`${row.staffName}-${hour}`}
                          className="absolute top-0 h-full w-px bg-slate-200"
                          style={{ left: `${left}%` }}
                        />
                      );
                    })}

                    {row.blocks.map((block) => (
                      <div
                        key={block.id}
                        className={`absolute top-1/2 h-8 -translate-y-1/2 rounded-md border px-2 text-xs font-semibold leading-8 ${KIND_STYLES[block.kind]}`}
                        style={toBlockPosition(block.start, block.end)}
                        title={`${block.label} ${block.start}-${block.end}`}
                      >
                        {block.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {visibleRows.length === 0 ? (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  条件に一致するスタッフがいません。
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
