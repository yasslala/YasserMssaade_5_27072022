//Récupération des données du localstorage
let panierExistant = JSON.parse(localStorage.getItem("panier"));
console.log(panierExistant);

//Fonction générale permettant entre autres d'afficher les éléments du panier
const afficherElementsPanier = async () => {
  //Les produits affichés ici
  const conteneurPanier = document.getElementById("cart__items");

  //Si le panier est vide affiche ce message et retire le formulaire
  if (!panierExistant || panierExistant.length == 0) {
    alert("Votre panier est vide !");
    document.querySelector(".cart__order__form").style.display = "none";
  } else {
    //Boucle pour récupérer les produits dans le localstorage
    for (let valeur of panierExistant) {
      //Objet regroupant les éléments récupérés dans le localstorage
      let produitsDuPanier = {
        id: valeur.id,
        couleur: valeur.color,
        quantite: valeur.quantity,
      };

      //Récupération des données de l'api pour chaque produit grâce à l'id
      fetch("http://localhost:3000/api/products/" + produitsDuPanier.id)
        .then((response) => response.json())
        .then(function (value) {
          //Insertion des des éléments dans le HTML
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

          //Bouton permettant la suppression des produits du panier
          const supprimerUnProduit = document.querySelectorAll(".deleteItem");

          //Boucle permettant de pouvoir supprimer pour chaque élément du panier
          for (let i = 0; i < supprimerUnProduit.length; i++) {
            //Au clic on supprime l'élément en question
            supprimerUnProduit[i].addEventListener("click", supprimerLeProduit);
            //Variables d'un élément avec l'id et la couleur
            let idASupprimer = panierExistant[i].id;
            let couleurASupprimer = panierExistant[i].color;

            function supprimerLeProduit() {
              //Demande de confirmation avant de supprimer l'élément
              if (
                window.confirm("Voulez-vous vraiment supprimer le produit ?")
              ) {
                //Suppression de l'élément du localstorage par id
                //et couleur
                panierExistant = panierExistant.filter(
                  (el) =>
                    el.id !== idASupprimer || el.color !== couleurASupprimer
                );
                //Mise à jour du localstorage
                localStorage.setItem("panier", JSON.stringify(panierExistant));
                //Actualisation de la page
                window.location.reload();
                //supprimerUnProduit[i].closest(".cart__item").remove();
              }
            }
          }

          //Bouton permettant la modification de la quantité des produits depuis le panier
          const modifierQuantite = document.querySelectorAll(".itemQuantity");

          //Boucle permettant de pouvoir modifier la quantité de chaque élément du panier
          for (let j = 0; j < modifierQuantite.length; j++) {
            //On écoute le changement sur l'input
            modifierQuantite[j].addEventListener("change", (e) => {
              //Affiche le message si la quantité n'est pas comprise entre 1 et 100
              if (
                modifierQuantite[j].value < 1 ||
                modifierQuantite[j].value > 100
              ) {
                alert("Choisissez une quantité entre 1 et 100");
                //Sinon enregistre la valeur indiquer dans l'input
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

//Regex permettant de choisir les caractères acceptés...
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
 *Fonction qui vérifie dans le formualire le nom, le prénom et la ville
 * @param {HTMLInputElement} elementHtml
 * @param {String} idErreur
 * @param {String} messageErreur
 */
function verificationNomPrenomVille(elementHtml, idErreur, messageErreur) {
  //Si le champ n'est pas renseigné renvoie ce message an rouge
  if (elementHtml.value == "") {
    let errorLastName = document.getElementById(idErreur);
    errorLastName.textContent = "Champ requis";
    errorLastName.style.color = "red";
    //S'il ne respecte pas la regex renvoie un autre message en rouge
  } else if (regexNomPrenomVille.test(elementHtml.value) == false) {
    let errorLastName = document.getElementById(idErreur);
    errorLastName.textContent = messageErreur;
    errorLastName.style.color = "red";
    //Sinon renvoie "Champ valide" en blanc
  } else {
    let validLastName = document.getElementById(idErreur);
    validLastName.textContent = "Champ valide";
    validLastName.style.color = "white";
  }
}

//-------------------------------Prénom----------------------------//
inputFirstName.addEventListener("change", function () {
  verificationNomPrenomVille(
    inputFirstName,
    "firstNameErrorMsg",
    "les caractères spéciaux ne sont pas acceptés"
  );
});

//--------------------------------Nom----------------------------//
inputLastName.addEventListener("change", function () {
  verificationNomPrenomVille(
    inputLastName,
    "lastNameErrorMsg",
    "les caractères spéciaux ne sont pas acceptés"
  );
});

//------------------------------Adresse--------------------------//
inputAddress.addEventListener("change", function () {
  if (inputAddress.value == "") {
    let errorAdress = document.getElementById("addressErrorMsg");
    errorAdress.textContent = "Champ requis";
    errorAdress.style.color = "red";
  } else if (regexAdressePostale.test(inputAddress.value) == false) {
    let errorAdress = document.getElementById("addressErrorMsg");
    errorAdress.textContent = "format d'adresse non valide";
    errorAdress.style.color = "red";
  } else {
    let validAdress = document.getElementById("addressErrorMsg");
    validAdress.textContent = "Champ valide";
    validAdress.style.color = "white";
  }
});

//--------------------------------Ville-----------------------------//
inputCity.addEventListener("change", function () {
  verificationNomPrenomVille(
    inputCity,
    "cityErrorMsg",
    "les caractères spéciaux ne sont pas acceptés"
  );
});

//------------------------------Email--------------------------------//
inputEmail.addEventListener("change", function () {
  if (inputEmail.value == "") {
    let errorEmail = document.getElementById("emailErrorMsg");
    errorEmail.textContent = "Champ requis";
    errorEmail.style.color = "red";
  } else if (regexEmail.test(inputEmail.value) == false) {
    let errorEmail = document.getElementById("emailErrorMsg");
    errorEmail.textContent = "Adresse email non valide";
    errorEmail.style.color = "red";
  } else {
    let validEmail = document.getElementById("emailErrorMsg");
    validEmail.textContent = "Champ valide";
    validEmail.style.color = "white";
  }
});
//Constante englobant tout le formulaire
const formulaire = document.querySelector(".cart__order__form");
//Lors de la soumission du formulaire
formulaire.addEventListener("submit", (e) => {
  e.preventDefault();
  //Si les regex sont valide après test
  if (
    regexNomPrenomVille.test(inputFirstName.value) == true ||
    regexNomPrenomVille.test(inputLastName.value) == true ||
    regexAdressePostale.test(inputAddress.value) == true ||
    regexNomPrenomVille.test(inputCity.value) == true ||
    regexEmail.test(inputEmail.value) == true
  ) {
    //On créé un tableau
    let idProducts = [];
    //Grâce à la boucle on récupère les id des produits
    for (let k = 0; k < panierExistant.length; k++) {
      idProducts.push(panierExistant[k].id);
    }
    //On créé un objet contenant les données du client et l'id du produit
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
    //méthode POST qui permet l'envoi
    const options = {
      method: "POST",
      body: JSON.stringify(donneesClient),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    //On envoie pui on est redirigé vers la page de confirmation
    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        document.location.href = `confirmation.html?id=${data.orderId}`;
      });
  }
});
