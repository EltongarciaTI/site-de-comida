/* ================================================================
   MENU.JS — Lógica do cardápio
   ================================================================ */

let activeCat   = "all";
let searchQuery = "";

// Header
document.getElementById("hLogoIcon").textContent = CONFIG.emoji;
document.getElementById("hLogoName").innerHTML   =
  CONFIG.nome.split(" ")[0] + `<span class="logo-accent"> ${CONFIG.nome.split(" ").slice(1).join(" ")}</span>`;
document.getElementById("footerWpp").href = `https://wa.me/${CONFIG.whatsapp}`;

// ===== CATEGORIAS =====
function renderCats() {
  const container = document.getElementById("catList");
  container.innerHTML = CATEGORIAS.map(c => `
    <button class="cat-btn ${c.id === activeCat ? "active" : ""}" data-cat="${c.id}">
      <span>${c.icon}</span> ${c.label}
    </button>
  `).join("");

  container.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCat = btn.dataset.cat;
      renderCats();
      renderProducts();
    });
  });
}

// ===== CARD DE PRODUTO =====
function buildCard(product, delay = 0) {
  const card = document.createElement("a");
  card.className = "product-card fade-up";
  card.href      = `produto.html?id=${product.id}`;
  card.style.animationDelay = `${delay}s`;

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
          ${product.temTamanho ? `<span class="product-card__from">A partir de</span>` : ""}
          <span class="product-card__price-val">${formatBRL(product.preco)}</span>
        </div>
        <button class="add-btn" onclick="event.preventDefault(); event.stopPropagation(); addItem(${product.id})" aria-label="Adicionar">+</button>
      </div>
    </div>
  `;
  return card;
}

// ===== PRODUTOS =====
function renderProducts() {
  const grid  = document.getElementById("productsGrid");
  const empty = document.getElementById("emptyState");
  const products = DB.getProducts();

  let filtered = products;
  if (activeCat !== "all") filtered = filtered.filter(p => p.cat === activeCat);
  if (searchQuery)         filtered = filtered.filter(p =>
    p.nome.toLowerCase().includes(searchQuery) ||
    p.desc.toLowerCase().includes(searchQuery)
  );

  grid.innerHTML = "";

  if (filtered.length === 0) {
    empty.style.display = "flex";
  } else {
    empty.style.display = "none";
    filtered.forEach((p, i) => grid.appendChild(buildCard(p, i * 0.05)));
  }

  updateFloat();
}

// ===== ADICIONAR =====
function addItem(id) {
  const products = DB.getProducts();
  const product  = products.find(p => p.id === id);
  if (!product) return;

  if (product.temTamanho || product.temBorda) {
    // Redireciona para página de produto para escolher opções
    window.location.href = `produto.html?id=${id}`;
    return;
  }

  Cart.add(id, { tamanho: "u", tamanhoMult: 1, tamanhoLabel: "Único" });
  showToast(`✅ ${product.nome} adicionado!`);
}

// ===== FLOAT BAR =====
function updateFloat() {
  const bar    = document.getElementById("floatBar");
  const qty    = Cart.totalQty();
  const price  = Cart.totalPrice();
  bar.style.display = qty > 0 ? "block" : "none";
  document.getElementById("floatCount").textContent = `${qty} ${qty === 1 ? "item" : "itens"}`;
  document.getElementById("floatPrice").textContent = formatBRL(price);
}

window.addEventListener("cartUpdate", updateFloat);

// ===== BUSCA =====
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.toLowerCase().trim();
  searchClear.style.display = searchQuery ? "block" : "none";
  renderProducts();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  searchClear.style.display = "none";
  searchInput.focus();
  renderProducts();
});

// ===== INIT =====
renderCats();
renderProducts();
