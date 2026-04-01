import Link from "next/link";

const tabs = [
  { href: "/staff/schedule", label: "予定" },
  { href: "/staff/performance", label: "実績入力" },
  { href: "/staff/attendance", label: "打刻" },
];

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-24 pt-4">
      <header className="card p-4">
        <p className="font-[var(--font-mono)] text-[10px] tracking-[0.2em] text-slate-500">STAFF MODE</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-2xl font-bold text-slate-900">現場入力</h1>
        <p className="mt-1 text-sm text-slate-600">今日の予定確認と実績入力に特化した画面です。</p>
      </header>

      <section className="mt-4">{children}</section>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur">
        <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-xs font-semibold text-slate-700"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
