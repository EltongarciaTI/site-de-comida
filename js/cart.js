/* ================================================================
   CART.JS — Lógica completa do carrinho (compartilhado entre páginas)
   ================================================================ */

const Cart = {
  get()       { return DB.getCart(); },
  save(items) { DB.saveCart(items); this.onUpdate(); },

  // Adiciona item com todas as opções de personalização
  add(productId, opts = {}) {
    const products = DB.getProducts();
    const product  = products.find(p => p.id === productId);
    if (!product) return;

    const tamanhoMult  = opts.tamanhoMult  || 1;
    const precoBorda   = opts.precoBorda   || 0;
    const precoExtras  = (opts.adicionaisPrecos || []).reduce((s, v) => s + v, 0);
    const precoUnit    = (product.preco * tamanhoMult) + precoBorda + precoExtras;

    // Chave única para diferenciar variações do mesmo produto
    const key = [
      productId,
      opts.tamanho   || "m",
      opts.borda     || "sem_borda",
      (opts.adicionais || []).sort().join(","),
    ].join("|");

    const items = this.get();
    const idx   = items.findIndex(i => i.key === key);

    if (idx > -1) {
      items[idx].qty++;
    } else {
      items.push({
        key,
        id:            productId,
        nome:          product.nome,
        img:           product.img    || "",
        gradiente:     product.gradiente || "#333",
        preco:         precoUnit,
        tamanho:       opts.tamanho      || "m",
        tamanhoLabel:  opts.tamanhoLabel || "Média",
        borda:         opts.bordaLabel   || "Sem borda recheada",
        adicionais:    opts.adicionaisLabels || [],
        obs:           opts.obs          || "",
        qty:           1,
      });
    }

    this.save(items);
  },

  changeQty(key, delta) {
    const items = this.get();
    const idx   = items.findIndex(i => i.key === key);
    if (idx === -1) return;
    items[idx].qty += delta;
    if (items[idx].qty <= 0) items.splice(idx, 1);
    this.save(items);
  },

  remove(key) {
    this.save(this.get().filter(i => i.key !== key));
  },

  clear() { this.save([]); },

  totalQty()   { return this.get().reduce((s, i) => s + i.qty, 0); },
  totalPrice() { return this.get().reduce((s, i) => s + i.preco * i.qty, 0); },

  onUpdate() {
    // Atualiza badge do carrinho
    const badge = document.getElementById("cartCount");
    if (badge) {
      const qty = this.totalQty();
      badge.textContent    = qty;
      badge.style.display  = qty > 0 ? "flex" : "none";
      badge.classList.remove("bump");
      void badge.offsetWidth;
      badge.classList.add("bump");
      setTimeout(() => badge.classList.remove("bump"), 400);
    }
    window.dispatchEvent(new Event("cartUpdate"));
  },
};

// ======================== UTILITÁRIOS GLOBAIS ========================

function formatBRL(v) {
  return "R$\u00a0" + v.toFixed(2).replace(".", ",");
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR") + " às " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

let _toastTimer;
function showToast(msg, type = "success") {
  let el = document.getElementById("toast");
  if (!el) return;
  el.innerHTML = msg;
  el.className = `toast toast--${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

// Atualiza badge ao carregar qualquer página
document.addEventListener("DOMContentLoaded", () => Cart.onUpdate());
