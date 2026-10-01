// Motor de pontuação e fluxo do quiz — porte de
// quiz-logic/quiz-harvie-prototipo-v8.html para funções puras (sem alterar regras).
// Ver quiz-logic/quiz-harvie-brief-v8.md para o racional de cada regra.

import {
  Q1, Q2, Q3A, Q3B, Q4, Q4b, Q5A, Q5bA, Q5B, Q6, QProva,
  SEG_MINI, SEG_PRO, BRAND_SAFETY, STOPWORDS, SINONIMOS,
  TEXTOS, QUICK_WINS, NOTAS_TEXTO,
} from "./quiz-data.js";

const COMBINING_MARKS = new RegExp("[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]", "g");

function norm(s) {
  return s.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "").trim();
}

function stem(p) {
  return p.length > 6 ? p.slice(0, 6) : p;
}

function palavras(nome) {
  const base = norm(nome)
    .replace(/[()\/]/g, " ")
    .split(/[\s,]+/)
    .filter((p) => p.length > 3 && !STOPWORDS.has(p))
    .map(stem);
  return base.concat((SINONIMOS[nome] || []).map(norm));
}

function flatten(dict, icp) {
  const out = [];
  ["alto", "medio", "baixo"].forEach((tier) =>
    dict[tier].forEach((nome) => out.push({ nome, tier, icp, palavras: palavras(nome) }))
  );
  return out;
}

// Ordem de exibição: alfabética dentro de cada grupo (Mini / Pro Plus), pra
// ficar fácil de escanear no <select>. O tier (alto/medio/baixo) usado no fit
// de segmento não muda — só a posição de cada item na lista.
function porNome(a, b) {
  return a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" });
}

const segsMiniBruto = flatten(SEG_MINI, "Mini");
const segsProBruto = flatten(SEG_PRO, "Pro Plus");
// ordem ORIGINAL (agrupada por tier, não alfabética) — é a que o matching por
// texto livre usa pra desempate quando duas palavras-raiz coincidem por acaso
const todosSegmentos = segsMiniBruto.concat(segsProBruto);

// ordem alfabética — só pra exibição no <select>, nunca usada no matching
export const segsMini = [...segsMiniBruto].sort(porNome);
export const segsPro = [...segsProBruto].sort(porNome);

export function identificarPorTexto(texto) {
  const t = norm(texto);
  let flag = null;
  Object.keys(BRAND_SAFETY).forEach((cat) => {
    if (BRAND_SAFETY[cat].some((kw) => t.includes(norm(kw)))) flag = cat;
  });
  if (flag) return { tier: null, icp: null, sugestaoBaseadaEm: null, brandSafety: flag, confirmado: false };

  let melhor = null;
  let score = 0;
  todosSegmentos.forEach((seg) => {
    const s = seg.palavras.filter((p) => t.includes(p)).length;
    if (s > score) {
      score = s;
      melhor = seg;
    }
  });
  if (!melhor) return { tier: null, icp: null, sugestaoBaseadaEm: null, brandSafety: null, confirmado: false };
  return { tier: melhor.tier, icp: melhor.icp, sugestaoBaseadaEm: melhor.nome, brandSafety: null, confirmado: false };
}

export function sequencia(respostas, branch) {
  const seq = [Q2, branch === "A" ? Q3A : Q3B, Q4];
  if (respostas.some((r) => r.tag === "decisor_duplo")) seq.push(Q4b);
  seq.push(branch === "A" ? Q5A : Q5B);
  if (branch === "A") seq.push(Q5bA);
  seq.push(Q6);
  seq.push(QProva);
  return seq;
}

export function achou(state, tag) {
  return state.respostas.some((r) => r.tag === tag) || state.canaisTags.includes(tag);
}

export function perguntaAtual(state) {
  if (state.branch === null) return Q1;
  return sequencia(state.respostas, state.branch)[state.step];
}

export function initialState() {
  return {
    fase: "intro",
    respostas: [],
    canaisTags: [],
    branch: null,
    step: 0,
    multi: {},
    segSelect: "",
    segOutro: "",
    segInfo: null,
  };
}

export function iniciar(state) {
  return { ...state, fase: "q" };
}

export function reiniciar() {
  return initialState();
}

export function responder(state, op) {
  if (state.branch === null) {
    return {
      ...state,
      branch: op.branch,
      step: 0,
      respostas: [{ pergunta: Q1.texto, resposta: op.texto, tag: op.tag }],
    };
  }
  const p = perguntaAtual(state);
  const respostas = state.respostas.concat([{ pergunta: p.texto, resposta: op.texto, tag: op.tag }]);
  const step = state.step + 1;
  const seq = sequencia(respostas, state.branch);
  return { ...state, respostas, step, fase: step < seq.length ? "q" : "segmento" };
}

export function toggleMulti(state, i) {
  return { ...state, multi: { ...state.multi, [i]: !state.multi[i] } };
}

export function confirmarMulti(state) {
  const p = perguntaAtual(state);
  const escolhidas = [];
  const tags = [];
  p.opcoes.forEach((op, i) => {
    if (state.multi[i]) {
      escolhidas.push(op.texto);
      tags.push(op.tag);
    }
  });
  const respostas = state.respostas.concat([
    { pergunta: p.texto, resposta: escolhidas.length ? escolhidas.join(", ") : "(nenhuma marcada)", tag: "canais_multi" },
  ]);
  return {
    ...state,
    respostas,
    canaisTags: state.canaisTags.concat(tags),
    multi: {},
    step: state.step + 1,
  };
}

export function voltar(state) {
  if (state.branch === null) {
    return { ...state, fase: "intro" };
  }
  if (state.step === 0) {
    return { ...state, branch: null, respostas: [], canaisTags: [], multi: {} };
  }
  const respostas = state.respostas.slice();
  const removida = respostas.pop();
  const canaisTags = removida && removida.tag === "canais_multi" ? [] : state.canaisTags;
  return { ...state, respostas, canaisTags, step: Math.max(0, state.step - 1), multi: {}, fase: "q" };
}

export function mudarSegmento(state, valor) {
  return { ...state, segSelect: valor };
}

export function mudarOutro(state, valor) {
  return { ...state, segOutro: valor };
}

export function finalizar(state) {
  const sel = state.segSelect;
  let respostas = state.respostas.slice();
  let segInfo;
  if (sel && sel !== "__outro__") {
    const found = todosSegmentos.find((x) => x.nome === sel);
    respostas.push({ pergunta: "Segmento", resposta: sel, tag: "segmento_livre" });
    segInfo = { nome: sel, icp: found.icp, tier: found.tier, sugestaoBaseadaEm: null, brandSafety: null, confirmado: true };
  } else {
    const livre = (state.segOutro || "").trim() || "(não informado)";
    respostas.push({ pergunta: "Segmento", resposta: livre, tag: "segmento_livre" });
    segInfo = { nome: livre, ...identificarPorTexto(livre) };
  }
  return { ...state, respostas, segInfo, fase: "resultado" };
}

export function calcV(state) {
  const siteForca = { sem_site: 0, so_rede_social: 1, site_desatualizado: 1, site_ativo: 2 };
  const canalForca = { canal_indicacao: 0, canal_nao_sabe: 0, canal_redes: 1, canal_ads: 2, canal_busca: 3 };
  const siteTag = state.respostas.find((r) => ["sem_site", "so_rede_social", "site_desatualizado", "site_ativo"].includes(r.tag));
  const atual = siteTag ? siteForca[siteTag.tag] : 0;
  const melhor = state.canaisTags.reduce((m, t) => Math.max(m, canalForca[t] || 0), 0);
  const raw = atual + melhor;
  if (raw <= 1) return 0;
  if (raw <= 3) return 1;
  if (raw === 4) return 2;
  return 3;
}

export function calcC(state) {
  let base = achou(state, "site_ativo") ? 3 : achou(state, "site_desatualizado") ? 1 : 0;
  if (achou(state, "site_desalinhado")) base -= 1;
  if (achou(state, "estado_urgente")) base -= 1;
  if (achou(state, "prova_forte")) base += 1;
  if (achou(state, "prova_ausente")) base -= 1;
  return Math.max(0, Math.min(3, base));
}

export function calcE(state) {
  const budgetForca = { budget_zero: 0, budget_baixo: 1, budget_medio: 2, budget_alto: 3 };
  const bt = state.respostas.find((r) => r.tag && r.tag.indexOf("budget_") === 0);
  const budget = bt ? budgetForca[bt.tag] : 0;
  let dec = 0;
  if (achou(state, "decisor_unico")) dec = 1;
  else if (achou(state, "decisor_duplo")) dec = achou(state, "codecisor_influenciador") ? 0 : 1;
  let pen = 0;
  if (achou(state, "manutencao_travada")) pen += 1;
  if (achou(state, "sem_metrica")) pen += 1;
  const raw = Math.max(0, budget + dec - pen);
  if (raw === 0) return 0;
  if (raw <= 2) return 1;
  if (raw === 3) return 2;
  return 3;
}

// Estágios de maturidade, com base na soma bruta dos 3 pilares (0 a 9) — usado
// só pro resumo no topo do resultado (score geral em anel), não substitui a
// leitura detalhada por pilar que já existe.
const ESTAGIOS = [
  { max: 2, nome: "No início", desc: "Ainda não existe base construída — é normal, todo negócio começa por aqui." },
  { max: 5, nome: "Em construção", desc: "Já existe uma base real, mas ainda com pontos soltos entre os pilares." },
  { max: 7, nome: "Ganhando forma", desc: "As peças já conversam entre si — falta consistência pra virar hábito." },
  { max: 9, nome: "Consolidado", desc: "Presença digital já funciona como parte do negócio — hora de otimizar, não reconstruir." },
];

// Liga a tag do achado ao pilar que ela realmente afeta, pra citação do lead
// aparecer dentro da linha do pilar mais fraco quando os dois baterem. Fora
// desse caso (tag não mapeada, ou mapeada pra um pilar que não é o mais
// fraco), nenhuma citação é exibida em lugar nenhum. `sem_dor_forte` fica de
// fora de propósito — não tem pilar associado.
const ACHADO_PILAR = {
  estado_urgente: "C",
  sem_metrica: "E",
  site_desalinhado: "C",
  estado_perdido: "E",
  estado_sem_prioridade: "E",
};

// Calibrado a partir de ICP_e_Personas_Harvie: só Mini e Pro Plus têm perfil
// validado com cliente real hoje. Pro/Business/Enterprise ainda não têm
// critério confiável — por isso a função nunca afirma esses 3, só sinaliza
// "considerar porte maior" quando o orçamento relatado já sugere isso.
export function calcularSugestaoPlano({ branch, budgetTag, segInfo }) {
  if (segInfo && segInfo.brandSafety) {
    return {
      plano: "Não sugerir — validar segmento (brand safety) antes de prosseguir",
      confianca: null,
      nota: null,
    };
  }

  // Base vem do branch (resposta direta do lead). Só é sobreposta pelo fit
  // de segmento quando o lead CONFIRMOU o segmento na lista — um palpite por
  // texto livre não tem confiabilidade suficiente pra virar a decisão.
  let icpBase = branch === "A" ? "Mini" : "Pro Plus";
  if (segInfo && segInfo.icp && segInfo.confirmado) {
    icpBase = segInfo.icp;
  }
  const plano = icpBase === "Mini" ? "Harvie Mini" : "Harvie Pro Plus";

  let nota = null;
  if (budgetTag === "budget_alto") {
    nota = "Orçamento relatado (R$1.000+/mês) já se aproxima do plano Business — ICPs de Pro/Business/Enterprise ainda não têm critério validado (ver ICP_e_Personas_Harvie), mas vale considerar porte maior na conversa.";
  } else if (icpBase === "Pro Plus" && budgetTag === "budget_zero") {
    nota = "Perfil aponta pra Pro Plus, mas o orçamento relatado hoje é zero — vale entender o momento antes de levar a conversa de valor.";
  }

  let confianca;
  if (segInfo && segInfo.tier) {
    confianca = segInfo.confirmado
      ? `fit ${segInfo.tier} confirmado pelo lead`
      : `fit ${segInfo.tier} por texto livre — sugestão automática, confirmar`;
  } else {
    confianca = "sem segmento informado — baseado só no branch";
  }

  return { plano, confianca, nota };
}

export function montarResultado(state) {
  const v = calcV(state);
  const c = calcC(state);
  const e = calcE(state);
  const niveis = { V: v, C: c, E: e };
  const fraco = Object.keys(niveis).reduce((a, b) => (niveis[a] <= niveis[b] ? a : b));
  const forte = Object.keys(niveis).reduce((a, b) => (niveis[a] >= niveis[b] ? a : b));
  const achado = state.respostas.find((r) =>
    ["estado_perdido", "estado_urgente", "estado_sem_prioridade", "sem_metrica", "site_desalinhado", "sem_dor_forte"].includes(r.tag)
  );

  const somaBruta = v + c + e; // 0 a 9
  const scoreGeral = Math.round((somaBruta / 9) * 10 * 10) / 10; // 0.0 a 10.0, 1 casa decimal
  const estagio = ESTAGIOS.find((est) => somaBruta <= est.max);

  // Se a tag do achado for uma das ligadas a um pilar (ACHADO_PILAR) e esse
  // pilar for o mais fraco, a citação some do bloco genérico e passa a
  // aparecer dentro do card "Onde você está perdendo oportunidade".
  const achadoPilar = achado ? ACHADO_PILAR[achado.tag] : null;
  const citarNoCardFraco = achadoPilar != null && achadoPilar === fraco;

  const notas = [];
  if (achou(state, "tentativa_frustrada")) notas.push({ texto: NOTAS_TEXTO.tentativa_frustrada });
  if (achou(state, "manutencao_travada")) notas.push({ texto: NOTAS_TEXTO.manutencao_travada });
  if (achou(state, "prova_ausente")) notas.push({ texto: NOTAS_TEXTO.prova_ausente });

  const decisor = state.respostas.find((r) => ["decisor_unico", "decisor_duplo", "decisor_comite"].includes(r.tag));
  const budget = state.respostas.find((r) => r.tag && r.tag.indexOf("budget_") === 0);
  const sugestaoPlano = calcularSugestaoPlano({
    branch: state.branch,
    budgetTag: budget ? budget.tag : null,
    segInfo: state.segInfo,
  });

  const seg = state.segInfo || { nome: "(não informado)" };
  const interno = [
    { label: "Branch:", valor: state.branch },
    { label: "Scores:", valor: "V=" + v + " C=" + c + " E=" + e + " · pilar mais fraco: " + fraco },
    { label: "Sugestão de plano:", valor: sugestaoPlano.plano },
    { label: "Confiança da sugestão:", valor: sugestaoPlano.confianca },
    {
      label: "Cenário de decisor:",
      valor:
        (decisor ? decisor.resposta : "-") +
        (achou(state, "codecisor_influenciador") ? " → ⚠ NÃO é o decisor final. Preparar material de apoio para levar a quem decide." : ""),
    },
    { label: "Segmento informado:", valor: seg.nome },
  ];
  if (sugestaoPlano.nota) {
    interno.push({ label: "Nota sobre o plano:", valor: sugestaoPlano.nota });
  }
  if (seg.tier) {
    const tierLabel = { alto: "🟢 Alto Fit", medio: "🟡 Médio Fit", baixo: "🔴 Baixo Fit" }[seg.tier];
    interno.push({
      label: "Fit de segmento (" + (seg.confirmado ? "selecionado pelo lead" : "sugestão automática, NÃO confirmada") + "):",
      valor: tierLabel + ", ICP " + seg.icp + (seg.sugestaoBaseadaEm ? " · aproximação de: " + seg.sugestaoBaseadaEm : ""),
    });
  } else if (seg.brandSafety) {
    interno.push({
      label: "⚠️ ALERTA DE BRAND SAFETY:",
      valor: "texto livre pode indicar associação com “" + seg.brandSafety + "”. Validar manualmente (hipótese automática).",
    });
  } else {
    interno.push({ label: "Fit de segmento:", valor: "não identificado automaticamente. Validar manualmente." });
  }
  interno.push({ label: "Canais marcados:", valor: state.canaisTags.join(", ") || "-" });

  return {
    pilares: [
      { chave: "V", label: TEXTOS.V.label, pergunta: TEXTOS.V.pergunta, texto: TEXTOS.V[v] },
      { chave: "C", label: TEXTOS.C.label, pergunta: TEXTOS.C.pergunta, texto: TEXTOS.C[c] },
      { chave: "E", label: TEXTOS.E.label, pergunta: TEXTOS.E.pergunta, texto: TEXTOS.E[state.branch][e] },
    ],
    achado: achado ? achado.resposta : "",
    // true quando a citação acima já foi redirecionada pro card do pilar mais
    // fraco — nesse caso o bloco genérico de achado não deve ser exibido.
    citarNoCardFraco,
    temNotas: notas.length > 0,
    notas,
    quickWin: QUICK_WINS[fraco],
    // Label do pilar mais fraco ("Visibilidade"/"Credibilidade"/"Estrutura") —
    // só exposto pra reaproveitar no texto do gate de captura, sem duplicar
    // a conta de `fraco` fora do motor.
    pilarFracoLabel: TEXTOS[fraco].label,
    pilarFracoChave: fraco,
    pilarForteChave: forte,
    // Só false quando os 3 pilares empatam (forte === fraco) — nesse caso o
    // card de ponto forte não deve ser exibido, pra não duplicar o conteúdo
    // do card de ponto fraco.
    mostrarCardForte: forte !== fraco,
    scoreGeral,
    estagio: { nome: estagio.nome, desc: estagio.desc },
    // Nota bruta (0-3) de cada pilar, pra montar as barras de progresso na
    // tela de resultado — a renderização fica por conta do lado de UI.
    scores: { v, c, e },
    interno,
    log: state.respostas,
  };
}

export function numeroETotal(state) {
  if (state.branch === null) return { numero: 1, total: 9 };
  const total = sequencia(state.respostas, state.branch).length + 2;
  const numero = state.step + 2;
  return { numero, total };
}
