// Dados do quiz — portados sem alteração de regras de
// quiz-logic/quiz-harvie-prototipo-v8.html. Ver quiz-logic/quiz-harvie-brief-v8.md
// para o racional por trás de cada pergunta.

export const Q1 = {
  texto: "Hoje, seu negócio...",
  dica: "Escolha a opção mais próxima da realidade.",
  opcoes: [
    { texto: "Ainda não tem site", tag: "sem_site", branch: "A" },
    { texto: "Só tem rede social (Instagram, Linktree, etc.)", tag: "so_rede_social", branch: "A" },
    { texto: "Tem site, mas está desatualizado", tag: "site_desatualizado", branch: "B" },
    { texto: "Tem site no ar e atualizado", tag: "site_ativo", branch: "B" },
  ],
};

export const Q2 = {
  texto: "Como as pessoas te encontram hoje?",
  dica: "Pode marcar mais de uma.",
  tipo: "multi",
  opcoes: [
    { texto: "Indicação, boca a boca", tag: "canal_indicacao" },
    { texto: "Redes sociais", tag: "canal_redes" },
    { texto: "Busca no Google", tag: "canal_busca" },
    { texto: "Anúncios pagos", tag: "canal_ads" },
    { texto: "Não sei dizer", tag: "canal_nao_sabe" },
  ],
};

export const Q3A = {
  texto: "Se alguém te procurasse agora no Google, ia encontrar...",
  dica: "Pense em quem ainda não te conhece.",
  opcoes: [
    { texto: "Nada", tag: "exposicao_nula" },
    { texto: "Só a rede social", tag: "exposicao_rede" },
    { texto: "Alguma coisa desatualizada, de outro lugar", tag: "exposicao_desatualizada" },
    { texto: "Não sei", tag: "exposicao_incerta" },
  ],
};

export const Q3B = {
  texto: "Se esse site saísse do ar amanhã...",
  dica: "Sem meio-termo: qual seria o impacto real?",
  opcoes: [
    { texto: "Não faria diferença, ninguém ia notar", tag: "dependencia_baixa" },
    { texto: "Eu ia sentir falta, mas resolveria rápido", tag: "dependencia_media" },
    { texto: "Seria um problema sério para o negócio", tag: "dependencia_alta" },
  ],
};

export const Q4 = {
  texto: "Quem decide isso no seu negócio?",
  dica: "Sobre investir em presença digital.",
  opcoes: [
    { texto: "Só eu decido", tag: "decisor_unico" },
    { texto: "Eu e mais alguém (sócio, diretoria)", tag: "decisor_duplo" },
    { texto: "Depende da aprovação de mais gente", tag: "decisor_comite" },
  ],
};

export const Q4b = {
  texto: "Nessa decisão, você é...",
  dica: "",
  opcoes: [
    { texto: "Quem decide junto, no mesmo nível", tag: "codecisor_igual" },
    { texto: "Quem propõe, mas quem decide mesmo é a outra pessoa", tag: "codecisor_influenciador" },
  ],
};

export const Q5A = {
  texto: "Qual dessas frases combina mais com você hoje?",
  dica: "",
  opcoes: [
    { texto: "Sei que preciso de algo mais profissional, mas ainda não virou prioridade", tag: "estado_perdido" },
    { texto: "Sinto que a falta de um site já me custou algumas oportunidades", tag: "estado_urgente" },
    { texto: "Nunca parei para pensar em ter um site, mas sei que preciso", tag: "estado_sem_prioridade" },
  ],
};

export const Q5bA = {
  texto: "Você já tentou ter um site antes?",
  dica: "",
  opcoes: [
    { texto: "Não, seria a primeira vez", tag: "tentativa_nao" },
    { texto: "Sim, mas não deu certo (freelancer, plataforma grátis, etc.)", tag: "tentativa_frustrada" },
  ],
};

export const Q5B = {
  texto: "Qual é a sua maior dificuldade hoje?",
  dica: "",
  opcoes: [
    { texto: "Qualquer mudança demora muito ou sai muito caro", tag: "manutencao_travada" },
    { texto: "Não sei se o site está trazendo algum resultado", tag: "sem_metrica" },
    { texto: "O site não reflete o que é o meu negócio hoje", tag: "site_desalinhado" },
    { texto: "Nada me incomoda muito, só queria melhorar", tag: "sem_dor_forte" },
  ],
};

export const Q6 = {
  texto: "Quanto você investe hoje em marketing ou presença digital?",
  dica: "Somando tudo, por mês.",
  opcoes: [
    { texto: "Nada ainda", tag: "budget_zero" },
    { texto: "Até R$ 300/mês", tag: "budget_baixo" },
    { texto: "De R$ 300 a R$ 1.000/mês", tag: "budget_medio" },
    { texto: "Mais de R$ 1.000/mês", tag: "budget_alto" },
  ],
};

export const QProva = {
  texto: "Quem procura por você hoje encontra provas reais do seu trabalho?",
  dica: "Depoimentos, avaliações, fotos de resultado, cases.",
  opcoes: [
    { texto: "Sim, encontra bastante e de forma fácil", tag: "prova_forte" },
    { texto: "É um pouco difícil, pois as provas estão espalhadas, mas consegue encontrar", tag: "prova_fraca" },
    { texto: "Não, pois não existe quase nada hoje na internet", tag: "prova_ausente" },
  ],
};

export const SEG_MINI = {
  alto: [
    "Psicólogos e terapeutas autônomos",
    "Fotógrafos freelance",
    "Tradutores e intérpretes",
    "Consultores autônomos (ambiental, RH, editorial)",
    "Advogados autônomos (caso individual)",
    "Designers de interiores autônomos",
    "Personal trainers (consultoria/programa online)",
    "Coaches executivos de ticket alto",
  ],
  medio: [
    "Personal trainers (presencial local)",
    "Nutricionistas (clínica geral local)",
    "Nutricionistas (esportiva/funcional, programas pagos)",
    "Coaches de vida/carreira genéricos",
    "Professores particulares (idiomas, música, reforço)",
    "Contadores autônomos (pequeno volume)",
    "Cabeleireiros/barbeiros com marca pessoal",
    "Celebrantes de casamento / wedding planners freelance",
    "Ilustradores, artistas plásticos, músicos solo",
    "Tatuadores autônomos",
    "Confeiteiras/personal chefs (bolos/eventos sob encomenda)",
  ],
  baixo: [
    "Esteticistas independentes",
    "Maquiadores freelance",
    "Instrutores de yoga/pilates autônomos",
    "Consultores de imagem/personal stylists",
    "Confeiteiras/personal chefs (entrega do dia a dia)",
  ],
};

export const SEG_PRO = {
  alto: [
    "Escritórios de advocacia (múltiplos sócios)",
    "Empresas de terceirização/facilities",
    "Incorporadoras",
    "Clínicas odontológicas",
    "Contabilidade/consultoria empresarial para PMEs",
    "Clínicas/hospitais veterinários especializados",
    "Imobiliárias de alto padrão/rural/comercial",
  ],
  medio: [
    "Clínicas médicas multiespecialidade",
    "Clínicas de estética avançada",
    "Escolas de idiomas",
    "Cursos preparatórios/concursos",
    "Escolas técnicas",
    "Consultorias de RH/recrutamento executivo",
    "Escritórios de arquitetura",
    "Imobiliárias residenciais genéricas",
  ],
  baixo: [
    "Clínicas/consultórios veterinários de rotina",
    "Consultorias de gestão/ESG",
    "Empresas de logística regional",
    "Palestrantes/autores com múltiplos produtos",
    "Criadores de conteúdo com produtos próprios",
  ],
};

export const BRAND_SAFETY = {
  "Conteúdo adulto ou sexual explícito": ["pornografia", "conteudo adulto", "acompanhantes", "sexo explicito"],
  "Apostas e jogos não regulamentados": ["aposta esportiva", "apostas esportivas", "casa de apostas", "cassino online", "jogo do bicho"],
  "Esquema de pirâmide ou MLM sem registro": ["piramide", "marketing multinivel", "recrutamento de downline"],
  "Promessa de retorno financeiro garantido": ["retorno garantido", "lucro garantido", "rentabilidade garantida", "investimento sem risco"],
  "Conteúdo político-partidário ou extremista": ["campanha eleitoral", "partido politico", "candidato a"],
};

export const STOPWORDS = new Set([
  "freelance", "freelancer", "online", "local", "locais", "geral", "gerais", "autonomo", "autonomos",
  "autonoma", "autonomas", "servico", "servicos", "programa", "programas", "curso", "cursos", "empresa",
  "empresas", "consultoria", "consultorias", "negocio", "negocios", "clinica", "clinicas", "consultorio", "consultorios",
  "pequeno", "pequena", "pequenos", "pequenas", "grande", "grandes", "multiplo", "multiplos", "multipla", "multiplas",
  "independente", "independentes", "profissional", "profissionais", "marca", "pessoal", "pessoais",
  "ticket", "volume", "modelo", "dia", "dias", "varias", "varios", "especialidades", "especialidade",
  "consultor", "consultora", "consultores", "consultoras", "residencial", "residenciais", "comercial", "comerciais",
  "padrao", "rural", "rurais",
]);

export const SINONIMOS = {
  "Clínicas odontológicas": ["dentista", "dentistas", "odonto"],
  "Contabilidade/consultoria empresarial para PMEs": ["contador", "contadora", "contabil"],
};

export const TEXTOS = {
  V: {
    label: "Visibilidade",
    pergunta: "te acham fácil?",
    0: "Hoje, quase ninguém novo chega até você sozinho. Tudo depende de alguém te indicar diretamente.",
    1: "Você aparece um pouco, mas quem procura por você pode não te achar.",
    2: "Você já é encontrado por mais de um canal, mas ainda dá para ampliar onde aparece.",
    3: "Você é encontrado de forma consistente, inclusive por busca ativa. Isso é raro e vale muito.",
  },
  C: {
    label: "Credibilidade",
    pergunta: "quando acham, confiam?",
    0: "O pouco que existe hoje não é suficiente para alguém confiar no seu trabalho antes de te conhecer pessoalmente.",
    1: "Existe algo, mas ainda passa uma impressão amadora ou desatualizada.",
    2: "O que existe já transmite alguma seriedade, mas ainda não está totalmente alinhado com o que você entrega hoje.",
    3: "O que existe hoje reflete bem quem você é. Isso facilita a decisão de quem está pensando em confiar no seu trabalho.",
  },
  E: {
    label: "Estrutura",
    pergunta: "isso é sustentável?",
    A: {
      0: "Hoje não existe orçamento nem uma forma rápida de decidir sobre presença digital. Faz sentido, já que isso nunca chegou a virar prioridade formal no seu negócio.",
      1: "Você já tem um começo de orçamento ou de agilidade para decidir, mas não os dois juntos ainda. Isso não é suficiente para dar o primeiro passo com segurança.",
      2: "Você já tem orçamento e uma forma clara de decidir. Dá para dar esse primeiro passo sem depender de um momento perfeito.",
      3: "Presença digital já é tratada como prioridade real no seu negócio, com orçamento e decisão organizados. O que falta agora é dar o primeiro passo, não se preparar para ele.",
    },
    B: {
      0: "Hoje não há orçamento nem decisão rápida disponíveis para sustentar o site que você já tem. Nesse ponto, manter as coisas como estão já é mais difícil do que parece.",
      1: "Você já tem um pouco de orçamento ou de agilidade para decidir, mas não os dois juntos. O que existe hoje não é suficiente para manter o site atualizado de forma constante.",
      2: "Você já tem orçamento e uma forma clara de decidir. Dá para sustentar o site de forma previsível, mesmo que ainda valha revisar como isso é feito hoje.",
      3: "Presença digital já é tratada como parte do negócio, com investimento e decisão organizados. O que falta é otimizar o que já existe, não recomeçar do zero.",
    },
  },
};

export const QUICK_WINS = {
  V: "Cadastre (ou atualize) seu Google Meu Negócio ainda essa semana. É gratuito e é o jeito mais rápido de aparecer para quem busca por você.",
  C: "Escolha 3 fotos ou informações que mostrem seu trabalho de verdade (não genéricas) e garanta que estejam nos canais que você já usa.",
  E: "Escreva num papel: “o que acontece se eu parar de cuidar disso por 3 meses?” Se a resposta te preocupa, isso já é sinal de prioridade.",
};

export const DOT_CORES = ["#FF8A00", "#E5709C", "#D25C9C", "#6B7DE5"];

export const NOTAS_TEXTO = {
  tentativa_frustrada:
    "Você já tentou ter um site antes e não deu certo. Isso acontece mais do que parece: às vezes é o freelancer que some no meio do caminho, o valor que muda depois que o projeto já começou, ou uma plataforma grátis que não aguenta quando o negócio cresce. Quando o site não é feito e cuidado por alguém profissional, fica difícil garantir que ele continue seguro, atualizado e no ar sem interrupções, e é isso que costuma pesar mais lá na frente.",
  manutencao_travada:
    "Você mencionou que qualquer alteração no site demora ou custa caro. Isso é comum em sites feitos como um projeto pontual, sem manutenção contínua incluída. Não é um problema seu, é um problema do modelo.",
  prova_ausente:
    "Hoje quase não existe prova real do seu trabalho visível para quem ainda não te conhece. Isso pesa na hora de alguém decidir confiar em você antes do primeiro contato, às vezes até mais do que o site em si.",
};
