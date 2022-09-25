//Récupération des données du localstorage
let panierExistant = JSON.parse(localStorage.getItem("panier"));

//Fonction générale permettant entre autres d'afficher les éléments du panier
const afficherElementsPanier = async () => {
  //Tous les produits sont affichés ici
  const conteneurPanier = document.getElementById("cart__items");

  //Si le panier est vide ce message s'affiche et le formulaire est retiré
  if (!panierExistant || panierExistant.length == 0) {
    alert("Votre panier est vide !");
    document.querySelector(".cart__order__form").style.display = "none";
  } else {
    //Tableau qui regroupe toutes les promesses
    const promessesProduits = [];
    //Boucle pour récupérer les produits dans le localstorage
    for (let valeur of panierExistant) {
      //Objet regroupant les éléments récupérés dans le localstorage
      let produitsDuPanier = {
        id: valeur.id,
        couleur: valeur.color,
        quantite: valeur.quantity,
      };
      //On ajoute toutes les promesses au tableau grâce à l'id des produits
      promessesProduits.push(
        fetch("http://localhost:3000/api/products/" + produitsDuPanier.id).then(
          (response) => response.json()
        )
      );
    }
    //La constante attend toutes les promesses du tableau
    const produitsComplets = await Promise.all(promessesProduits);
    //Variable quantité de produits et prix de tous les produits
    let quantiteTousLesProduits = 0;
    let prixTousLesProduits = 0;
    //Une fois qu'on a toutes les promesses, on peut injecter le html de tous les produits du panier
    produitsComplets.forEach((produit, index) => {
      //Insertion des éléments dans le HTML
      const leHtml = `<article id="${produit._id}" class="cart__item" data-id="${produit._id}" data-color="${panierExistant[index].color}">
      <div class="cart__item__img">
        <img src="${produit.imageUrl}" alt="${produit.altTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${produit.name}</h2>
          <p>${panierExistant[index].color}</p>
          <p>${produit.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté :</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panierExistant[index].quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${produit._id}" data-color="${panierExistant[index].color}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
      //On injecte le html pour chaque produit
      conteneurPanier.innerHTML += leHtml;
      //On obtient la quantité pour chaque produit puis la quantité totale de tous les produits du panier
      const quantiteUnProduit = Number(panierExistant[index].quantity);
      quantiteTousLesProduits += quantiteUnProduit;
      //On obtient le prix d'un type de produit par rapport à sa quantité et le prix de tous les produits
      const prixUnTypeDeProduit = quantiteUnProduit * Number(produit.price);
      prixTousLesProduits += prixUnTypeDeProduit;
    });
    //On injecte dans le html la quantité de tous les produits et le prix total du panier
    document.getElementById("totalQuantity").textContent =
      quantiteTousLesProduits;
    document.getElementById("totalPrice").textContent = prixTousLesProduits;

//----------------------------SUPPRIMER UN PRODUIT-------------------------//
    //Fonction supprimer qui prend en compte l'id et la couleur du produit
    function supprimerLeProduit(id, couleur) {
      //Demande de confirmation avant de supprimer l'élément
      if (window.confirm("Voulez-vous vraiment supprimer le produit ?")) {
        //Suppression de l'élément du localstorage par id et couleur
        panierExistant = panierExistant.filter(
          (el) => el.id !== id || el.color !== couleur
        );
        //Mise à jour du localstorage
        localStorage.setItem("panier", JSON.stringify(panierExistant));
        //Actualisation de la page
        window.location.reload();
      }
    }
    //Constante qui permettra de supprimer chaque produit au clic
    const supprimerUnProduit = document.querySelectorAll(".deleteItem");
    
    supprimerUnProduit.forEach((bouton) => {
      //Au clic
      bouton.addEventListener("click", () => {
        //Variables d'un élément avec l'id et la couleur
        let idASupprimer = bouton.getAttribute("data-id");
        let couleurASupprimer = bouton.getAttribute("data-color");
        //J'exécute la fonction supprimer grâce à ces deux variables
        supprimerLeProduit(idASupprimer, couleurASupprimer);
      });
    });
 //-----------------------------MODIFIER LA QUANTITE-----------------------//
    //Bouton permettant la modification de la quantité des produits depuis le panier
    const modifierQuantite = document.querySelectorAll(".itemQuantity");

    //Boucle permettant de pouvoir modifier la quantité de chaque élément du panier
    modifierQuantite.forEach((input, index) => {
      input.addEventListener("change", (e) => {
        //Affiche le message si la quantité n'est pas comprise entre 1 et 100
        if (
          modifierQuantite[index].value < 1 ||
          modifierQuantite[index].value > 100
        ) {
          alert("Choisissez une quantité entre 1 et 100");
          //Sinon enregistre la valeur indiquer dans l'input
        } else {
          panierExistant[index].quantity = Number(e.target.value);
          localStorage.setItem("panier", JSON.stringify(panierExistant));
          quantiteTousLesProduits = panierExistant.reduce(
            (acc, encours) => acc + encours.quantity,
            0
          );
//--------------------------------PRIX TOTAL-------------------------------//
          let prixTotal = 0;
          //Grâce à nos promesses et pour chacune d'elle on récupère le
          //prix de chaque produit qu'on multiplie par la quantité du produit
          produitsComplets.forEach((produit, index) => {
            prixTotal += produit.price * panierExistant[index].quantity;
          });
          //On obtient le prix de tous les produits
          prixTousLesProduits = prixTotal;
          //On injecte le prix et la quantité de tous les produits dans le html
          document.getElementById("totalQuantity").textContent =
            quantiteTousLesProduits;
          document.getElementById("totalPrice").textContent =
            prixTousLesProduits;
        }
      });
    });
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
    //méthode POST qui permet l'envoi des données
    const options = {
      method: "POST",
      body: JSON.stringify(donneesClient),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    //On envoie puis on est redirigé vers la page de confirmation
    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        document.location.href = `confirmation.html?id=${data.orderId}`;
      });
  }
});
