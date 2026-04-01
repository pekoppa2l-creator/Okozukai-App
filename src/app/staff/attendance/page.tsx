"use client";

import { useState } from "react";

type Status = "出勤前" | "勤務中" | "休憩中" | "退勤済み";

export default function StaffAttendancePage() {
  const [status, setStatus] = useState<Status>("出勤前");

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">打刻</h2>
      <section className="card p-4">
        <p className="text-xs text-slate-500">現在ステータス</p>
        <p className="mt-1 text-xl font-bold text-slate-900">{status}</p>
      </section>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setStatus("勤務中")}
          className="rounded-lg border border-slate-300 bg-white px-2 py-3 text-xs font-semibold text-slate-800"
        >
          出勤
        </button>
        <button
          type="button"
          onClick={() => setStatus("休憩中")}
          className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-3 text-xs font-semibold text-amber-900"
        >
          休憩
        </button>
        <button
          type="button"
          onClick={() => setStatus("退勤済み")}
          className="rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-3 text-xs font-semibold text-emerald-900"
        >
          退勤
        </button>
      </div>
    </div>
  );
}
