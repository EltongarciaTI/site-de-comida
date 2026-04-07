/* ================================================================
   HOME.JS — Lógica da página inicial
   ================================================================ */

function buildProductCard(product) {
  const card = document.createElement("a");
  card.className = "product-card fade-up";
  card.href      = `produto.html?id=${product.id}`;

  card.innerHTML = `
    <div class="product-card__img-wrap">
      <div class="product-card__img-bg" style="background:${product.gradiente}"></div>
      <img class="product-card__img" src="${product.img}" alt="${product.nome}" onerror="this.style.display='none'" loading="lazy" />
      ${product.badge ? `<span class="product-card__badge badge--${product.badge}">${product.badgeTexto}</span>` : ""}
    </div>
    <div class="product-card__info">
      <div class="product-card__name">${product.nome}</div>
      <div class="product-card__desc">${product.desc}</div>
      <div class="product-card__bottom">
        <div class="product-card__price">
          ${product.precoOld ? `<span class="product-card__price-old">${formatBRL(product.precoOld)}</span>` : ""}
          <span class="product-card__from">A partir de</span>
          <span class="product-card__price-val">${formatBRL(product.preco)}</span>
        </div>
        <button class="add-btn" onclick="event.preventDefault(); event.stopPropagation(); quickAdd(${product.id})" aria-label="Adicionar ao carrinho">+</button>
      </div>
    </div>
  `;
  return card;
}

function quickAdd(id) {
  Cart.add(id, { tamanho: "m", tamanhoMult: 1, tamanhoLabel: "Média" });
  const p = DB.getProducts().find(p => p.id === id);
  if (p) showToast(`🍕 ${p.nome} adicionado!`);
}

function renderHome() {
  // Header
  document.getElementById("hLogoIcon").textContent = CONFIG.emoji;
  document.getElementById("hLogoName").innerHTML   =
    CONFIG.nome.split(" ")[0] + `<span class="logo-accent"> ${CONFIG.nome.split(" ").slice(1).join(" ")}</span>`;

  // Hero
  document.getElementById("heroBadge").innerHTML =
    `<span>🔥</span> Aberto agora · ${CONFIG.tempoEntrega}`;
  document.getElementById("heroTitle").innerHTML =
    `<span>${CONFIG.nome.split(" ")[0]}</span> ${CONFIG.nome.split(" ").slice(1).join(" ")}<br><span style="color:var(--white)">&</span> mais sabores`;
  document.getElementById("heroSub").textContent = CONFIG.descricao;
  document.getElementById("heroWpp").href = `https://wa.me/${CONFIG.whatsapp}`;

  // Estatísticas
  document.getElementById("heroStats").innerHTML = `
    <div class="hero__stat"><strong>${CONFIG.avaliacao} ⭐</strong><span>${CONFIG.totalAvaliacoes} avaliações</span></div>
    <div class="hero__stat"><strong>${CONFIG.totalPedidos}</strong><span>pedidos entregues</span></div>
    <div class="hero__stat"><strong>${CONFIG.tempoEntrega}</strong><span>tempo médio</span></div>
  `;

  // Pizza art
  const art = document.getElementById("heroPizzaArt");
  const produtos = DB.getProducts();
  const primeiro = produtos[0];
  if (primeiro) {
    art.style.background = primeiro.gradiente;
    art.innerHTML = `<img src="${primeiro.img}" alt="${primeiro.nome}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
  }

  // Promos
  document.getElementById("promoList").innerHTML = CONFIG.promos.map(p => `
    <div class="promo-card promo-card--${p.cor}">
      <span class="promo-tag">${p.tag}</span>
      <p>${p.texto}</p>
    </div>
  `).join("");

  // Destaques
  const grid = document.getElementById("highlightsGrid");
  produtos.filter(p => p.destaque).forEach((p, i) => {
    const card = buildProductCard(p);
    card.style.animationDelay = `${i * 0.07}s`;
    grid.appendChild(card);
  });

  // Reviews
  document.getElementById("reviewsSubtitle").textContent =
    `${CONFIG.avaliacao} de 5 estrelas · ${CONFIG.totalAvaliacoes} avaliações verificadas`;

  document.getElementById("reviewsList").innerHTML = CONFIG.reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${"⭐".repeat(r.estrelas)}</div>
      <p class="review-text">"${r.texto}"</p>
      <div class="review-author">
        <div class="review-avatar" style="background:${r.cor}">${r.inicial}</div>
        <div>
          <div class="review-name">${r.nome}</div>
          <div class="review-tag">Cliente verificado</div>
        </div>
      </div>
    </div>
  `).join("");

  // CTA + Footer WPP
  document.getElementById("ctaWpp").href = `https://wa.me/${CONFIG.whatsapp}`;
  document.getElementById("fWpp").href   = `https://wa.me/${CONFIG.whatsapp}`;
  document.getElementById("fInsta").href = `https://instagram.com/${CONFIG.instagram?.replace("@", "")}`;

  // Footer
  document.getElementById("fLogoIcon").textContent = CONFIG.emoji;
  document.getElementById("fLogoName").innerHTML   =
    CONFIG.nome.split(" ")[0] + `<span class="footer__logo-accent"> ${CONFIG.nome.split(" ").slice(1).join(" ")}</span>`;
  document.getElementById("fTagline").textContent  = CONFIG.descricao;
  document.getElementById("fHours").innerHTML      = CONFIG.horarios.map(h =>
    `<div class="footer__hour"><span>${h.dias}</span><span>${h.hora}</span></div>`
  ).join("");
  document.getElementById("fEndereco").innerHTML   =
    `${CONFIG.endereco}<br>${CONFIG.bairro} · ${CONFIG.cidade}<br>CEP ${CONFIG.cep}`;
  document.getElementById("fCopy").textContent     =
    `© ${new Date().getFullYear()} ${CONFIG.nome}. Todos os direitos reservados.`;

  // Header sombra no scroll
  window.addEventListener("scroll", () => {
    document.getElementById("header").style.borderBottomColor =
      window.scrollY > 10 ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.08)";
  });
}

renderHome();
