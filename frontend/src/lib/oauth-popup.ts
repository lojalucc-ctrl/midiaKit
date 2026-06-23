// Abre o consentimento OAuth numa janela popup e resolve quando o backend
// avisa o resultado (postMessage) ou quando a janela é fechada.
//
// Observação: a página de callback pode vir de origens diferentes (localhost
// do backend OU um túnel ngrok https, no caso do Instagram). Como a mensagem
// não carrega dados sensíveis (apenas dispara um refetch), validamos pela
// "marca" da mensagem (source === "mk-oauth") em vez de fixar a origem.

export interface OAuthResult {
  status: "connected" | "error" | "closed";
  provider?: string;
  message?: string;
}

export function openOAuthPopup(url: string): Promise<OAuthResult> {
  return new Promise((resolve) => {
    const w = 600;
    const h = 750;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      url,
      "mk_oauth",
      `width=${w},height=${h},left=${left},top=${top}`
    );

    if (!popup) {
      // Popup bloqueado: cai para redirect na própria aba.
      window.location.href = url;
      return;
    }

    let settled = false;
    const finish = (result: OAuthResult) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("message", onMessage);
      clearInterval(timer);
      resolve(result);
    };

    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (data && data.source === "mk-oauth") {
        try {
          popup?.close();
        } catch {}
        finish({ status: data.status, provider: data.provider, message: data.message });
      }
    }

    window.addEventListener("message", onMessage);

    // Fallback: se o usuário fechar a janela sem concluir.
    const timer = setInterval(() => {
      if (popup.closed) finish({ status: "closed" });
    }, 700);
  });
}
