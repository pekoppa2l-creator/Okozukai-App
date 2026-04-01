import { Suspense } from "react";
import { ShiftflowShell } from "@/components/shiftflow-shell";

export default function ShiftflowLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShiftflowShell>{children}</ShiftflowShell>
    </Suspense>
  );
}
