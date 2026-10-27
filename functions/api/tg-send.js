/**
 * 텔레그램 전송 프록시 — 봇 토큰/채팅ID 는 Pages 시크릿(env.TG_BOT_TOKEN, env.TG_CHAT_ID)에만 존재.
 * 브라우저는 같은 출처로 {text} 만 POST. 토큰은 번들에 없음.
 */
const ALLOWED = ['https://diora.co.kr', 'https://www.diora.co.kr', 'https://diora.pages.dev', 'http://localhost', 'http://127.0.0.1'];

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || request.headers.get('Referer') || '';
  if (origin && !ALLOWED.some((a) => origin.startsWith(a))) return json({ ok: false }, 403);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false }, 400); }
  let text = body && typeof body.text === 'string' ? body.text : '';
  if (!text.trim()) return json({ ok: false }, 400);
  if (text.length > 2000) text = text.slice(0, 2000);

  if (!env.TG_BOT_TOKEN || !env.TG_CHAT_ID) return json({ ok: false, error: 'not configured' }, 503);

  try {
    const r = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text, parse_mode: 'HTML' }),
    });
    return json({ ok: r.ok }, r.ok ? 200 : 502);
  } catch {
    return json({ ok: false }, 502);
  }
}
