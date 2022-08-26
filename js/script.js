const fetchKanap = async () => {
    return await fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .catch((error) => {
        alert("Error : " + error.message)
    });
};

const affichageCanape = async () => {
    const dataCanape = await fetchKanap();
    console.log(dataCanape);

    // Ce tableau va contenir tous les éléments HTML des canapés
    let cartesHtml = [];

    // Pour chaque canapé, on crée un élément HTML
    // et on l'ajoute au tableau "cartesHtml"
    for (let canape of dataCanape) {
        // On crée le HTML
        const html = `<a href="./product.html?id=${canape._id}">
            <article>
                <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                <h3 class="productName">${canape.name}</h3>
                <p class="productDescription">${canape.description}</p>
            </article>
        </a>`
        // On l'ajoute au tableau
        cartesHtml.push(html)
    }

    // Une fois qu'on a tous les éléments HTML dans le tableau "cartesHtml",
    // On ajoute tout dans le DOM (et on enlève les virgules qui séparent les éléments du tableau)
    document.getElementById("items").innerHTML = cartesHtml.join('')

};

affichageCanape();