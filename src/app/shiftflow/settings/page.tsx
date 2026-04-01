export default function StaffTaskSettingsPage() {
  return (
    <div>
      <p className="font-[var(--font-mono)] text-[11px] tracking-[0.2em] text-slate-500">STAFF & TASK SETTINGS</p>
      <h2 className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-slate-900">スタッフ・業務カテゴリ設定</h2>
      <p className="mt-2 text-sm text-slate-600">
        スタッフ登録と、似顔絵・プリント・梱包など業務カテゴリのマスタ設定を管理します。
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">スタッフ管理</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>・スタッフ追加/無効化</li>
            <li>・担当可能タスクの割当</li>
            <li>・シフトテンプレート設定</li>
          </ul>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-800">タスクカテゴリ管理</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>・似顔絵</li>
            <li>・プリント</li>
            <li>・梱包</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
