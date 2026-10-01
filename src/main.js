import "./app.js";

// Spotlight de grade na página inteira: acompanha o mouse via
// requestAnimationFrame, atualizando --mx/--my (consumidos pelo
// radial-gradient em .page-grid-bg__spotlight). A camada é `position: fixed`
// (presa à viewport, não ao documento), então clientX/clientY já são a
// posição certa em qualquer altura de scroll — sem precisar de
// getBoundingClientRect.
const gridGlow = document.querySelector("[data-grid-glow]");

if (gridGlow && !window.matchMedia("(pointer: coarse)").matches) {
  let rafId = null;

  const moveGlow = (x, y) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      gridGlow.style.setProperty("--mx", `${x}px`);
      gridGlow.style.setProperty("--my", `${y}px`);
      rafId = null;
    });
  };

  document.addEventListener("mousemove", (e) => {
    moveGlow(e.clientX, e.clientY);
    gridGlow.classList.add("page-grid-bg__spotlight--active");
  });
}

// Anel de gradiente que acompanha o ângulo do mouse em volta dos cards
// .glow-card, replicando o hover dos boxes de feature do site institucional.
// --start guarda o ângulo (graus) do cursor em relação ao centro do card,
// consumido pelo conic-gradient em .glow-card::before. Delegado no document
// (em vez de um listener por card) porque alguns .glow-card só existem depois
// de um re-render do quiz (ex.: os cards de destaque do resultado), então um
// querySelectorAll rodado uma vez no carregamento da página não os alcançaria.
if (!window.matchMedia("(pointer: coarse)").matches) {
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".glow-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
    card.style.setProperty("--start", angle + 60);
  });
}
