"use client";

import { FormEvent, useMemo, useState } from "react";

type PerformanceEntry = {
  id: string;
  block: string;
  count: number;
  createdAt: string;
};

const STORAGE_KEY = "shiftflow.performance-entries.v1";

function readLocalEntries(): PerformanceEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as PerformanceEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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

const DAY_START = 8;
const DAY_END = 20;
const DAY_SPAN_MINUTES = (DAY_END - DAY_START) * 60;
const HOUR_TICKS = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i);

const MY_ROW: StaffTimeline = {
  staffName: "私",
  blocks: [
    { id: "m1", label: "似顔絵", kind: "portrait", start: "09:00", end: "11:00" },
    { id: "m2", label: "プリント", kind: "print", start: "11:00", end: "13:00" },
    { id: "m3", label: "梱包", kind: "pack", start: "14:00", end: "18:00" },
  ],
};

const OTHER_ROWS: StaffTimeline[] = [
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
  return (Number(hourText) - DAY_START) * 60 + Number(minuteText);
}

function toBlockPosition(start: string, end: string) {
  const startOffset = Math.max(0, toOffsetMinutes(start));
  const endOffset = Math.min(DAY_SPAN_MINUTES, toOffsetMinutes(end));
  const left = (startOffset / DAY_SPAN_MINUTES) * 100;
  const width = (Math.max(30, endOffset - startOffset) / DAY_SPAN_MINUTES) * 100;
  return { left: `${left}%`, width: `${width}%` };
}

function hasSameWork(myBlocks: TimelineBlock[], otherBlocks: TimelineBlock[]) {
  const myKinds = new Set(myBlocks.filter((b) => b.kind !== "break").map((b) => b.kind));
  return otherBlocks.some((b) => b.kind !== "break" && myKinds.has(b.kind));
}

function renderTimelineRows(rows: StaffTimeline[]) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="mb-2 grid grid-cols-[86px_1fr] items-end gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Staff</span>
          <div className="relative h-7">
            {HOUR_TICKS.map((hour) => {
              const left = ((hour - DAY_START) / (DAY_END - DAY_START)) * 100;
              return (
                <span
                  key={hour}
                  className="absolute -translate-x-1/2 text-[11px] text-slate-500"
                  style={{ left: `${left}%` }}
                >
                  {`${String(hour).padStart(2, "0")}:00`}
                </span>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.staffName} className="grid grid-cols-[86px_1fr] items-center gap-2">
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
                  >
                    {block.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StaffSchedulePage() {
  const teammateRows = OTHER_ROWS.filter((row) => hasSameWork(MY_ROW.blocks, row.blocks));
  const inputTargets = MY_ROW.blocks.filter((block) => block.kind !== "break");

  const blockOptions = inputTargets.map(
    (b) => `${b.start}-${b.end} / ${b.label}`
  );

  const [selectedBlock, setSelectedBlock] = useState(blockOptions[0] ?? "");
  const [countText, setCountText] = useState("");
  const [entries, setEntries] = useState<PerformanceEntry[]>(() => readLocalEntries());
  const [message, setMessage] = useState<string | null>(null);

  const todayTotal = useMemo(() => entries.reduce((sum, e) => sum + e.count, 0), [entries]);
  const recentEntries = entries.slice(0, 5);

  const saveEntries = (next: PerformanceEntry[]) => {
    setEntries(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const count = Number(countText);
    if (!Number.isFinite(count) || count <= 0) {
      setMessage("個数を入力してください。");
      return;
    }
    const newEntry: PerformanceEntry = {
      id: crypto.randomUUID(),
      block: selectedBlock,
      count,
      createdAt: new Date().toISOString(),
    };
    saveEntries([newEntry, ...entries].slice(0, 30));
    setCountText("");
    setMessage("入力しました。");
  };

  return (
    <div className="space-y-3">
      {/* 私の予定 */}
      <section className="card p-3">
        <h2 className="text-base font-semibold text-slate-900">私の予定</h2>
        <div className="mt-3">{renderTimelineRows([MY_ROW])}</div>
      </section>

      {/* 同業務の他スタッフ */}
      <section className="card p-3">
        <h2 className="text-base font-semibold text-slate-900">同業務の他スタッフ</h2>
        <p className="mt-1 text-xs text-slate-600">引き継ぎ候補を確認できます。</p>
        <div className="mt-3">{renderTimelineRows(teammateRows)}</div>
      </section>

      {/* 実績入力 */}
      <section id="performance-form" className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">実績入力</h2>

        {/* タスク選択 */}
        <div className="card p-4">
          <p className="text-xs text-slate-500">対象タスク</p>
          <select
            value={selectedBlock}
            onChange={(e) => { setSelectedBlock(e.target.value); setMessage(null); }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring"
          >
            {blockOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* 個数入力フォーム */}
        <form onSubmit={onSubmit} className="card p-4">
          <p className="text-xs text-slate-500">完了個数</p>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={countText}
            onChange={(e) => { setCountText(e.target.value); setMessage(null); }}
            placeholder="0"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-4 text-2xl font-bold outline-none ring-orange-200 focus:ring"
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            入力を保存
          </button>
          {message ? <p className="mt-2 text-sm text-slate-700">{message}</p> : null}
        </form>

        {/* 本日合計 */}
        <div className="card p-4">
          <p className="text-xs text-slate-500">本日合計</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{todayTotal} 個</p>
        </div>

        {/* 最近の入力 */}
        <div className="card p-4">
          <p className="text-xs text-slate-500">最近の入力</p>
          {recentEntries.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">まだ入力がありません。</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {recentEntries.map((entry) => (
                <li key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-700">{entry.block}</span>
                    <span className="font-semibold text-slate-900">{entry.count} 個</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
