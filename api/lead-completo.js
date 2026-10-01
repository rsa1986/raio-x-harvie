import { montarPromptRelatorio } from "../src/report-prompt-template.js";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ORIGENS_PERMITIDAS = [
  "https://harvie-raio-x.vercel.app",
  "https://harvie.coopers.digital", // domínio final, pós-migração — manter mesmo antes de existir
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ erro: "Método não permitido." });
    return;
  }

  const origem = req.headers.origin || req.headers.referer || "";
  if (!ORIGENS_PERMITIDAS.some((o) => origem.startsWith(o))) {
    res.status(403).json({ erro: "Origem não permitida." });
    return;
  }

  const { nome, whatsapp, email, branch, canal, blocoInterno, respostasCompletas, honeypot } = req.body || {};

  if (honeypot) {
    // resposta de sucesso falsa — não envia e-mail, não avisa o robô que foi bloqueado
    res.status(200).json({ ok: true });
    return;
  }

  if (!nome || !whatsapp || !email || !branch || !canal) {
    res.status(400).json({ erro: "Campos obrigatórios faltando." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destinatario = process.env.COMERCIAL_EMAIL;

  if (!apiKey || !destinatario) {
    res.status(500).json({ erro: "Configuração de e-mail ausente no servidor." });
    return;
  }

  const prompt = montarPromptRelatorio({
    nome,
    branch,
    canal,
    blocoInterno: blocoInterno || "",
    respostasCompletas: respostasCompletas || "",
  });

  const rotuloCanal = branch === "B" ? "Site" : "Instagram";

  const html = `
    <div style="font-family: sans-serif; max-width: 640px;">
      <h2>Novo lead pediu o Raio-X completo</h2>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Nome</strong></td><td>${escapeHtml(nome)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>WhatsApp</strong></td><td>${escapeHtml(whatsapp)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>E-mail</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>Branch</strong></td><td>${escapeHtml(branch)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><strong>${rotuloCanal}</strong></td><td>${escapeHtml(canal)}</td></tr>
      </table>
      <p>Prompt pronto pra colar num agente de IA e gerar o relatório completo:</p>
      <pre style="white-space: pre-wrap; background: #f4f4f4; padding: 16px; border-radius: 8px; font-size: 13px; line-height: 1.5;">${escapeHtml(prompt)}</pre>
    </div>
  `;

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // TODO: trocar de onboarding@resend.dev pra um remetente do domínio próprio
        // (ex: raio-x@coopers.digital) assim que o domínio estiver verificado na Resend.
        from: "Harvie Raio-X <onboarding@resend.dev>",
        to: [destinatario],
        subject: `Novo lead (${branch}): ${nome}`,
        html,
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("Falha ao enviar e-mail via Resend:", detalhe); // fica só no log da Vercel
      res.status(502).json({ erro: "Não conseguimos enviar agora. Tenta de novo em instantes?" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro inesperado ao enviar e-mail." });
  }
}
