// Simple fixed-window rate limiter backed by D1 (no extra Cloudflare bindings required)
export async function checkRateLimit(db: D1Database, key: string, limit: number, windowSec: number): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSec);

  const row = await db
    .prepare("SELECT count, window_start FROM rate_limits WHERE rl_key = ?")
    .bind(key)
    .first<{ count: number; window_start: number }>();

  if (!row || row.window_start !== windowStart) {
    await db
      .prepare(
        "INSERT INTO rate_limits (rl_key, count, window_start) VALUES (?, 1, ?) " +
          "ON CONFLICT(rl_key) DO UPDATE SET count = 1, window_start = excluded.window_start"
      )
      .bind(key, windowStart)
      .run();
    return true;
  }

  if (row.count >= limit) return false;

  await db.prepare("UPDATE rate_limits SET count = count + 1 WHERE rl_key = ?").bind(key).run();
  return true;
}
