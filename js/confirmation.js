// Récupération du numéro de commande à partir de l'URL
let orderUrl = new URL(location).searchParams;
let orderId = orderUrl.get("id");

// Affichage du numéro de commande
document.getElementById("orderId").textContent = orderId;

//On vide le localstorage
localStorage.clear();
