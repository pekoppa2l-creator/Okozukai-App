import Link from "next/link";

export default function ShiftflowMainMenuPage() {
  return (
    <div>
      <p className="font-[var(--font-mono)] text-[11px] tracking-[0.2em] text-slate-500">MAIN MENU</p>
      <h2 className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-slate-900">ShiftFlow 管理者メニュー</h2>
      <p className="mt-2 text-sm text-slate-600">
        管理者向けWeb画面と、スタッフ向けモバイル入力画面を分離しています。
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">ADMIN</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">管理者メニュー</h3>
          <div className="mt-4 grid gap-2">
            <Link
              href="/shiftflow/timeline?role=admin"
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 transition hover:border-amber-300"
            >
              Timeline Management
            </Link>
            <Link
              href="/shiftflow/analytics?role=admin"
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-900 transition hover:border-cyan-300"
            >
              Production Analytics
            </Link>
            <Link
              href="/shiftflow/settings?role=admin"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 transition hover:border-emerald-300"
            >
              Staff & Task Settings
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-500">STAFF</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">スタッフ専用モバイル</h3>
          <div className="mt-4 grid gap-2">
            <Link
              href="/staff/schedule"
              className="rounded-lg border border-slate-900 bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              スタッフ画面を開く
            </Link>
            <p className="text-xs text-slate-500">予定確認・実績入力・打刻をスマホ操作向けUIで利用できます。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
