/* ================================================================
   CHECKOUT.JS — Lógica completa do checkout
   ================================================================ */

let deliveryType  = "entrega";
let paymentType   = "pix";

// ===== INICIALIZAÇÃO =====
function init() {
  renderPage();
  setupEventListeners();
  updateSummary();
  document.getElementById("sumTempo").textContent = CONFIG.tempoEntrega;
}

// ===== RENDER PRINCIPAL =====
function renderPage() {
  const items = Cart.get();
  const empty  = document.getElementById("cartEmpty");
  const wrap   = document.getElementById("checkoutWrap");
  const sticky = document.getElementById("checkoutSticky");

  if (items.length === 0) {
    empty.style.display = "flex";
    wrap.style.display  = "none";
    sticky.style.display = "none";
    return;
  }

  empty.style.display = "none";
  wrap.style.display  = "grid";
  sticky.style.display = "block";

  renderItems(items);
  updateSummary();
}

// ===== ITENS =====
function renderItems(items) {
  const container = document.getElementById("orderItems");
  container.innerHTML = items.map(item => `
    <div class="order-item">
      <div class="order-item__img">
        <div class="order-item__img-bg" style="background:${item.gradiente}"></div>
        <img src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'" />
      </div>
      <div class="order-item__info">
        <div class="order-item__name">${item.nome}</div>
        <div class="order-item__opts">
          ${item.tamanhoLabel !== "Único" ? `📏 ${item.tamanhoLabel}` : ""}
          ${item.borda !== "Sem borda recheada" ? ` · 🧀 ${item.borda}` : ""}
          ${item.adicionais?.length ? ` · ➕ ${item.adicionais.join(", ")}` : ""}
          ${item.obs ? `<br>📝 ${item.obs}` : ""}
        </div>
      </div>
      <div class="order-item__right">
        <div class="order-item__price">${formatBRL(item.preco * item.qty)}</div>
        <div class="order-item__qty">
          <button class="qty-sm-btn" onclick="changeQty('${item.key}', -1)">−</button>
          <span class="qty-sm-num">${item.qty}</span>
          <button class="qty-sm-btn" onclick="changeQty('${item.key}', +1)">+</button>
        </div>
      </div>
    </div>
  `).join("");
}

function changeQty(key, delta) {
  Cart.changeQty(key, delta);
  renderPage();
}

// ===== RESUMO =====
function calcFrete() {
  if (deliveryType === "retirada") return 0;
  const sub = Cart.totalPrice();
  return sub >= CONFIG.freteGratisMin ? 0 : CONFIG.taxaEntrega;
}

function updateSummary() {
  const sub   = Cart.totalPrice();
  const frete = calcFrete();
  const total = sub + frete;
  const qty   = Cart.totalQty();

  document.getElementById("sumSubtotal").textContent  = formatBRL(sub);
  document.getElementById("sumTotal").textContent     = formatBRL(total);
  document.getElementById("stickyTotal").textContent  = formatBRL(total);
  document.getElementById("stickyQty").textContent    = `${qty} ${qty === 1 ? "item" : "itens"}`;

  const freteEl = document.getElementById("sumFrete");
  if (frete === 0) {
    freteEl.textContent  = "Grátis";
    freteEl.className    = "sum-free";
  } else {
    freteEl.textContent  = formatBRL(frete);
    freteEl.className    = "";
  }

  const restante = CONFIG.freteGratisMin - sub;
  document.getElementById("freteLabel").textContent = frete === 0
    ? "Frete grátis! 🎉"
    : restante > 0
      ? `Falta ${formatBRL(restante)} p/ frete grátis`
      : `Taxa: ${formatBRL(CONFIG.taxaEntrega)}`;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Tipo de entrega
  document.querySelectorAll(".delivery-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      deliveryType = btn.dataset.type;
      document.querySelectorAll(".delivery-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const addrFields = document.getElementById("addressFields");
      addrFields.style.display = deliveryType === "entrega" ? "block" : "none";
      updateSummary();
    });
  });

  // Pagamento
  document.querySelectorAll(".pay-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      paymentType = btn.dataset.pay;
      document.querySelectorAll(".pay-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const trocoField = document.getElementById("trocoField");
      trocoField.style.display = paymentType === "dinheiro" ? "block" : "none";
    });
  });

  // Limpar carrinho
  document.getElementById("btnLimpar").addEventListener("click", () => {
    if (!Cart.totalQty()) return;
    if (confirm("Deseja limpar o carrinho?")) {
      Cart.clear();
      renderPage();
    }
  });

  // Finalizar
  document.getElementById("btnFinalizar").addEventListener("click", finalizar);
  document.getElementById("btnFinalizarMobile").addEventListener("click", finalizar);

  // Telefone: máscara simples
  const fTel = document.getElementById("fTelefone");
  fTel.addEventListener("input", () => {
    let v = fTel.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    fTel.value = v;
  });

  // Cart update
  window.addEventListener("cartUpdate", renderPage);
}

// ===== VALIDAÇÃO =====
function validar() {
  const nome = document.getElementById("fNome").value.trim();
  const tel  = document.getElementById("fTelefone").value.trim();

  if (!nome) { showToast("⚠️ Informe seu nome", "error"); document.getElementById("fNome").focus(); return false; }
  if (tel.length < 14) { showToast("⚠️ Informe um telefone válido", "error"); document.getElementById("fTelefone").focus(); return false; }

  if (deliveryType === "entrega") {
    const rua    = document.getElementById("fRua").value.trim();
    const bairro = document.getElementById("fBairro").value.trim();
    if (!rua)    { showToast("⚠️ Informe a rua e número", "error"); document.getElementById("fRua").focus(); return false; }
    if (!bairro) { showToast("⚠️ Informe o bairro", "error"); document.getElementById("fBairro").focus(); return false; }
  }

  if (Cart.totalPrice() < CONFIG.pedidoMinimo) {
    showToast(`⚠️ Pedido mínimo de ${formatBRL(CONFIG.pedidoMinimo)}`, "error");
    return false;
  }

  return true;
}

// ===== FINALIZAR PEDIDO =====
function finalizar() {
  if (!validar()) return;

  const items     = Cart.get();
  const nome      = document.getElementById("fNome").value.trim();
  const tel       = document.getElementById("fTelefone").value.trim();
  const rua       = document.getElementById("fRua")?.value.trim() || "";
  const compl     = document.getElementById("fComplemento")?.value.trim() || "";
  const bairro    = document.getElementById("fBairro")?.value.trim() || "";
  const obs       = document.getElementById("fObs").value.trim();
  const troco     = document.getElementById("fTroco")?.value || "";
  const subtotal  = Cart.totalPrice();
  const frete     = calcFrete();
  const total     = subtotal + frete;

  const payLabels = {
    pix: "Pix",
    cartao_credito: "Cartão de Crédito",
    cartao_debito:  "Cartão de Débito",
    dinheiro:       "Dinheiro",
  };

  // Salva o pedido
  const order = DB.addOrder({
    cliente:    { nome, tel },
    itens:      items,
    entrega:    {
      tipo:     deliveryType,
      rua, complemento: compl, bairro,
      endereco: deliveryType === "retirada"
        ? "Retirada no estabelecimento"
        : [rua, compl, bairro].filter(Boolean).join(", "),
    },
    pagamento:  { tipo: paymentType, label: payLabels[paymentType], troco },
    obs,
    subtotal,
    frete,
    total,
  });

  // Monta mensagem para WhatsApp
  let msg = `🍕 *Novo Pedido — ${CONFIG.nome}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `👤 *Cliente:* ${nome}\n`;
  msg += `📱 *Telefone:* ${tel}\n\n`;
  msg += `*Itens do pedido:*\n`;

  items.forEach(item => {
    msg += `• ${item.qty}x ${item.nome}`;
    if (item.tamanhoLabel !== "Único") msg += ` (${item.tamanhoLabel})`;
    msg += ` — ${formatBRL(item.preco * item.qty)}\n`;
    if (item.borda !== "Sem borda recheada") msg += `  ↳ Borda: ${item.borda}\n`;
    if (item.adicionais?.length) msg += `  ↳ Adicionais: ${item.adicionais.join(", ")}\n`;
    if (item.obs) msg += `  ↳ Obs: ${item.obs}\n`;
  });

  msg += `\n━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🛍️ Subtotal: ${formatBRL(subtotal)}\n`;
  msg += `🛵 Entrega: ${frete === 0 ? "Grátis" : formatBRL(frete)}\n`;
  msg += `💰 *Total: ${formatBRL(total)}*\n\n`;

  msg += `📍 *Entrega:* ${order.entrega.endereco}\n`;
  msg += `💳 *Pagamento:* ${payLabels[paymentType]}`;
  if (paymentType === "dinheiro" && troco) msg += ` (troco para R$ ${troco})`;
  msg += "\n";

  if (obs) msg += `\n📝 *Obs:* ${obs}\n`;
  msg += `\n🆔 Pedido #${String(order.id).slice(-6)}`;

  // Salva dados para página de confirmação
  sessionStorage.setItem("deliry_last_order", JSON.stringify(order));
  Cart.clear();

  // Abre WhatsApp e redireciona para confirmação
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  window.location.href = "confirmacao.html";
}

init();
