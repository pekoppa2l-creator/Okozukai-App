export type ShiftRole = "admin" | "staff";

export type ShiftNavItem = {
  href: string;
  label: string;
  description: string;
  roles: ShiftRole[];
  accent: "portrait" | "print" | "pack" | "neutral";
};

export const SHIFTFLOW_NAV_ITEMS: ShiftNavItem[] = [
  {
    href: "/shiftflow",
    label: "Dashboard",
    description: "今日の概況サマリー",
    roles: ["admin", "staff"],
    accent: "neutral",
  },
  {
    href: "/shiftflow/timeline",
    label: "Timeline Management",
    description: "スタッフ別ガント表示と進行可視化",
    roles: ["admin"],
    accent: "portrait",
  },
  {
    href: "/shiftflow/analytics",
    label: "Production Analytics",
    description: "スタッフ別・時間帯別の出来高集計",
    roles: ["admin"],
    accent: "print",
  },
  {
    href: "/shiftflow/settings",
    label: "Staff & Task Settings",
    description: "スタッフ・業務カテゴリのマスタ管理",
    roles: ["admin"],
    accent: "pack",
  },
  {
    href: "/shiftflow/my-schedule",
    label: "My Schedule",
    description: "本日の自分のタイムライン確認",
    roles: ["staff"],
    accent: "portrait",
  },
  {
    href: "/shiftflow/performance-entry",
    label: "Performance Entry",
    description: "時間帯ごとの実績個数を入力",
    roles: ["staff"],
    accent: "print",
  },
  {
    href: "/shiftflow/attendance",
    label: "Attendance",
    description: "出退勤・休憩の打刻",
    roles: ["staff"],
    accent: "pack",
  },
];

export const SHIFT_ROLE_LABEL: Record<ShiftRole, string> = {
  admin: "Admin",
  staff: "Staff",
};

export const SHIFT_TASK_COLORS = {
  portrait: "bg-amber-100 text-amber-800 border-amber-200",
  print: "bg-cyan-100 text-cyan-800 border-cyan-200",
  pack: "bg-emerald-100 text-emerald-800 border-emerald-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
} as const;

export function isShiftRole(value: string | null): value is ShiftRole {
  return value === "admin" || value === "staff";
}

export function getRoleMenu(role: ShiftRole) {
  return SHIFTFLOW_NAV_ITEMS.filter((item) => item.roles.includes(role));
}
