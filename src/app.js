import * as engine from "./quiz-engine.js";

const root = document.getElementById("quiz-root");

let state = engine.initialState();

// Estado do gate de captura (nome/WhatsApp/e-mail) que substitui, por ora, o
// CTA comercial na tela de resultado — troca o relatório básico grátis por um
// relatório completo prometido em troca do contato do lead. Separado de
// `state` porque não faz parte da lógica/pontuação do quiz.
let captura = { enviado: false, erro: null, lead: null, campos: null };

function resetCaptura() {
  captura = { enviado: false, erro: null, lead: null, campos: null };
}

// Reset completo, usado tanto pelo link "refazer o raio-X" quanto pelo clique
// no logo (cabeçalho/rodapé) — zera o estado do quiz, volta a URL pra / e
// deixa render() cuidar de tirar a classe "modo-app" (fase volta a "intro").
function reiniciarTudo() {
  resetCaptura();
  history.pushState({}, "", "/");
  setState(engine.reiniciar());
}

// Aceita o número do jeito que a pessoa digitar (com ou sem parênteses,
// espaço, traço) — só os dígitos importam pra validação. 11 dígitos = 2 de
// DDD + 9 do número. Retorna null se inválido, senão a versão normalizada
// "(DDD)999999999" pra guardar sempre no mesmo formato.
function normalizarWhatsapp(valor) {
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length !== 11) return null;
  return `(${digitos.slice(0, 2)})${digitos.slice(2)}`;
}

function validarLead(nome, whatsapp, email, canal, branch) {
  if (!nome) return "Preenche seu nome.";
  if (!normalizarWhatsapp(whatsapp)) return "WhatsApp precisa ter DDD + 9 dígitos, ex: (41)999999999.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Preenche um e-mail válido.";
  // O canal pedido muda por branch (site pra quem já tem site, Instagram pra
  // quem não tem) mas é sempre obrigatório — é o que o relatório vai auditar.
  if (!canal) return branch === "B" ? "Preenche o endereço do seu site." : "Preenche seu Instagram.";
  return null;
}

function setState(next) {
  state = next;
  render();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

const CHECK_ICON =
  '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 8.5L6.2 11.5L13 4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function renderIntro() {
  return el("div", { class: "quiz-card quiz-card--center" }, [
    el("h2", { class: "quiz-title" }, "Vamos ao raio-X"),
    el("p", { class: "quiz-lede" }, "São poucas perguntas curtas sobre como o seu negócio aparece hoje. Nenhuma resposta certa ou errada."),
    el("button", { class: "btn btn--primary", onClick: () => setState(engine.iniciar(state)) }, "Começar agora"),
  ]);
}

function renderPergunta() {
  const p = engine.perguntaAtual(state);
  const isMulti = p.tipo === "multi";
  const { numero, total } = engine.numeroETotal(state);
  const progressoPct = Math.round(((numero - 1) / total) * 100);

  const opcoes = p.opcoes.map((op, i) => {
    const on = isMulti && !!state.multi[i];
    const acao = isMulti ? () => setState(engine.toggleMulti(state, i)) : () => setState(engine.responder(state, op));
    const marcaAttrs = { class: "opcao__marca" + (isMulti ? " opcao__marca--check" : "") };
    if (isMulti) marcaAttrs.html = CHECK_ICON;
    return el(
      "button",
      { class: "opcao" + (on ? " opcao--on" : ""), onClick: acao, ...(isMulti ? { "aria-pressed": on ? "true" : "false" } : {}) },
      [el("span", marcaAttrs), el("span", {}, op.texto)]
    );
  });

  // 3 segmentos ecoando os pilares (Visibilidade / Credibilidade / Estrutura), cada um cobrindo 1/3 do progresso total.
  const segFills = [0, 1, 2].map((i) => Math.max(0, Math.min(100, (progressoPct - i * (100 / 3)) * 3)));

  const children = [
    el("div", { class: "quiz-header-row" }, [
      el("span", { class: "eyebrow" }, `Pergunta ${numero} de ${total}`),
      el("button", { class: "link-btn", onClick: () => setState(engine.voltar(state)) }, "← voltar"),
    ]),
    el(
      "div",
      {
        class: "progress3",
        role: "progressbar",
        "aria-label": "Progresso do quiz",
        "aria-valuenow": String(numero),
        "aria-valuemin": "1",
        "aria-valuemax": String(total),
      },
      segFills.map((fill, i) =>
        el("div", { class: "progress3__seg" }, [
          el("div", { class: `progress3__seg-fill progress3__seg-fill--${i}`, style: `width: ${fill}%;` }),
        ])
      )
    ),
    el("h2", { class: "quiz-title quiz-title--left" }, p.texto),
    p.dica ? el("p", { class: "quiz-dica" }, p.dica) : null,
    el("div", { class: "opcoes" }, opcoes),
  ];

  if (isMulti) {
    children.push(
      el("div", { class: "continuar-wrap" }, [
        el("button", { class: "btn btn--secondary", onClick: () => setState(engine.confirmarMulti(state)) }, "Continuar"),
      ])
    );
  }

  return el("div", { class: "quiz-card" }, children);
}

function renderSegmento() {
  const select = el(
    "select",
    { class: "select", id: "segmento-select", onChange: (e) => setState(engine.mudarSegmento(state, e.target.value)) },
    [
      el("option", { value: "" }, "— Selecione —"),
      el(
        "optgroup",
        { label: "Perfil autônomo / reputação pessoal" },
        engine.segsMini.map((s) => el("option", { value: s.nome }, s.nome))
      ),
      el(
        "optgroup",
        { label: "Negócio estabelecido / múltiplas frentes" },
        engine.segsPro.map((s) => el("option", { value: s.nome }, s.nome))
      ),
      el("option", { value: "__outro__" }, "Outro (não está na lista)"),
    ]
  );
  select.value = state.segSelect;

  const children = [
    el("span", { class: "eyebrow" }, "Última pergunta · opcional"),
    el("h2", { class: "quiz-title quiz-title--left quiz-title--tight", id: "segmento-heading" }, "Qual o seu segmento de atuação?"),
    el("p", { class: "quiz-dica" }, "Serve só para deixar a leitura do resultado mais precisa."),
    el("label", { class: "visually-hidden", for: "segmento-select" }, "Segmento de atuação"),
    select,
  ];

  let outroInput = null;
  if (state.segSelect === "__outro__") {
    // Sem onInput -> não dispara re-render a cada tecla (o valor só é lido do
    // DOM no clique de "Ver meu resultado", pra não derrubar o foco do campo).
    outroInput = el("input", {
      class: "text-input",
      id: "segmento-outro",
      type: "text",
      placeholder: "Descreva em poucas palavras...",
      "aria-label": "Descreva seu segmento em poucas palavras",
    });
    outroInput.value = state.segOutro;
    children.push(outroInput);
  }

  children.push(
    el("div", { class: "quiz-actions" }, [
      el(
        "button",
        {
          class: "btn btn--primary",
          onClick: () => {
            const comOutro = outroInput ? engine.mudarOutro(state, outroInput.value) : state;
            setState(engine.finalizar(comOutro));
          },
        },
        "Ver meu resultado"
      ),
    ])
  );

  return el("div", { class: "quiz-card" }, children);
}

function campo(labelText, inputEl, apoio) {
  const children = [el("label", { class: "field-label", for: inputEl.getAttribute("id") }, labelText), inputEl];
  if (apoio) children.push(el("div", { class: "campo-apoio" }, apoio));
  return el("div", { class: "campo" }, children);
}

// Formata o achado interno e o log de respostas como texto simples, pronto
// pra ir dentro do e-mail/prompt gerado em api/lead-completo.js.
function formatarBlocoInterno(interno) {
  return interno.map((item) => `${item.label} ${item.valor}`).join("\n");
}

function formatarRespostasCompletas(log) {
  return log.map((r) => `- ${r.pergunta}: ${r.resposta}`).join("\n");
}

// Descrição do que o relatório completo entrega, por branch e por pilar mais
// fraco — antes era um texto fixo por branch (só o nome do pilar mudava);
// agora descreve de verdade o que é analisado pro pilar em questão.
const DESCRICAO_RELATORIO = {
  A: {
    V: "a gente aponta onde você está sendo (ou não) encontrado hoje — Google, redes sociais, Google Meu Negócio",
    C: "a gente aponta onde sua prova social está escondida ou desatualizada",
    E: "a gente aponta se sua presença hoje é sustentável no dia a dia — frequência de publicação, organização entre os canais",
  },
  B: {
    V: "a gente analisa se seu site está configurado pra aparecer em buscas — indexação, SEO técnico",
    C: "a gente analisa como seu site transmite confiança — prova social, alinhamento com o que você entrega hoje",
    E: "a gente analisa a saúde técnica do seu site — velocidade de carregamento, estabilidade",
  },
};

function renderCapturaGate(res) {
  // O campo extra e a copy do card mudam por branch: quem já tem site (B)
  // recebe uma auditoria de site; quem não tem (A) recebe uma comparação de
  // canais/redes. Os dois branches sempre pedem exatamente um desses campos
  // — nunca os dois, nunca nenhum.
  const isBranchB = state.branch === "B";

  // Inputs não-controlados: só lemos o valor no submit, pra não derrubar o
  // foco a cada tecla (o mesmo problema corrigido no campo "outro" acima).
  const nomeInput = el("input", { class: "text-input", type: "text", id: "lead-nome", autocomplete: "name" });
  const whatsappInput = el("input", {
    class: "text-input",
    type: "tel",
    id: "lead-whatsapp",
    autocomplete: "tel",
    placeholder: "(41)999999999",
    maxlength: "20",
  });
  const canalInput = isBranchB
    ? el("input", { class: "text-input", type: "text", id: "lead-canal", autocomplete: "url", placeholder: "seusite.com.br" })
    : el("input", { class: "text-input", type: "text", id: "lead-canal", autocomplete: "off", placeholder: "@seuusuario" });
  const emailInput = el("input", {
    class: "text-input",
    type: "email",
    id: "lead-email",
    autocomplete: "email",
    placeholder: "nome@dominio.com.br",
  });

  // Honeypot: campo escondido só visualmente (fora da tela, não com display
  // none/visibility hidden — bots simples ignoram esses dois), sem label e
  // fora da navegação por tab/leitor de tela (diferente de .visually-hidden,
  // que existe pra expor conteúdo a leitor de tela — o oposto do que um
  // honeypot precisa). Preenchido -> barrado no submit e de novo na API.
  const honeypotInput = el("input", {
    type: "text",
    name: "empresa_confirmacao",
    style: "position: absolute; left: -9999px;",
    tabindex: "-1",
    autocomplete: "off",
    "aria-hidden": "true",
  });

  if (captura.campos) {
    nomeInput.value = captura.campos.nome;
    whatsappInput.value = captura.campos.whatsapp;
    emailInput.value = captura.campos.email;
    canalInput.value = captura.campos.canal || "";
  }

  const form = el(
    "form",
    {
      class: "captura-form captura-form--4",
      novalidate: "novalidate",
      onSubmit: async (e) => {
        e.preventDefault();
        const nome = nomeInput.value.trim();
        const whatsapp = whatsappInput.value.trim();
        const email = emailInput.value.trim();
        const canal = canalInput.value.trim();
        const erro = validarLead(nome, whatsapp, email, canal, state.branch);
        if (erro) {
          captura = { enviado: false, erro, lead: null, campos: { nome, whatsapp, email, canal } };
          render();
          return;
        }
        const whatsappNormalizado = normalizarWhatsapp(whatsapp);
        const lead = {
          nome,
          whatsapp: whatsappNormalizado,
          email,
          site: isBranchB ? canal : null,
          instagram: isBranchB ? null : canal,
        };
        try {
          const resposta = await fetch("/api/lead-completo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome,
              whatsapp: whatsappNormalizado,
              email,
              branch: state.branch,
              canal,
              blocoInterno: formatarBlocoInterno(res.interno),
              respostasCompletas: formatarRespostasCompletas(res.log),
              honeypot: honeypotInput.value,
            }),
          });
          if (!resposta.ok) throw new Error("falha no envio");
          captura = { enviado: true, erro: null, lead, campos: null };
        } catch (err) {
          captura = {
            enviado: false,
            erro: "Deu ruim aqui do nosso lado — tenta de novo em alguns segundos?",
            lead: null,
            campos: { nome, whatsapp, email, canal },
          };
        }
        render();
      },
    },
    [
      campo("Nome", nomeInput),
      campo("WhatsApp", whatsappInput),
      isBranchB
        ? campo("Site", canalInput, "É o site que a gente vai analisar de verdade no seu Raio-X completo.")
        : campo("Instagram", canalInput, "É o perfil que a gente vai analisar de verdade no seu Raio-X completo."),
      campo("E-mail", emailInput),
      honeypotInput,
      captura.erro ? el("div", { class: "campo-erro" }, captura.erro) : null,
      el("button", { class: "btn btn--primary", type: "submit" }, "Quero o diagnóstico completo"),
    ]
  );

  const descricao = DESCRICAO_RELATORIO[state.branch][res.pilarFracoChave];
  const paragrafo = `Baseado nas suas respostas, seu ponto mais urgente hoje é ${res.pilarFracoLabel}. No relatório completo, ${descricao}. São mais de ${isBranchB ? "10" : "6"} pontos mapeados no total, com uma proposta de ação específica pro seu caso. Sem compromisso.`;

  const linhaReforco = isBranchB
    ? "Para isso, precisamos das suas informações, inclusive o endereço do seu site."
    : "Para isso, precisamos das suas informações, inclusive o @ do seu Instagram.";

  return el("div", { class: "cta-harvie cta-harvie--captura" }, [
    el("div", {}, [
      el("div", { class: "cta-harvie__head" }, [
        el("img", { class: "cta-harvie__logo", src: "/assets/harvie-lion.png", alt: "" }),
        el("div", { class: "cta-harvie__titulo" }, "Quer o diagnóstico completo?"),
      ]),
      el("div", { class: "cta-harvie__texto" }, [paragrafo, " ", linhaReforco]),
    ]),
    form,
  ]);
}

function renderCapturaConfirmacao() {
  return el("div", { class: "cta-harvie" }, [
    el("div", {}, [
      el("div", { class: "cta-harvie__head" }, [
        el("img", { class: "cta-harvie__logo", src: "/assets/harvie-lion.png", alt: "" }),
        el("div", { class: "cta-harvie__titulo" }, "Recebemos seus dados!"),
      ]),
      el(
        "div",
        { class: "cta-harvie__texto" },
        "Prontinho! Nosso time já recebeu seus dados e logo você vai receber seu diagnóstico completo. Combinado?"
      ),
    ]),
  ]);
}

// Cor própria de cada pilar, igual ao que já é usado na seção "Os três
// pilares" da landing page — reaproveitada na lista de pilares do resultado.
const PILAR_COR = { V: "#FF8A00", C: "#D25C9C", E: "#6B7DE5" };

// Anel de progresso do score geral (0-10), como string SVG — segue o mesmo
// padrão do CHECK_ICON acima: SVG via innerHTML, não via el(), porque
// document.createElement() não cria elementos SVG com o namespace certo.
// Usa o mesmo gradiente laranja-rosa do botão primário e do H1 da landing
// (--gradient-brand), pra a tela de resultado conversar com o resto do site.
function anelScoreSvg(pct) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, pct)));
  return `<svg viewBox="0 0 130 130" width="130" height="130" aria-hidden="true">
    <defs>
      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF8A00"/>
        <stop offset="100%" stop-color="#D25C9C"/>
      </linearGradient>
    </defs>
    <circle class="anel-score__trilha" cx="65" cy="65" r="${r}" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="9"/>
    <circle cx="65" cy="65" r="${r}" fill="none" stroke="url(#scoreGrad)" stroke-width="9"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}"
      transform="rotate(-90 65 65)"/>
  </svg>`;
}

// Conta de 0 até o valor final em `duracaoMs`, sem depender de nenhuma
// biblioteca — só pra dar a sensação de "calculando na hora" quando o
// resultado aparece.
function animarNumero(elemento, valorFinal, duracaoMs) {
  const inicio = performance.now();
  function passo(agora) {
    const t = Math.min(1, (agora - inicio) / duracaoMs);
    elemento.textContent = (valorFinal * t).toFixed(1);
    if (t < 1) requestAnimationFrame(passo);
    else elemento.textContent = valorFinal.toFixed(1); // evita sobra de arredondamento no frame final
  }
  requestAnimationFrame(passo);
}

function renderScoreEstagio(res) {
  const numEl = el("span", { class: "score-card__num" }, "0.0");
  requestAnimationFrame(() => animarNumero(numEl, res.scoreGeral, 800));

  return el("div", { class: "score-card" }, [
    el("div", { class: "score-card__ring-wrap" }, [
      el("span", { class: "eyebrow eyebrow--brand score-card__rotulo" }, "Sua nota geral"),
      el("div", { class: "score-card__ring" }, [el("div", { html: anelScoreSvg(res.scoreGeral / 10) }), numEl]),
      el("div", { class: "score-card__max" }, "de 10"),
    ]),
    el("div", { class: "score-card__info" }, [
      el("div", { class: "score-card__estagio" }, res.estagio.nome),
      el("div", { class: "score-card__desc" }, res.estagio.desc),
    ]),
  ]);
}

// Lista única por pilar — junta em um só lugar o que antes eram 3 blocos
// separados (barras de resumo, os 2 cards de destaque, e a lista detalhada
// com bolinhas): nome + valor, pergunta, barra animada, texto completo do
// nível, selo de destaque quando aplicável, e a citação do lead quando ela
// bate com o pilar mais fraco (ACHADO_PILAR, calculado em quiz-engine.js).
const BARRA_ATRASO_BASE = 80;
const BARRA_ATRASO_ENTRE = 130;

function renderPilaresUnificado(res) {
  const linhas = res.pilares.map((p, i) => {
    const nivel = res.scores[p.chave.toLowerCase()];
    const cor = PILAR_COR[p.chave];
    const ehForte = res.mostrarCardForte && p.chave === res.pilarForteChave;
    const ehFraco = p.chave === res.pilarFracoChave;

    const fill = el("div", { class: "barra-pilar__fill", style: `width: 0%; background: ${cor};` });
    setTimeout(() => {
      fill.style.width = `${(nivel / 3) * 100}%`;
    }, BARRA_ATRASO_BASE + i * BARRA_ATRASO_ENTRE);

    const nomeWrapChildren = [el("span", { class: "pilar-linha__nome", style: `color: ${cor};` }, p.label)];
    if (ehForte) {
      nomeWrapChildren.push(el("span", { class: "pilar-linha__selo", style: `color: ${cor};` }, "★ Seu ponto mais forte"));
    }
    if (ehFraco) {
      nomeWrapChildren.push(el("span", { class: "pilar-linha__selo pilar-linha__selo--fraco" }, "⚠ Seu ponto mais urgente"));
    }

    const children = [
      el("div", { class: "pilar-linha__head" }, [el("div", { class: "pilar-linha__nome-wrap" }, nomeWrapChildren)]),
      el("div", { class: "pilar-linha__pergunta" }, p.pergunta),
      el("div", { class: "barra-pilar__track" }, [fill]),
      el("div", { class: "pilar-linha__texto" }, p.texto),
    ];

    if (ehFraco && res.citarNoCardFraco) {
      children.push(el("div", { class: "pilar-linha__citacao" }, `"${res.achado}"`));
    }

    return el("div", { class: "pilar-linha" }, children);
  });

  return el("div", { class: "pilares-lista" }, linhas);
}

// dd/mm/aaaa — usado só no cabeçalho de impressão (ver .print-header em
// style.css), já que o header normal (com o logo) fica escondido no @media print.
function formatarDataHoje() {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function renderResultado() {
  const res = engine.montarResultado(state);

  const blocos = [
    // Só aparece no impresso/PDF (display:none na tela) — substitui o header
    // normal, que fica escondido no @media print.
    el("div", { class: "print-header" }, `Harvie — Raio-X da sua presença digital · ${formatarDataHoje()}`),
    el("div", { class: "resultado-header" }, [
      el("span", { class: "eyebrow eyebrow--brand" }, "Resultado"),
      el("h2", { class: "resultado-title" }, "Seu diagnóstico"),
    ]),
    el("div", { class: "salvar-resultado-wrap" }, [
      el(
        "button",
        { class: "btn btn--secondary", type: "button", onClick: () => window.print() },
        "📄 Salvar meu resultado"
      ),
    ]),
    renderScoreEstagio(res),
    renderPilaresUnificado(res),
  ];

  if (res.temNotas) {
    blocos.push(
      el(
        "div",
        { class: "notas" },
        res.notas.map((n) =>
          el("div", { class: "nota" }, [el("div", { class: "nota__eyebrow" }, "Um detalhe importante"), el("div", {}, n.texto)])
        )
      )
    );
  }

  blocos.push(
    el("div", { class: "quickwin" }, [
      el("div", { class: "eyebrow eyebrow--brand" }, "Seu próximo passo · grátis, pode fazer sozinho"),
      el("div", { class: "quickwin__texto" }, res.quickWin),
    ])
  );

  blocos.push(captura.enviado ? renderCapturaConfirmacao() : renderCapturaGate(res));

  blocos.push(
    el("div", { class: "refazer" }, [
      el(
        "button",
        {
          class: "link-btn",
          onClick: reiniciarTudo,
        },
        "refazer o raio-X"
      ),
    ])
  );

  return el("div", {}, blocos);
}

// Fora do "intro" (ou seja, respondendo o quiz ou vendo o resultado), esconde
// as seções de marketing da landing (hero, pilares, why-section, footer —
// via CSS em .modo-app) pra rolar a página não volte pro topo da landing.
// Ao chegar em "resultado", a URL vira /resultado (sem recarregar, sem
// perder estado); o botão "voltar" nativo do navegador força um reload limpo
// via o listener de popstate abaixo, em vez de deixar URL e tela dessincronizadas.
function render() {
  document.body.classList.toggle("modo-app", state.fase !== "intro");
  if (state.fase === "resultado" && window.location.pathname !== "/resultado") {
    history.pushState({}, "", "/resultado");
  }

  root.innerHTML = "";
  let card;
  if (state.fase === "intro") card = renderIntro();
  else if (state.fase === "q") card = renderPergunta();
  else if (state.fase === "segmento") card = renderSegmento();
  else card = renderResultado();
  root.appendChild(card);
}

window.addEventListener("popstate", () => {
  window.location.reload();
});

// Logo (cabeçalho + rodapé) volta pro início — mesmo reset do "refazer o
// raio-X". São estáticos no index.html (nunca recriados por render()), então
// um addEventListener direto aqui, uma vez só, já é suficiente.
document.querySelectorAll(".logo-reset").forEach((botao) => {
  botao.addEventListener("click", reiniciarTudo);
});

render();
