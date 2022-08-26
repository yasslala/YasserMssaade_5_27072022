//Je récupère l'Id du produit
let url = (new URL(location)).searchParams;
let produitId = url.get("id");
console.log(produitId);


const kanap = async () => {
    return await fetch(`http://localhost:3000/api/products/${produitId}`)
    .then((response) => response.json())
    .catch((error) => {
        alert("Error : " + error.message)
    });
};


const affichageKanap = async () => {
    const caracData = await kanap();
    
    document.querySelector(".item__img").innerHTML = `<img src="${caracData.imageUrl}" alt="${caracData.altTxt}">`;
    document.getElementById("title").innerHTML = `${caracData.name}`;
    document.getElementById("description").innerHTML = `${caracData.description}`;
    const colorsList = caracData.colors;

    let options = '';
    for (let color of colorsList) {
       options += `<option value="${color}"> ${color}</option>`
    }
    
    document.getElementById("colors").innerHTML += options
    document.getElementById("price").innerHTML = `${caracData.price}`;
};  

affichageKanap();

const couleurProduit = document.getElementById("colors");
const quantiteProduit = document.getElementById("quantity");
const btnAjouter = document.getElementById("addToCart");


btnAjouter.addEventListener ("click", ajouterLocalStorage);

function ajouterLocalStorage() {
    if(couleurProduit.value ===""){
        alert("Saisissez la couleur du canapé")
        return
    };
    if(quantiteProduit.value < 1){
        alert("Saisissez au moins un canapé")
        return
    };
    
    const valeursProduit = {
        id: produitId,
        color: couleurProduit.value,
        quantity: quantiteProduit.value,
    };

    let panierExistant = JSON.parse(localStorage.getItem("panier"));

    if (!panierExistant) {
        panierExistant = [valeursProduit]
    } else {
        panierExistant.push(valeursProduit)
    }

    let nouveauPanier = JSON.stringify(panierExistant);
    localStorage.setItem("panier", nouveauPanier);

};



/*
for(let i = 0; i < produitTableau.length; i++){
            if(produitTableau[i].id === produitId && produitTableau[i].color === couleurProduit.value){
                produitTableau += quantiteProduit.value
            }
        };

produitTableau = [];
        produitTableau.push(valeursProduit);
        let stockage = JSON.stringify(valeursProduit);
        localStorage.setItem("objet", stockage);






let produitTableau = JSON.parse(localStorage.getItem("valeursProduit"));


*/