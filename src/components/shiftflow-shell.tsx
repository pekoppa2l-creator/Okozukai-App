"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getRoleMenu,
  isShiftRole,
  SHIFT_ROLE_LABEL,
  SHIFT_TASK_COLORS,
  type ShiftRole,
} from "@/lib/shiftflow-nav";

type Props = {
  children: React.ReactNode;
};

const ROLE_OPTIONS: ShiftRole[] = ["admin", "staff"];

export function ShiftflowShell({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roleParam = searchParams.get("role");
  const role: ShiftRole = isShiftRole(roleParam) ? roleParam : "admin";
  const menuItems = getRoleMenu(role);
  const hasAccess = menuItems.some((item) => item.href === pathname);

  const setRole = (nextRole: ShiftRole) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("role", nextRole);
    router.replace(`${pathname}?${next.toString()}`);
  };

  const withRole = (href: string) => `${href}?role=${role}`;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1440px] px-4 py-4 lg:px-8 lg:py-6">
      <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="card p-4 lg:p-5">
          <p className="font-[var(--font-mono)] text-[11px] tracking-[0.2em] text-slate-500">SHIFTFLOW</p>
          <h1 className="mt-2 font-[var(--font-heading)] text-2xl font-bold text-slate-900">
            Entrance Menu
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            似顔絵制作ラインの稼働を、役割ごとに見える化するナビゲーション基盤。
          </p>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white/80 p-2">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Role Switcher
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map((option) => {
                const active = role === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      active ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {SHIFT_ROLE_LABEL[option]}
                  </button>
                );
              })}
            </div>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              const chipClass = SHIFT_TASK_COLORS[item.accent];
              return (
                <Link
                  key={item.href}
                  href={withRole(item.href)}
                  className={`min-w-[220px] rounded-xl border p-3 transition lg:block lg:min-w-0 ${
                    active
                      ? "border-slate-800 bg-slate-900 text-white"
                      : "border-slate-200 bg-white/90 text-slate-800 hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${chipClass}`}>
                      {item.accent === "portrait"
                        ? "似顔絵"
                        : item.accent === "print"
                          ? "プリント"
                          : item.accent === "pack"
                            ? "梱包"
                            : "共通"}
                    </span>
                  </div>
                  <p className={`mt-1 text-xs ${active ? "text-slate-200" : "text-slate-500"}`}>
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="card p-4 lg:p-6">
          {!hasAccess ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              現在のロールではこのページにアクセスできません。左のRole Switcherで切り替えるか、メニューから選択してください。
            </div>
          ) : null}
          {children}
        </section>
      </div>
    </div>
  );
}
