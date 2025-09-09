
(() => {
  const s = document.currentScript;

  // 1) Parámetros (data-*) desde la etiqueta <script>
  const rawPhone = (s.dataset.phone || "").replace(/\D/g, "");  // solo dígitos
  if (!rawPhone) return; // sin teléfono, no hacemos nada

  const text = s.dataset.text || "";
  const bottom = s.dataset.bottom || "40px";
  const right  = s.dataset.right  || "40px";
  const left   = s.dataset.left   || "";      // opcional, para pegarlo a la izquierda
  const aria   = s.dataset.ariaLabel || "Abrir chat de WhatsApp";
  const size   = parseInt(s.dataset.size || "60", 10); // px
  const z      = s.dataset.zIndex || "1000";
  const url = `https://wa.me/${rawPhone}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  // 2) Estilos (inyectamos una sola vez)
  const style = document.createElement("style");
  style.textContent = `
  .wa-fab{position:fixed;width:${size}px;height:${size}px;bottom:${bottom};
    ${left ? `left:${left};` : `right:${right};`}
    background:#25d366;color:#fff;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:${Math.round(size*0.5)}px;z-index:${z};
    box-shadow:0 8px 24px rgba(0,0,0,.2);text-decoration:none;
    transition:transform .15s ease, box-shadow .15s ease}
  .wa-fab:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.28)}
  .wa-fab:active{transform:translateY(0)}
  @media (prefers-reduced-motion: reduce){.wa-fab{transition:none}}
  @media print {.wa-fab{display:none}}
  `;
  document.head.appendChild(style);

  // 3) Botón (usamos SVG, no dependes de Font Awesome)
  const a = document.createElement("a");
  a.href = url;
  a.className = "wa-fab";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", aria);
  a.innerHTML = `
   <svg aria-hidden="true" viewBox="0 0 32 32" width="${Math.round(size*0.47)}" height="${Math.round(size*0.47)}">
  <path transform="translate(${(2*32)/Math.round(size*0.47)} 0)" fill="currentColor" d="M19.11 17.01c-.33-.16-1.92-.95-2.22-1.06-.3-.11-.52-.16-.74.16-.22.33-.85 1.06-1.04 1.28-.19.22-.38.24-.71.08-.33-.16-1.39-.51-2.65-1.62-.98-.86-1.64-1.92-1.83-2.24-.19-.33-.02-.5.14-.66.14-.14.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.74-1.79-1.02-2.44-.27-.65-.54-.56-.74-.57l-.63-.01c-.22 0-.57.08-.87.41-.3.33-1.14 1.12-1.14 2.73 0 1.61 1.17 3.16 1.34 3.38.16.22 2.3 3.51 5.56 4.92.78.34 1.39.54 1.86.69.78.25 1.49.22 2.05.13.62-.09 1.92-.78 2.19-1.53.27-.75.27-1.39.19-1.53-.08-.14-.3-.22-.63-.38z"/>
  <path fill="currentColor" d="M26.91 5.09C24.1 2.27 20.31.8 16.33.8 8.59.8 2.3 7.09 2.3 14.83c0 2.49.65 4.92 1.88 7.07L2 30l8.27-2.16c2.07 1.13 4.4 1.73 6.77 1.73h0c7.74 0 14.03-6.29 14.03-14.03 0-3.99-1.47-7.77-4.29-10.58zM16.04 27.08h0c-2.17 0-4.28-.58-6.13-1.68l-.44-.26-4.91 1.28 1.31-4.79-.29-.49c-1.16-1.93-1.77-4.14-1.77-6.4 0-6.87 5.59-12.46 12.46-12.46 3.33 0 6.47 1.3 8.83 3.66 2.36 2.36 3.66 5.5 3.66 8.83 0 6.87-5.59 12.46-12.46 12.46z"/>
</svg>

  `;
  document.body.appendChild(a);
})();
