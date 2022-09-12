let panierExistant = JSON.parse(localStorage.getItem("panier"));
console.log(panierExistant);

const afficherElementsPanier = async () => {
  const conteneurPanier = document.getElementById("cart__items");

  if (!panierExistant || panierExistant.length == 0) {
    alert("Votre panier est vide !");
    document.querySelector(".cart__order__form").style.display = "none";
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

          //Suppression des produits dans le panier
          const supprimerUnProduit = document.querySelectorAll(".deleteItem");

          for (let i = 0; i < supprimerUnProduit.length; i++) {
            supprimerUnProduit[i].addEventListener("click", supprimerLeProduit);

            let idASupprimer = panierExistant[i].id;
            let couleurASupprimer = panierExistant[i].color;

            function supprimerLeProduit() {
              if (
                window.confirm("Voulez-vous vraiment supprimer le produit ?")
              ) {
                panierExistant = panierExistant.filter(
                  (el) =>
                    el.id !== idASupprimer || el.color !== couleurASupprimer
                );
                localStorage.setItem("panier", JSON.stringify(panierExistant));
                window.location.reload();
                //supprimerUnProduit.closest(".cart__item").remove();
              }
            }
          }

          //Modifier la quantité des produits
          //const produits = document.querySelectorAll(".cart__item");
          const modifierQuantite = document.querySelectorAll(".itemQuantity");

          for (let j = 0; j < modifierQuantite.length; j++) {
            modifierQuantite[j].addEventListener("change", (e) => {
              if (
                modifierQuantite[j].value < 1 ||
                modifierQuantite[j].value > 100
              ) {
                alert("Choisissez une quantité entre 1 et 100");
              } else {
                panierExistant[j].quantity = Number(e.target.value);
                localStorage.setItem("panier", JSON.stringify(panierExistant));
              }
            });
          }

          // Prix total de la commande
          let quantiteTousLesProduits = 0;
          let prixTousLesProduits = 0;

          for (let prod of panierExistant) {
            quantiteUnProduit = Number(prod.quantity);
            quantiteTousLesProduits += quantiteUnProduit;
            prixUnTypeDeProduit = Number(prod.quantity) * Number(value.price);
            prixTousLesProduits += prixUnTypeDeProduit;
          }

          document.getElementById("totalQuantity").textContent =
            quantiteTousLesProduits;
          document.getElementById("totalPrice").textContent =
            prixTousLesProduits;
            console.log(prixUnTypeDeProduit);
        });
    }
  }
};
afficherElementsPanier();

//******************************FORMULAIRE**********************************//

const regexNomPrenomVille = new RegExp("^[a-zA-Zàâéèëêïîôùüç -]{1,60}$");
const regexEmail = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9.-]+$");
const regexAdressePostale = new RegExp(
  "^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);

let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputAddress = document.getElementById("address");
let inputCity = document.getElementById("city");
let inputEmail = document.getElementById("email");

/**
 *
 * @param {HTMLInputElement} elementHtml
 * @param {String} idErreur
 * @param {String} messageErreur
 */
function verificationNomPrenom(elementHtml, idErreur, messageErreur) {
  if (elementHtml.value == "") {
    let errorLastName = document.getElementById(idErreur);
    errorLastName.textContent = "Champ requis";
    errorLastName.style.color = "red";
  } else if (regexNomPrenomVille.test(elementHtml.value) == false) {
    let errorLastName = document.getElementById(idErreur);
    errorLastName.textContent = messageErreur;
    errorLastName.style.color = "red";
  } else {
    let validLastName = document.getElementById(idErreur);
    validLastName.textContent = "Champ valide";
    validLastName.style.color = "white";
  }
}

//-------------------------------Prénom----------------------------//
inputFirstName.addEventListener("change", function () {
  verificationNomPrenom(
    inputFirstName,
    "firstNameErrorMsg",
    "les caractères spéciaux ne sont pas acceptés"
  );
});

//--------------------------------Nom----------------------------//
inputLastName.addEventListener("change", function () {
  verificationNomPrenom(
    inputLastName,
    "lastNameErrorMsg",
    "les caractères spéciaux ne sont pas acceptés"
  );
});

//------------------------------Adresse--------------------------//
inputAddress.addEventListener("change", function () {
  if (inputAddress.value == "") {
    let errorAdress = document.getElementById("addressErrorMsg");
    errorAdress.textContent = "Champs requis";
    errorAdress.style.color = "red";
  } else if (regexAdressePostale.test(inputAddress.value) == false) {
    let errorAdress = document.getElementById("addressErrorMsg");
    errorAdress.textContent = "format d'adresse non valide";
    errorAdress.style.color = "red";
  } else {
    let validAdress = document.getElementById("addressErrorMsg");
    validAdress.textContent = "Adresse valide";
    validAdress.style.color = "white";
  }
});

//--------------------------------Ville-----------------------------//
inputCity.addEventListener("change", function () {
  verificationNomPrenom(
    inputCity,
    "cityErrorMsg",
    "les caractères spéciaux ne sont pas acceptés"
  );
});

//------------------------------Email--------------------------------//
inputEmail.addEventListener("change", function () {
  if (inputEmail.value == "") {
    let errorEmail = document.getElementById("emailErrorMsg");
    errorEmail.textContent = "Champs requis";
    errorEmail.style.color = "red";
  } else if (regexEmail.test(inputEmail.value) == false) {
    let errorEmail = document.getElementById("emailErrorMsg");
    errorEmail.textContent = "Adresse email non valide";
    errorEmail.style.color = "red";
  } else {
    let validEmail = document.getElementById("emailErrorMsg");
    validEmail.textContent = "Adresse email valide";
    validEmail.style.color = "white";
  }
});

const formulaire = document.querySelector(".cart__order__form");

formulaire.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    regexNomPrenomVille.test(inputFirstName.value) == true ||
    regexNomPrenomVille.test(inputLastName.value) == true ||
    regexAdressePostale.test(inputAddress.value) == true ||
    regexNomPrenomVille.test(inputCity.value) == true ||
    regexEmail.test(inputEmail.value) == true
  ) {
    let idProducts = [];
    for (let k = 0; k < panierExistant.length; k++) {
      idProducts.push(panierExistant[k].id);
    }

    const donneesClient = {
      contact: {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value,
      },
      products: idProducts,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(donneesClient),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        document.location.href = `confirmation.html?id=${data.orderId}`;
      });
  }
});

/*
              //prixUnProduit = Number(value.price);
              //prixUnProduitQuantite = quantiteUnProduit * prixUnProduit;
              //prixTousLesProduits += prixUnProduit;
              //tousLesPrix.push(prixUnProduitQuantite)
 */
