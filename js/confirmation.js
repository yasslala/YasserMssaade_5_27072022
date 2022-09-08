// je récupère le numéro de commande a partir de l'URL
let orderUrl = new URL(location).searchParams;
let orderId = orderUrl.get("id");

// Affichage du n° de commande
document.getElementById("orderId").textContent = orderId;

localStorage.clear();