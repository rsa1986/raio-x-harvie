// Texto do prompt usado pra gerar o relatório "Raio-X" completo, isolado aqui
// pra quem for ajustar a redação não precisar mexer na lógica de envio de
// e-mail (api/lead-completo.js).
export function montarPromptRelatorio({ nome, branch, canal, blocoInterno, respostasCompletas }) {
  const linhaCanal = branch === "B" ? `URL do site: ${canal}` : `Instagram/Linktree: ${canal}`;

  return `Você vai gerar um relatório "Raio-X", já pronto pra envio a um lead real — sem nenhuma menção a ferramenta, agente, tempo gasto ou processo de coleta (só a nota final de transparência).

Dados de entrada:
- Nome do lead/negócio: ${nome}
- Branch: ${branch}
- ${linhaCanal}
- Bloco de respostas do quiz (contexto interno — nunca citar literalmente no relatório final):
${blocoInterno}

Respostas completas do quiz, pra contexto adicional:
${respostasCompletas}

Levantamento a fazer:
- Se Branch B: sitemap.xml, robots.txt (aponta pro sitemap certo?), tamanho da imagem de compartilhamento social (ideal 1200x630), texto alternativo em imagens-chave, Core Web Vitals via Google PageSpeed Insights (mobile e desktop).
- Se Branch A: navegar de verdade pelo Instagram informado, mais Facebook, Google Meu Negócio e Linktree se existirem — completude do perfil, prova social visível (onde está, de quando é), consistência de conteúdo (data e frequência dos últimos posts), encontrabilidade no Google buscando nome + profissão + cidade.

Como usar o bloco do quiz: só pra calibrar prioridade e tom internamente. O relatório nunca deve mencionar orçamento, fit de segmento, cenário de decisor ou qualquer dado que só existe porque veio do quiz — só o que é publicamente observável por qualquer visitante.

Formato final, seguir exatamente:
- Cabeçalho com logo Coopers + etiqueta "RAIO-X DE ${branch === "B" ? "SITE" : "PRESENÇA DIGITAL"} · DIAGNÓSTICO TÉCNICO"
- Título "Raio-X de ${branch === "B" ? "Site" : "Presença Digital"}: ${nome}"
- Linha de identificação: "${canal} · Análise realizada em [data]"
- Caixa-resumo com o veredito geral (tom fiel ao nível real encontrado)
- // 01 Visão geral
- "O que já está bem feito" — lista com marcadores, só itens genuinamente positivos e verificados
- // 0X [achado numerado] — um por achado real, cada um com título específico, explicação simples, analogia curta, e por que importa
- Se houver dado tabular relevante: seção numerada própria com a tabela
- // 0X Resumo do que fazer primeiro — "Resolve rápido e traz retorno logo" + "Importante, mas com mais trabalho", listas numeradas
- Rodapé "Sobre esta análise": nota curta e transparente sobre a fonte pública e a data
- Tagline final: "FAST. FLEXIBLE. TRUSTFUL."

Regras de segurança: se aparecer qualquer sinal de brand safety que o quiz não tenha pego, pare e sinalize isso separadamente antes do relatório, para validação humana. Não invente dado que não conseguiu confirmar.`;
}
