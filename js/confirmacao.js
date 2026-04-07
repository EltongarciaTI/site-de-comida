/* ================================================================
   CONFIRMACAO.JS
   ================================================================ */

document.getElementById("confirmWpp").href = `https://wa.me/${CONFIG.whatsapp}`;

const order = JSON.parse(sessionStorage.getItem("deliry_last_order") || "null");

if (order) {
  // Card do pedido
  const card = document.getElementById("confirmCard");
  const payLabels = { pix: "Pix", cartao_credito: "Crédito", cartao_debito: "Débito", dinheiro: "Dinheiro" };

  card.innerHTML = `
    <div class="confirm-card__row">
      <span>Nº do pedido</span>
      <span>#${String(order.id).slice(-6)}</span>
    </div>
    <div class="confirm-card__row">
      <span>Cliente</span>
      <span>${order.cliente.nome}</span>
    </div>
    <div class="confirm-card__row">
      <span>Itens</span>
      <span>${order.itens.map(i => `${i.qty}x ${i.nome}`).join(", ")}</span>
    </div>
    <div class="confirm-card__row">
      <span>Entrega</span>
      <span>${order.entrega.endereco}</span>
    </div>
    <div class="confirm-card__row">
      <span>Pagamento</span>
      <span>${payLabels[order.pagamento.tipo] || order.pagamento.tipo}</span>
    </div>
    ${order.obs ? `<div class="confirm-card__row"><span>Obs</span><span>${order.obs}</span></div>` : ""}
    <div class="confirm-card__row confirm-card__total">
      <span>Total pago</span>
      <span>${formatBRL(order.total)}</span>
    </div>
  `;

  // Tempo
  document.getElementById("confirmTempo").innerHTML =
    `⏱️ Tempo estimado de entrega: <strong>${CONFIG.tempoEntrega}</strong>`;

  // Animação de progresso
  setTimeout(() => {
    document.getElementById("step2").classList.add("active");
  }, 2000);
}
