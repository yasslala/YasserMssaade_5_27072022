//Je récupère l'Id du produit
let url = new URL(location).searchParams;
let produitId = url.get("id");

const kanap = async () => {
  return await fetch(`http://localhost:3000/api/products/${produitId}`)
    .then((response) => response.json())
    .catch((error) => {
      alert("Error : " + error.message);
    });
};


//Affiche le canapé récupéré depuis son ID
const affichageKanap = async () => {
  const caracData = await kanap();

  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${caracData.imageUrl}" alt="${caracData.altTxt}">`;
  document.getElementById("title").innerHTML = `${caracData.name}`;
  document.getElementById("description").innerHTML = `${caracData.description}`;
  const colorsList = caracData.colors;

  let options = "";
  for (let color of colorsList) {
    options += `<option value="${color}"> ${color}</option>`;
  }

  document.getElementById("colors").innerHTML += options;
  document.getElementById("price").innerHTML = `${caracData.price}`;
};

affichageKanap();

const couleurProduit = document.getElementById("colors");
const quantiteProduit = document.getElementById("quantity");
const btnAjouter = document.getElementById("addToCart");
const nom = document.getElementById("title");
const prix = document.getElementById("price");

btnAjouter.addEventListener("click", ajouterLocalStorage);

function ajouterLocalStorage() {
  if (couleurProduit.value === "") {
    alert("Saisissez la couleur du canapé");
    return;
  }
  if (quantiteProduit.value < 1 || quantiteProduit.value > 100) {
    alert("Saisissez au moins un canapé");
    return;
  }

  const valeursProduit = {
    id: produitId,
    color: couleurProduit.value,
    quantity: quantiteProduit.value,
  };

  let panierExistant = JSON.parse(localStorage.getItem("panier"));

  if (!panierExistant) {
    alert("Votre produit a été ajouté");
    panierExistant = [valeursProduit];
  } else {
    let getProducts = panierExistant.find(
      (p) => p.id == valeursProduit.id && p.color == valeursProduit.color
    );

    if (getProducts) {
      alert("Votre produit a été ajouté");
      let newQuantity =
        Number(getProducts.quantity) + Number(valeursProduit.quantity);
      getProducts.quantity = newQuantity;
    } else {
      alert("Votre produit a été ajouté");
      panierExistant.push(valeursProduit);
    }
  }

  let nouveauPanier = JSON.stringify(panierExistant);
  localStorage.setItem("panier", nouveauPanier);
}
