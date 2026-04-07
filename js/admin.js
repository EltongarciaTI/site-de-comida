/* ================================================================
   ADMIN.JS — Utilitários compartilhados do painel admin
   ================================================================ */

// Verifica se está logado
function adminGuard() {
  if (!sessionStorage.getItem("deliry_admin")) {
    window.location.href = "login.html";
  }
}

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("deliry_admin");
      window.location.href = "login.html";
    });
  }
});

// Badge de status
function statusBadge(status) {
  const map = {
    pendente:   ["pendente",  "Pendente"],
    preparando: ["preparando","Preparando"],
    saiu:       ["saiu",      "Saiu p/ entrega"],
    entregue:   ["entregue",  "Entregue ✓"],
    cancelado:  ["cancelado", "Cancelado"],
  };
  const [cls, label] = map[status] || ["pendente", status || "—"];
  return `<span class="status-badge status-badge--${cls}">${label}</span>`;
}
