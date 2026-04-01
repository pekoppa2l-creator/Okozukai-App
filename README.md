# App ROI Monitor Dashboard

自作アプリの Time-ROI / Code-ROI を監視する Next.js + Supabase ダッシュボードです。

## Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Recharts
- Supabase (PostgreSQL + Auth)

## 1. Supabase セットアップ
1. Supabaseで新規プロジェクトを作成
2. SQL Editorで [supabase/schema.sql](supabase/schema.sql) を実行
3. Authentication > Providers で Google を有効化（必要なら Email も有効）
4. Authentication URLに以下を追加
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`

## 2. ローカル環境変数
`.env.local` を作成して以下を設定します。

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_PROJECT_REF=...
```

## 3. 開発実行
```bash
npm install
npm run dev
```

## 4. ログ送信の埋め込み (Phase 1)
`src/lib/log-usage.ts` の `logUsage` を他アプリにコピーして、起動時に呼び出してください。

```ts
import { logUsage } from "@/lib/log-usage";

await logUsage("kids-allowance");
```

## 5. 開発ログ連携 (Phase 3)
既存の開発ログアプリ側で、日別作業時間を `app_daily_dev_time` に同期してください。

必要カラム:
- `app_id` (text)
- `work_date` (date)
- `work_minutes` (int)

## 6. LOC自動更新 (GitHub Actions)
- ワークフロー: [.github/workflows/loc-update.yml](.github/workflows/loc-update.yml)
- スクリプト: [scripts/loc-count.mjs](scripts/loc-count.mjs)

GitHub Secrets を設定:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 7. 推奨デプロイ（Vercel）
1. GitHubへpush
2. VercelでリポジトリをImport
3. 環境変数を `.env.local` と同じ内容で設定
4. Deploy

本番URLを Supabase Auth の Site URL / Redirect URL に追加してください。
