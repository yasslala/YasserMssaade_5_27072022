//Je récupère l'Id du produit
let url = new URL(location).searchParams;
let produitId = url.get("id");

//Affiche le canapé récupéré depuis son ID
const affichageUnCanape = async () => {
  return await fetch(`http://localhost:3000/api/products/${produitId}`)
    .then((response) => response.json())
    .catch((error) => {
      alert("Error : " + error.message);
    });
};
const affichageKanap = async () => {
  const caracData = await affichageUnCanape();

  //Chaque donnée est injectée dans le HTML
  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${caracData.imageUrl}" alt="${caracData.altTxt}">`;
  document.getElementById("title").innerHTML = `${caracData.name}`;
  document.getElementById("description").innerHTML = `${caracData.description}`;
  const colorsList = caracData.colors;
  //Boucle pour les différentes couleurs d'un même produit
  let options = "";
  for (let color of colorsList) {
    options += `<option value="${color}"> ${color}</option>`;
  }
  document.getElementById("colors").innerHTML += options;
  document.getElementById("price").innerHTML = `${caracData.price}`;
};

affichageKanap();

//Constantes pour chaque élément du produit
const couleurProduit = document.getElementById("colors");
const quantiteProduit = document.getElementById("quantity");
const btnAjouter = document.getElementById("addToCart");
const nom = document.getElementById("title");
const prix = document.getElementById("price");

//Au clic j'ajoute le ou les produits au localstorage
btnAjouter.addEventListener("click", ajouterLocalStorage);

function ajouterLocalStorage() {
  //Si la couleur n'est pas sélectionnée le message s'affiche
  if (couleurProduit.value === "") {
    alert("Saisissez la couleur du canapé");
    return;
  }
  //Si la quantité est < à 1 ou > à 100 le message s'affiche
  if (quantiteProduit.value < 1 || quantiteProduit.value > 100) {
    alert("Saisissez une quantité entre 1 et 100");
    return;
  }

  //Création d'un objet contenant id, couleur et quantité pour le localstorage
  const valeursProduit = {
    id: produitId,
    color: couleurProduit.value,
    quantity: quantiteProduit.value,
  };

  //récupération des données dans le localstorage
  let panierExistant = JSON.parse(localStorage.getItem("panier"));

  //Si le panier est vide cela créé un tableau avec le produit et ses
  //caractéristiques
  if (!panierExistant) {
    alert("Votre produit a été ajouté");
    panierExistant = [valeursProduit];
    //Sinon on cherche si le produit qu'on ajoute a la même id et la même
    //couleur qu'un produit du panier
  } else {
    let getProducts = panierExistant.find(
      (p) => p.id == valeursProduit.id && p.color == valeursProduit.color
    );
    //S'il a la même id et couleur alors on change uniquement la quantité
    if (getProducts) {
      alert("Votre produit a été ajouté");
      let newQuantity =
        Number(getProducts.quantity) + Number(valeursProduit.quantity);
      getProducts.quantity = newQuantity;
      //Sinon on ajoute le produit au panier
    } else {
      alert("Votre produit a été ajouté");
      panierExistant.push(valeursProduit);
    }
  }
  //On convertit l'objet JS en Json et on l'envoie dans le localstorage
  let nouveauPanier = JSON.stringify(panierExistant);
  localStorage.setItem("panier", nouveauPanier);
}
