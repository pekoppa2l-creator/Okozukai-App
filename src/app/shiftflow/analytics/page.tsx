export default function ProductionAnalyticsPage() {
  return (
    <div>
      <p className="font-[var(--font-mono)] text-[11px] tracking-[0.2em] text-slate-500">PRODUCTION ANALYTICS</p>
      <h2 className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-slate-900">出来高集計レポート</h2>
      <p className="mt-2 text-sm text-slate-600">
        スタッフ別・時間帯別の出来高を比較し、ボトルネック時間を特定するための分析画面です。
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-800">似顔絵</p>
          <p className="mt-1 text-sm text-amber-900">ピーク: 10:00-12:00 / 64個</p>
        </article>
        <article className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="text-xs font-semibold text-cyan-800">プリント</p>
          <p className="mt-1 text-sm text-cyan-900">ピーク: 13:00-15:00 / 58個</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 md:col-span-2">
          <p className="text-xs font-semibold text-emerald-800">梱包</p>
          <p className="mt-1 text-sm text-emerald-900">ピーク: 16:00-18:00 / 72個</p>
        </article>
      </div>
    </div>
  );
}
