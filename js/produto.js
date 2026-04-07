/* ================================================================
   PRODUTO.JS — Lógica da página de produto
   ================================================================ */

// Header
document.getElementById("hLogoIcon").textContent = CONFIG.emoji;
document.getElementById("hLogoName").innerHTML   =
  CONFIG.nome.split(" ")[0] + `<span class="logo-accent"> ${CONFIG.nome.split(" ").slice(1).join(" ")}</span>`;

// Estado da seleção
let state = {
  product:       null,
  tamanho:       "m",
  tamanhoMult:   1,
  tamanhoLabel:  "Média",
  bordaId:       "sem_borda",
  bordaPreco:    0,
  bordaLabel:    "Sem borda recheada",
  adicionais:    [],     // ids selecionados
  qty:           1,
};

// ===== CARREGAR PRODUTO =====
function init() {
  const params  = new URLSearchParams(location.search);
  const id      = parseInt(params.get("id"));
  const products = DB.getProducts();
  const product  = products.find(p => p.id === id);

  if (!product) {
    document.getElementById("produtoPage").style.display = "none";
    document.getElementById("notFound").style.display    = "flex";
    return;
  }

  state.product = product;

  // Foto / arte
  const imgEl = document.getElementById("produtoImg");
  imgEl.style.background = product.gradiente;
  imgEl.innerHTML = `<img src="${product.img}" alt="${product.nome}"
    style="width:100%;height:100%;object-fit:cover"
    onerror="this.style.display='none'" loading="eager" />`;

  // Título
  document.title = `${product.nome} — ${CONFIG.nome}`;

  // Badge
  if (product.badge) {
    document.getElementById("produtoBadges").innerHTML =
      `<span class="produto-info__badge badge--${product.badge}">${product.badgeTexto}</span>`;
  }

  document.getElementById("produtoNome").textContent = product.nome;
  document.getElementById("produtoDesc").textContent = product.desc;

  // Tamanho
  if (product.temTamanho) {
    document.getElementById("sectionTamanho").style.display = "block";
    renderSizes();
  }

  // Borda
  if (product.temBorda) {
    document.getElementById("sectionBorda").style.display = "block";
    renderBordas();
  }

  // Adicionais
  renderAdicionais();

  // Obs
  const obsField = document.getElementById("obsField");
  const obsCount = document.getElementById("obsCount");
  obsField.addEventListener("input", () => {
    obsCount.textContent = obsField.value.length;
  });

  // Quantidade
  document.getElementById("qtyMinus").addEventListener("click", () => {
    if (state.qty > 1) { state.qty--; updateQtyUI(); }
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    if (state.qty < 20) { state.qty++; updateQtyUI(); }
  });

  // Adicionar ao carrinho
  document.getElementById("btnAddCart").addEventListener("click", addToCart);

  updatePrice();
}

// ===== TAMANHOS =====
function renderSizes() {
  const grid = document.getElementById("sizeGrid");
  grid.innerHTML = TAMANHOS.map(t => {
    const preco = state.product.preco * t.mult;
    return `
      <button class="size-btn ${t.id === state.tamanho ? "active" : ""}" data-id="${t.id}" data-mult="${t.mult}" data-label="${t.label}">
        <span class="size-btn__label">${t.label}</span>
        <span class="size-btn__info">${t.info}</span>
        <span class="size-btn__price">${formatBRL(preco)}</span>
      </button>`;
  }).join("");

  grid.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.tamanho      = btn.dataset.id;
      state.tamanhoMult  = parseFloat(btn.dataset.mult);
      state.tamanhoLabel = btn.dataset.label;
      grid.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updatePrice();
    });
  });
}

// ===== BORDAS =====
function renderBordas() {
  const list = document.getElementById("bordaList");
  list.innerHTML = BORDAS.map(b => `
    <div class="option-item ${b.id === state.bordaId ? "active" : ""}" data-id="${b.id}" data-preco="${b.preco}" data-label="${b.label}">
      <span class="option-item__check">✓</span>
      <span class="option-item__label">${b.label}</span>
      <span class="option-item__price">${b.preco > 0 ? "+ " + formatBRL(b.preco) : "Grátis"}</span>
    </div>
  `).join("");

  list.querySelectorAll(".option-item").forEach(item => {
    item.addEventListener("click", () => {
      state.bordaId    = item.dataset.id;
      state.bordaPreco = parseFloat(item.dataset.preco);
      state.bordaLabel = item.dataset.label;
      list.querySelectorAll(".option-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      updatePrice();
    });
  });
}

// ===== ADICIONAIS =====
function renderAdicionais() {
  const list = document.getElementById("adicionaisList");
  list.innerHTML = ADICIONAIS.map(a => `
    <div class="option-item" data-id="${a.id}" data-preco="${a.preco}" data-label="${a.label}">
      <span class="option-item__check option-item__check--square">✓</span>
      <span class="option-item__label">${a.label}</span>
      <span class="option-item__price">+ ${formatBRL(a.preco)}</span>
    </div>
  `).join("");

  list.querySelectorAll(".option-item").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      if (item.classList.contains("active")) {
        item.classList.remove("active");
        state.adicionais = state.adicionais.filter(a => a.id !== id);
      } else {
        item.classList.add("active");
        state.adicionais.push({ id, label: item.dataset.label, preco: parseFloat(item.dataset.preco) });
      }
      updatePrice();
    });
  });
}

// ===== PREÇO =====
function calcTotal() {
  const base    = state.product.preco * state.tamanhoMult;
  const extras  = state.adicionais.reduce((s, a) => s + a.preco, 0);
  return (base + state.bordaPreco + extras) * state.qty;
}

function updatePrice() {
  const base = state.product.preco * state.tamanhoMult;
  const total = calcTotal() / state.qty;

  document.getElementById("produtoPrice").innerHTML = `
    ${state.product.precoOld ? `<span class="price-old">${formatBRL(state.product.precoOld)}</span>` : ""}
    ${state.product.temTamanho ? `<span class="price-from">A partir de</span>` : ""}
    <span class="price-val">${formatBRL(base)}</span>
  `;

  updateQtyUI();
}

function updateQtyUI() {
  document.getElementById("qtyNum").textContent   = state.qty;
  document.getElementById("btnPrice").textContent = formatBRL(calcTotal());
}

// ===== ADICIONAR AO CARRINHO =====
function addToCart() {
  const obs = document.getElementById("obsField").value.trim();

  Cart.add(state.product.id, {
    tamanho:       state.tamanho,
    tamanhoMult:   state.tamanhoMult,
    tamanhoLabel:  state.tamanhoLabel,
    borda:         state.bordaId,
    precoBorda:    state.bordaPreco,
    bordaLabel:    state.bordaLabel,
    adicionais:    state.adicionais.map(a => a.id),
    adicionaisLabels: state.adicionais.map(a => a.label),
    adicionaisPrecos: state.adicionais.map(a => a.preco),
    obs,
  });

  // Adiciona a quantidade escolhida
  if (state.qty > 1) {
    for (let i = 1; i < state.qty; i++) {
      Cart.add(state.product.id, {
        tamanho: state.tamanho, tamanhoMult: state.tamanhoMult, tamanhoLabel: state.tamanhoLabel,
        borda: state.bordaId, precoBorda: state.bordaPreco, bordaLabel: state.bordaLabel,
        adicionais: state.adicionais.map(a => a.id), adicionaisLabels: state.adicionais.map(a => a.label),
        adicionaisPrecos: state.adicionais.map(a => a.preco), obs,
      });
    }
  }

  showToast(`✅ ${state.product.nome} adicionado ao carrinho!`);
  setTimeout(() => window.location.href = "menu.html", 900);
}

init();
