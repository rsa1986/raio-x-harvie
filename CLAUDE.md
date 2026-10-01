# Projeto: Raio-X da presença digital (Harvie / Coopers Digital)

## O que já existe

Este projeto veio de duas fontes que ainda **não foram fundidas**:

1. **`design/Raio-X Harvie.dc.html`** — a landing page com a identidade visual pronta,
   exportada do Claude Design. Ela roda com o runtime `design/support.js` (que carrega
   React, ReactDOM e Babel via CDN em tempo de execução) e usa placeholders de template
   como `{{ harvieUrl }}` que ainda não foram resolvidos. Esse formato `.dc.html` é
   específico do Claude Design — não é HTML/React puro.
2. **`quiz-logic/quiz-harvie-prototipo-v8.html`** — a versão "only-logic" do quiz:
   todo o fluxo de perguntas, ramificação (Branch A/B) e motor de pontuação dos 3
   pilares (Visibilidade, Credibilidade, Estrutura) já estão prontos e testados,
   mas sem nenhum estilo visual.
3. **`quiz-logic/quiz-harvie-brief-v8.md`** — o brief completo do produto: objetivo,
   fluxo, ICPs, e decisões em aberto (gate de captura de contato ainda não
   posicionado no fluxo, calibração da heurística de plano, integração com CRM).

## O que precisa ser feito

Transformar isso num projeto web único, funcional e fácil de manter — por exemplo
um site estático simples (HTML/CSS/JS) ou um projeto Vite + React, o que fizer
mais sentido dado o restante do código. Isso envolve:

- Extrair a identidade visual e o layout de `design/Raio-X Harvie.dc.html` (cores,
  tipografia, espaçamento, imagens em `design/assets/`) e recriá-la como
  HTML/CSS/JS ou componentes React padrão, sem depender do runtime do Claude Design.
- Portar a lógica do quiz de `quiz-logic/quiz-harvie-prototipo-v8.html` para dentro
  dessa landing page com o visual aplicado.
- Resolver os placeholders de template (ex.: `{{ harvieUrl }}`) com valores reais
  ou variáveis de ambiente/configuração.
- Manter o site rodável localmente com um comando simples (`npm run dev` ou
  servidor estático) para facilitar iteração.

Leia `quiz-logic/quiz-harvie-brief-v8.md` inteiro antes de mexer na lógica do quiz —
ele explica decisões de produto (por que certas perguntas existem, o que é o
"bloco de uso interno" que não deve aparecer pro lead, etc.) que não estão óbvias
só olhando o código.
