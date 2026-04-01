"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const signInWithGoogle = async () => {
    const supabase = createBrowserSupabaseClient();
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setMessage(error.message);
    setBusy(false);
  };

  const signInWithEmail = async (e: FormEvent<HTMLFormElement>) => {
    const supabase = createBrowserSupabaseClient();
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("確認メールを送信しました。メール内リンクからログインしてください。");
    }
    setBusy(false);
  };

  return (
    <main className="grid min-h-screen place-items-center p-8">
      <section className="card grid-bg w-full max-w-xl p-8">
        <p className="font-[var(--font-mono)] text-xs tracking-[0.2em] text-slate-500">
          APP ROI MONITOR
        </p>
        <h1 className="mt-2 font-[var(--font-heading)] text-4xl font-bold text-slate-900">
          ダッシュボードにログイン
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Google OAuth を推奨します。初回は Email リンク認証でも利用できます。
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={busy}
          className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          Google でログイン
        </button>

        <form onSubmit={signInWithEmail} className="mt-4 flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-orange-200 transition focus:ring"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Emailリンクを送信
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
