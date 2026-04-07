/* ================================================================
   CONFIG.JS — Configurações do estabelecimento
   Edite este arquivo para personalizar o site para outro nicho
   ================================================================ */

const CONFIG = {
  // --- Identidade ---
  nome:       "Deliry Pizza",
  tagline:    "A pizza mais gostosa da cidade",
  descricao:  "Pizzas artesanais feitas com ingredientes selecionados, entregues quentinhas na sua porta em até 45 minutos.",
  emoji:      "🍕",
  corPrimaria: "#E8341C",   // Troque para mudar a cor principal do site

  // --- Contato ---
  whatsapp:   "5511999999999",   // DDI + DDD + número (sem espaços)
  telefone:   "(11) 99999-9999",
  instagram:  "@delirypizza",

  // --- Endereço ---
  endereco:   "Rua das Pizzas, 123",
  bairro:     "Centro",
  cidade:     "São Paulo – SP",
  cep:        "01310-000",

  // --- Funcionamento ---
  horarios: [
    { dias: "Seg – Sex", hora: "18h às 23h" },
    { dias: "Sáb – Dom", hora: "17h às 00h" },
  ],
  aberto: true,   // false = exibe banner "fechado" no site

  // --- Entrega ---
  taxaEntrega:    5.00,
  freteGratisMin: 60.00,
  pedidoMinimo:   30.00,
  tempoEntrega:   "35–50 min",

  // --- Avaliação ---
  avaliacao:    "4.9",
  totalAvaliacoes: "1.842",
  totalPedidos: "3.2k",

  // --- Admin ---
  adminSenha: "admin123",   // Troque antes de publicar

  // --- Formas de pagamento aceitas ---
  pagamentos: ["pix", "cartao_credito", "cartao_debito", "dinheiro"],

  // --- Promoções do banner (máx. 3) ---
  promos: [
    { cor: "red",    tag: "OFERTA",  texto: "2ª pizza com <strong>30% OFF</strong>" },
    { cor: "orange", tag: "FRETE",   texto: "Grátis acima de <strong>R$ 60</strong>" },
    { cor: "gold",   tag: "COMBO",   texto: "Pizza + Bebida com <strong>desconto</strong> 🥤" },
  ],

  // --- Depoimentos ---
  reviews: [
    { nome: "Ana Souza",      inicial: "A", cor: "#E8341C", texto: "A melhor pizza que já comi! Chegou super rápida e ainda quentinha.", estrelas: 5 },
    { nome: "Marcos Lima",    inicial: "M", cor: "#7B2FFF", texto: "Peço toda semana. A calabresa artesanal é simplesmente incrível!", estrelas: 5 },
    { nome: "Juliana Costa",  inicial: "J", cor: "#FF7A00", texto: "Atendimento excelente e sabor único. Recomendo muito!", estrelas: 5 },
    { nome: "Pedro Alves",    inicial: "P", cor: "#25D366", texto: "Chegou em 30 min, quentinha e deliciosa. Virei cliente fiel!", estrelas: 5 },
  ],
};