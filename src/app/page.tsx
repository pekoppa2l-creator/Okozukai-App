import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-6 py-12 lg:px-10">
      <section className="card grid-bg p-8 lg:p-12">
        <p className="font-[var(--font-mono)] text-xs tracking-[0.2em] text-slate-500">APP ROI MONITOR</p>
        <h1 className="mt-3 max-w-3xl font-[var(--font-heading)] text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
          ShiftFlowを、ページごとに確実に育てる。
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 lg:text-lg">
          似顔絵グッズ制作現場の「誰が・何時に・何をしているか」を可視化するシステムです。まずは入口メニューから、管理者/スタッフの導線を段階的に構築します。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shiftflow"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            ShiftFlowを開く
          </Link>
          <Link
            href="/cloud-pop"
            className="rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-100"
          >
            Cloud Popで休憩する
          </Link>
          <Link
            href="/shiftflow?role=staff"
            className="rounded-xl border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            スタッフモードで確認
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card p-5">
          <p className="font-[var(--font-mono)] text-xs tracking-[0.18em] text-slate-500">STEP 1</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Entrance Menu</h2>
          <p className="mt-2 text-sm text-slate-600">管理者/スタッフで切り替わる導線を整える。</p>
        </article>
        <article className="card p-5">
          <p className="font-[var(--font-mono)] text-xs tracking-[0.18em] text-slate-500">STEP 2</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Timeline / Analytics</h2>
          <p className="mt-2 text-sm text-slate-600">現場の稼働と出来高を可視化する管理画面を拡張。</p>
        </article>
        <article className="card p-5">
          <p className="font-[var(--font-mono)] text-xs tracking-[0.18em] text-slate-500">STEP 3</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Performance Entry</h2>
          <p className="mt-2 text-sm text-slate-600">スタッフの実績個数入力を中核機能として実装する。</p>
        </article>
        <article className="card p-5">
          <p className="font-[var(--font-mono)] text-xs tracking-[0.18em] text-slate-500">FUN MODE</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Cloud Pop</h2>
          <p className="mt-2 text-sm text-slate-600">Chromebook でも触りやすい、デジタル緩衝材ページを追加。</p>
        </article>
      </section>
    </main>
  );
}
