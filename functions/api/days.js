export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare("SELECT day, wins FROM days").all();
  const data = {};
  for (const r of results) data[r.day] = JSON.parse(r.wins);
  return Response.json(data);
}

export async function onRequestPut({ request, env }) {
  const { day, wins } = await request.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Array.isArray(wins) || wins.length !== 3) {
    return new Response("Bad request", { status: 400 });
  }
  await env.DB.prepare(
    "INSERT INTO days (day, wins) VALUES (?, ?) ON CONFLICT(day) DO UPDATE SET wins = excluded.wins"
  ).bind(day, JSON.stringify(wins)).run();
  return Response.json({ ok: true });
}
