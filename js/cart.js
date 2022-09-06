let panierExistant = JSON.parse(localStorage.getItem("panier"));
console.log(panierExistant);

const afficherElementsPanier = async () => {
  const conteneurPanier = document.getElementById("cart__items");

  if (!panierExistant /*|| panierExistant == 0*/) {
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


          //Suppression des produits dans le panier
          const supprimerUnProduit = document.querySelectorAll(".deleteItem");

          for (let i = 0; i < supprimerUnProduit.length; i++) {
            supprimerUnProduit[i].addEventListener("click", supprimerLeProduit);

            let idASupprimer = panierExistant[i].id;
            let couleurASupprimer = panierExistant[i].color;

            function supprimerLeProduit() {
              
              panierExistant = panierExistant.filter(
                (el) => el.id !== idASupprimer || el.color !== couleurASupprimer
              );

              localStorage.setItem("panier", JSON.stringify(panierExistant));
              window.location.href = "cart.html";
              //document.querySelector(".cart__item").remove();
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
                panierExistant[j].quantity = parseInt(e.target.value);
                localStorage.setItem("panier", JSON.stringify(panierExistant));
              }
            });
          }
          
        });
    }
  }
};
afficherElementsPanier();


//-----------------------------Formulaire--------------------------------//


const regexNomPrenomVille = new RegExp("^[a-zA-Zàâéèëêïîôùüç -]{1,60}$");
const regexEmail = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
const regexAdressePostale = new RegExp("^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");

const formulaire = document.querySelector(".cart__order__form");

let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputAddress = document.getElementById("address");
let inputCity = document.getElementById("city");
let inputEmail = document.getElementById("email");

//-------------------------------Prénom----------------------------//
inputFirstName.addEventListener("change", function(e) {

  if(inputFirstName.value == ""){

    let errorFirstName = document.getElementById("firstNameErrorMsg");
    errorFirstName.textContent = "Champs prénom requis"
    errorFirstName.style.color = "red";
    e.preventDefault();

  }else if(regexNomPrenomVille.test(inputFirstName.value) == false){

    let errorFirstName = document.getElementById("firstNameErrorMsg");
    errorFirstName.textContent = "lettres sans accents, minuscules et majusules ainsi que traits d'union sont acceptés"
    errorFirstName.style.color = "red";
    e.preventDefault();
  }
})

//--------------------------------Nom----------------------------//
inputLastName.addEventListener("change", function(e) {

  if(inputLastName.value == ""){

    let errorLastName = document.getElementById("lastNameErrorMsg");
    errorLastName.textContent = "Champs nom requis"
    errorLastName.style.color = "red";
    e.preventDefault();

  }else if(regexNomPrenomVille.test(inputLastName.value) == false){

    let errorLastName = document.getElementById("lastNameErrorMsg");
    errorLastName.textContent = "lettres sans accents, minuscules et majusules ainsi que traits d'union sont acceptés"
    errorLastName.style.color = "red";
    e.preventDefault();
  }
})

//------------------------------Adresse--------------------------//
inputAddress.addEventListener("change", function(e) {

  if(inputAddress.value == ""){

    let errorAdress = document.getElementById("addressErrorMsg");
    errorAdress.textContent = "Champs adresse requis"
    errorAdress.style.color = "red";
    e.preventDefault();

  }else if(regexAdressePostale.test(inputAddress.value) == false){

    let errorAdress = document.getElementById("addressErrorMsg");
    errorAdress.textContent = "lettres sans accents, minuscules et majusules ainsi que traits d'union sont acceptés"
    errorAdress.style.color = "red";
    e.preventDefault();
  }
})

//--------------------------------Ville-----------------------------//
inputCity.addEventListener("change", function(e) {

  if(inputCity.value == ""){

    let errorCity = document.getElementById("cityErrorMsg");
    errorCity.textContent = "Champs ville requis"
    errorCity.style.color = "red";
    e.preventDefault();

  }else if(regexNomPrenomVille.test(inputCity.value) == false){

    let errorCity = document.getElementById("cityErrorMsg");
    errorCity.textContent = "lettres sans accents, minuscules et majusules ainsi que traits d'union sont acceptés"
    errorCity.style.color = "red";
    e.preventDefault();
  }
})

//------------------------------Email--------------------------------//
inputEmail.addEventListener("change", function(e) {

  if(inputEmail.value == ""){

    let errorEmail = document.getElementById("emailErrorMsg");
    errorEmail.textContent = "Champs email requis"
    errorEmail.style.color = "red";
    e.preventDefault();

  }else if(regexEmail.test(inputEmail.value) == false){

    let errorEmail = document.getElementById("emailErrorMsg");
    errorEmail.textContent = "lettres sans accents, minuscules et majusules ainsi que traits d'union sont acceptés"
    errorEmail.style.color = "red";
    e.preventDefault();
  }
})












/*

let lesPrix = [];

          for(let k = 0; k < panierExistant.length; k++){

            let prixDeChaqueProduit = value[k].price;
            lesPrix.push(prixDeChaqueProduit)
          }
          console.log(lesPrix);
          const reducer = (accumulator, currentValue) => accumulator + currentValue;
          const montantTotal = lesPrix.reduce(reducer, 0);

          document.getElementById("totalPrice").textContent = `${montantTotal}`;

*/
