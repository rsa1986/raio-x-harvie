# Raio-X da sua presença digital — brief do diagnóstico Harvie

## O que é

Um quiz de diagnóstico interativo, com lógica de ramificação e pontuação por regras, que avalia a presença digital de um profissional ou negócio em 3 pilares — **Visibilidade** (te acham fácil?), **Credibilidade** (quando acham, confiam?) e **Estrutura** (isso é sustentável?) — e devolve um resultado gratuito, específico e imediato, sem pedir contato antes de entregar valor.

O arquivo `quiz-harvie-prototipo-v8.html` é a versão **only-logic**: todo o fluxo, as perguntas, o motor de pontuação e os textos de resultado já estão prontos e testados. Não tem nenhuma identidade visual, layout ou responsividade — isso é o que vem a seguir.

## Objetivo

Gerar e qualificar leads para o **Harvie**, o produto de site por assinatura da Coopers Digital. Hoje 100% da aquisição de cliente da Coopers vem de indicação; este quiz é a primeira peça de geração de demanda ativa da marca.

Ele também alimenta o time comercial: o bloco de resultado (não visível ao lead) vira, na prática, o campo **"achado manual"** que os scripts de outbound hoje preenchem à mão — cada resposta do próprio lead já chega pronta pra virar munição de abordagem personalizada.

O modelo segue a lição de dois benchmarks estudados: **nunca** prometer resultado imediato e travar tudo atrás de formulário (erro do quiz "Raio-X do Patrocínio" da Soul Brasil), e entregar algo real **antes** de qualquer gate de contato, no espírito do HubSpot Website Grader.

## Como funciona (fluxo resumido)

1. **Pergunta raiz** — "Hoje, seu negócio..." separa quem não tem site (Branch A, perfil autônomo tipo Harvie Mini) de quem já tem site (Branch B, perfil de negócio estabelecido tipo Harvie Pro Plus). As perguntas seguintes mudam de texto conforme o branch.
2. **6 a 7 perguntas de single-select com avanço automático** + **1 pergunta multi-select** (canais de aquisição) — rápido, sem fricção.
3. Uma **sub-pergunta condicional** aparece só se a decisão envolver mais de uma pessoa, pra identificar se o lead é o decisor final ou só um "porta de entrada".
4. **Campo final opcional**: segmento de atuação, via lista de segmentos reais da Coopers + opção "Outro" com texto livre.
5. **Resultado**: os 3 pilares com indicador visual (●●○○) e texto específico por nível, o ponto que o próprio lead indicou, até 3 notas de insight condicionais, e um próximo passo grátis (uma ação prática que a pessoa pode fazer sozinha, sem custo).
6. **Bloco de uso interno** (nunca aparece pro lead): branch, os 3 scores brutos, sugestão de plano, cenário de decisor, fit de segmento (Alto/Médio/Baixo, contra a base real de segmentos da Coopers) e um alerta de brand safety quando aplicável.

## Onde e como será usado

Landing page própria, em domínio do Harvie — algo como `harvie.coopers.digital/raio-x`. Self-service, sem login, pensado pra ser compartilhado como isca (redes sociais, outbound, indicação). O gate de captura de contato (nome/e-mail/WhatsApp) ainda **não foi posicionado no fluxo** — essa decisão fica pra depois da parte visual, seguindo o modelo de dois estágios (valor grátis primeiro, contato só para algo a mais).

## Para quem é

Os dois ICPs já mapeados da Coopers se encaixam diretamente nos dois branches:
- **Branch A / Harvie Mini** — profissional liberal ou autônomo, decide sozinho, nunca teve site (ex.: psicólogos, fotógrafos, consultores autônomos).
- **Branch B / Harvie Pro Plus** — negócio já estabelecido com site desatualizado ou mal aproveitado, ciclo de decisão mais longo (ex.: clínicas odontológicas, escritórios de advocacia).

O mesmo fluxo atende os dois — a pessoa nunca escolhe "qual plano acha que precisa"; isso é decisão interna do comercial, depois, olhando o resultado.

## Sobre o nome — "Raio-X da sua presença digital"

Funciona bem. É direto, usa uma metáfora já familiar no mercado brasileiro de quizzes de diagnóstico (inclusive é a mesma lógica de nome do benchmark que inspirou o formato), e "presença digital" descreve com precisão o que os 3 pilares somados realmente medem — não é só "site", é visibilidade + confiança + sustentabilidade somadas. Como headline de landing page, sugiro manter esse nome principal e reservar um subtítulo curto pra dar um gostinho dos 3 pilares (algo como "descubra se te acham, se confiam em você, e se isso é sustentável" — só ideia de direção, não texto fechado).

## O que ainda está em aberto (fora do escopo deste protótipo)

- Onde exatamente entra o gate de captura de contato
- Identidade visual e responsividade (é o próximo passo)
- Calibração fina da heurística de sugestão de plano (hoje é só branch + orçamento)
- Integração de fato com CRM / scripts de outbound existentes
