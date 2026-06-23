import { Response } from "express";

// HTML que fecha o popup e avisa o app (postMessage) ou redireciona (fallback).
export function renderOAuthResult(
  res: Response,
  opts: { provider: string; ok: boolean; message?: string; frontendUrl: string }
): void {
  const payload = JSON.stringify({
    source: "mk-oauth",
    provider: opts.provider,
    status: opts.ok ? "connected" : "error",
    message: opts.message ?? ""
  });
  const qs = opts.ok
    ? `connected=${encodeURIComponent(opts.provider)}`
    : `error=${encodeURIComponent(opts.message ?? "falha")}`;
  const fallbackUrl = `${opts.frontendUrl}/dashboard/integracoes?${qs}`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Conectando…</title>
<style>body{font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#faf8ff;color:#27272a}</style>
</head><body>
<p>${opts.ok ? "Conta conectada! Pode fechar esta janela." : "Não foi possível conectar. Pode fechar esta janela."}</p>
<script>
(function(){
  var data = ${payload};
  try { if (window.opener && !window.opener.closed) { window.opener.postMessage(data, "*"); window.close(); return; } } catch(e){}
  window.location.replace(${JSON.stringify(fallbackUrl)});
})();
</script></body></html>`);
}
