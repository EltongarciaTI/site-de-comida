/* ================================================================
   DB.JS — Cardápio, opções e gerenciamento de dados (localStorage)
   ================================================================ */

// ======================== CATEGORIAS ========================
const CATEGORIAS = [
  { id: "all",         label: "Todos",        icon: "🔥" },
  { id: "tradicional", label: "Tradicionais", icon: "🍕" },
  { id: "especial",    label: "Especiais",    icon: "⭐" },
  { id: "brotinho",    label: "Brotinhos",    icon: "🍕" },
  { id: "bebidas",     label: "Bebidas",      icon: "🥤" },
  { id: "sobremesa",   label: "Sobremesas",   icon: "🍰" },
];

// ======================== TAMANHOS ========================
const TAMANHOS = [
  { id: "p",  label: "Pequena",  info: "4 fatias · 1–2 pessoas",  mult: 0.75 },
  { id: "m",  label: "Média",    info: "6 fatias · 2–3 pessoas",  mult: 1.00 },
  { id: "g",  label: "Grande",   info: "8 fatias · 3–4 pessoas",  mult: 1.30 },
  { id: "gg", label: "Família",  info: "12 fatias · 4–6 pessoas", mult: 1.65 },
];

// ======================== BORDAS ========================
const BORDAS = [
  { id: "sem_borda",  label: "Sem borda recheada",  preco: 0.00 },
  { id: "catupiry",   label: "Catupiry Original",   preco: 8.00 },
  { id: "cheddar",    label: "Cheddar",              preco: 8.00 },
  { id: "chocolate",  label: "Chocolate",            preco: 9.00 },
  { id: "doce_leite", label: "Doce de Leite",        preco: 9.00 },
  { id: "cream_cheese",label: "Cream Cheese",        preco: 8.00 },
];

// ======================== ADICIONAIS ========================
const ADICIONAIS = [
  { id: "extra_queijo",   label: "Extra Queijo",      preco: 6.00 },
  { id: "extra_bacon",    label: "Extra Bacon",       preco: 7.00 },
  { id: "extra_carne",    label: "Extra Carne",       preco: 8.00 },
  { id: "molho_picante",  label: "Molho Picante",     preco: 3.00 },
  { id: "extra_azeitona", label: "Azeitona Extra",    preco: 4.00 },
  { id: "cebola_caramelizada", label: "Cebola Caramelizada", preco: 5.00 },
];

// ======================== CARDÁPIO ========================
// gradiente: CSS usado como fundo do card quando não há foto
// img: caminho local da foto (coloque a foto na pasta /img/)
const MENU_PADRAO = [
  {
    id: 1,
    nome:      "Calabresa Artesanal",
    desc:      "Molho ao sugo, mussarela, calabresa fatiada na hora, cebola roxa e azeitonas verdes",
    preco:     45.90,
    precoOld:  54.90,
    cat:       "tradicional",
    badge:     "best",
    badgeTexto:"Mais pedida",
    destaque:  true,
    temTamanho:true,
    temBorda:  true,
    img:       "img/pizza-calabresa.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.15) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #F5C518 0%, #E8341C 35%, #922B00 60%, #3D1000 85%)",
  },
  {
    id: 2,
    nome:      "Margherita Premium",
    desc:      "Molho de tomate artesanal, mussarela de búfala importada, tomate cereja e manjericão fresco",
    preco:     52.90,
    precoOld:  null,
    cat:       "especial",
    badge:     "new",
    badgeTexto:"Novo",
    destaque:  true,
    temTamanho:true,
    temBorda:  true,
    img:       "img/pizza-margherita.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.2) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #FFFDE7 0%, #FFF176 20%, #E8341C 50%, #6D2C00 75%, #2D1000 92%)",
  },
  {
    id: 3,
    nome:      "Quatro Queijos",
    desc:      "Cheddar, mussarela, parmesão ralado na hora e gorgonzola com borda crocante dourada",
    preco:     55.90,
    precoOld:  null,
    cat:       "especial",
    badge:     "hot",
    badgeTexto:"Top vendas",
    destaque:  true,
    temTamanho:true,
    temBorda:  true,
    img:       "img/pizza-queijo.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.25) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #FFFEF0 0%, #FFD600 20%, #F5A623 42%, #8B5E00 68%, #3D2800 90%)",
  },
  {
    id: 4,
    nome:      "Frango com Catupiry",
    desc:      "Frango desfiado temperado artesanalmente, catupiry original cremoso e milho verde selecionado",
    preco:     48.90,
    precoOld:  56.00,
    cat:       "tradicional",
    badge:     "best",
    badgeTexto:"Favorita",
    destaque:  false,
    temTamanho:true,
    temBorda:  true,
    img:       "img/pizza-frango.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.2) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #FFFFF0 0%, #FFF9C4 18%, #F5A623 40%, #CC6600 62%, #3D1A00 88%)",
  },
  {
    id: 5,
    nome:      "Pepperoni Especial",
    desc:      "Molho de tomate especial, mussarela derretida e generosa cobertura de pepperoni importado",
    preco:     57.90,
    precoOld:  null,
    cat:       "especial",
    badge:     "hot",
    badgeTexto:"Mais quente",
    destaque:  false,
    temTamanho:true,
    temBorda:  true,
    img:       "img/pizza-pepperoni.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,160,120,.3) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #FF8A65 0%, #E8341C 28%, #B71C1C 55%, #4A0000 82%)",
  },
  {
    id: 6,
    nome:      "Portuguesa",
    desc:      "Presunto, ovos caipiras, palmito pupunha, cebola, azeitonas pretas e pimentão colorido",
    preco:     47.90,
    precoOld:  null,
    cat:       "tradicional",
    badge:     null,
    badgeTexto:"",
    destaque:  false,
    temTamanho:true,
    temBorda:  true,
    img:       "img/pizza-portuguesa.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,255,200,.2) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #FFF9C4 0%, #FFCC02 25%, #E8341C 48%, #6A1E8F 68%, #2A0040 88%)",
  },
  {
    id: 7,
    nome:      "Brotinho Calabresa",
    desc:      "Mini versão da nossa calabresa artesanal, perfeita para 1 pessoa",
    preco:     28.90,
    precoOld:  null,
    cat:       "brotinho",
    badge:     null,
    badgeTexto:"",
    destaque:  false,
    temTamanho:false,
    temBorda:  true,
    img:       "img/pizza-brotinho.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.15) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #F5C518 0%, #E8341C 35%, #922B00 60%, #3D1000 85%)",
  },
  {
    id: 8,
    nome:      "Brotinho Margherita",
    desc:      "Mini pizza com tomate, mussarela fresca e manjericão",
    preco:     24.90,
    precoOld:  null,
    cat:       "brotinho",
    badge:     null,
    badgeTexto:"",
    destaque:  false,
    temTamanho:false,
    temBorda:  true,
    img:       "img/pizza-brotinho2.jpg",
    gradiente: "radial-gradient(circle at 35% 35%, rgba(255,255,255,.2) 0%, transparent 35%), radial-gradient(circle at 50% 50%, #FFFDE7 0%, #FFF176 20%, #E8341C 50%, #6D2C00 75%, #2D1000 92%)",
  },
  {
    id: 9,
    nome:      "Coca-Cola 600ml",
    desc:      "Gelada e refrescante, garrafa 600ml",
    preco:     8.90,
    precoOld:  null,
    cat:       "bebidas",
    badge:     null,
    badgeTexto:"",
    destaque:  false,
    temTamanho:false,
    temBorda:  false,
    img:       "img/coca-cola.jpg",
    gradiente: "radial-gradient(circle at 35% 25%, rgba(255,255,255,.35) 0%, transparent 40%), linear-gradient(170deg, #D32F2F 0%, #8B0000 55%, #3E0000 100%)",
  },
  {
    id: 10,
    nome:      "Suco Natural 500ml",
    desc:      "Laranja, limão ou maracujá — espremido na hora, sem conservantes",
    preco:     12.90,
    precoOld:  null,
    cat:       "bebidas",
    badge:     "new",
    badgeTexto:"Novo",
    destaque:  false,
    temTamanho:false,
    temBorda:  false,
    img:       "img/suco.jpg",
    gradiente: "radial-gradient(circle at 35% 25%, rgba(255,255,255,.4) 0%, transparent 40%), linear-gradient(170deg, #FFB300 0%, #E65100 55%, #6D3000 100%)",
  },
  {
    id: 11,
    nome:      "Brownie de Nutella",
    desc:      "Brownie quente com recheio de Nutella, nozes e sorvete de creme",
    preco:     18.90,
    precoOld:  null,
    cat:       "sobremesa",
    badge:     "hot",
    badgeTexto:"Irresistível",
    destaque:  false,
    temTamanho:false,
    temBorda:  false,
    img:       "img/brownie.jpg",
    gradiente: "radial-gradient(circle at 35% 25%, rgba(255,220,180,.2) 0%, transparent 40%), linear-gradient(135deg, #5D4037 0%, #3E2723 50%, #1A0A00 100%)",
  },
  {
    id: 12,
    nome:      "Pudim da Casa",
    desc:      "Pudim cremoso com calda de caramelo artesanal e hortelã",
    preco:     14.90,
    precoOld:  null,
    cat:       "sobremesa",
    badge:     "best",
    badgeTexto:"Clássico",
    destaque:  false,
    temTamanho:false,
    temBorda:  false,
    img:       "img/pudim.jpg",
    gradiente: "radial-gradient(circle at 35% 25%, rgba(255,255,200,.3) 0%, transparent 40%), linear-gradient(135deg, #F5A623 0%, #D4780A 40%, #8B4513 75%, #3D1A00 100%)",
  },
];

// ======================== DB (localStorage) ========================
const DB = {
  // --- Carrinho ---
  getCart()       { try { return JSON.parse(localStorage.getItem("deliry_cart"))     || []; } catch { return []; } },
  saveCart(items) { localStorage.setItem("deliry_cart", JSON.stringify(items)); },

  // --- Pedidos ---
  getOrders()       { try { return JSON.parse(localStorage.getItem("deliry_orders")) || []; } catch { return []; } },
  saveOrders(list)  { localStorage.setItem("deliry_orders", JSON.stringify(list)); },
  addOrder(order) {
    const list  = this.getOrders();
    order.id    = Date.now();
    order.data  = new Date().toISOString();
    order.status = "pendente";
    list.unshift(order);
    this.saveOrders(list);
    return order;
  },
  updateOrderStatus(id, status) {
    const list = this.getOrders();
    const idx  = list.findIndex(o => o.id === id);
    if (idx > -1) { list[idx].status = status; this.saveOrders(list); }
  },

  // --- Produtos (admin pode editar) ---
  getProducts() {
    try {
      const saved = JSON.parse(localStorage.getItem("deliry_products"));
      return saved && saved.length > 0 ? saved : [...MENU_PADRAO];
    } catch { return [...MENU_PADRAO]; }
  },
  saveProducts(products) { localStorage.setItem("deliry_products", JSON.stringify(products)); },
};