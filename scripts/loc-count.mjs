import fs from "node:fs";
import path from "node:path";

const APP_ID = process.env.APP_ID;
const PROJECT_ROOT = process.env.PROJECT_ROOT || ".";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!APP_ID || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing APP_ID, NEXT_PUBLIC_SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".scss",
  ".json",
  ".md",
  ".sql",
]);

const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "out", "dist", "coverage"]);

function countFileLines(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0).length;
}

function walkAndCount(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let total = 0;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      total += walkAndCount(fullPath);
      continue;
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (CODE_EXTENSIONS.has(ext)) {
        total += countFileLines(fullPath);
      }
    }
  }

  return total;
}

async function upsertLoc(loc) {
  const endpoint = `${SUPABASE_URL}/rest/v1/app_code_metrics`;
  const payload = [{
    app_id: APP_ID,
    loc,
    source: "github-actions",
  }];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} ${text}`);
  }

  const rows = await response.json();
  console.log("LOC snapshot inserted:", rows[0]);
}

const loc = walkAndCount(PROJECT_ROOT);
console.log(`Total LOC for ${APP_ID}: ${loc}`);
await upsertLoc(loc);
