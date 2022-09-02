let panierExistant = JSON.parse(localStorage.getItem("panier"));
console.log(panierExistant);

const afficherElementsPanier = async () => {
  const conteneurPanier = document.getElementById("cart__items");

  if (!panierExistant) {
    alert("Votre panier est vide !");
  } else {
    for (let valeur of panierExistant) {
      let produitsDuPanier = {
        id: valeur.id,
        couleur: valeur.color,
        quantite: valeur.quantity,
      };

      fetch("http://localhost:3000/api/products/" + produitsDuPanier.id)
        .then((response) => response.json())
        .then(function (value) {
          const leHtml = `<article class="cart__item" data-id="${valeur.id}" data-color="${valeur.color}">
        <div class="cart__item__img">
          <img src="${value.imageUrl}" alt="${value.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${value.name}</h2>
            <p>${valeur.color}</p>
            <p>${value.price}€</p>
          </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : ${valeur.quantity}</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${valeur.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
        </div>
      </article>`;
          conteneurPanier.innerHTML += leHtml;
        });
    }
  }
};
afficherElementsPanier();

const produits = document.getElementsByClassName("cart__item");
const supprimerUnProduit = document.getElementsByClassName("deleteItem");

for (let i = 0; i < produits.length; i++) {
  supprimerUnProduit[i].addEventListener("click", supprimerLeProduit);

  function supprimerLeProduit() {}
}

/*
const changeQuantite = document.getElementsByClassName("itemQuantity");
const produits = document.getElementsByClassName("cart__item");

for (let i = 0; i < produits.length; i++) {

const quantite = changeQuantite[i];
const unProduit = produits[i];

changeQuantite.addEventListener ("change", (e) => {

  if(quantite.value < 1 || quantite.value > 100){

    alert("Choisissez une quantité entre 1 et 100");
    return

  }else{
    unProduit.quantity = parseInt(e.target.value);
    localStorage.setItem("panier", JSON.stringify(panierExistant));
  }
  
})
}
*/
