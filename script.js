const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 10;
const apiKey = 'DEMO_KEY'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};


function createDOMNodes(page){
    let currentArray = [];

    if(page === 'results'){
        currentArray = resultsArray;
     }else{
        currentArray = Object.values(favorites);
        page = 'favorites';
    }
    // console.log(page);
    if(page ==='favorites'){
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }else{
        favoritesNav.classList.add('hidden');
        resultsNav.classList.remove('hidden');
    }

    currentArray.forEach((result) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = 'blank';

        const img = document.createElement('img');
        img.src = result.url;
        img.alt = "NASA Picture of the Day";
        img.loading = 'lazy';
        img.classList.add('card-img-top');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if ( page === 'results'){
            saveText.textContent = 'Add to favourites';
            saveText.setAttribute('onclick',`saveFavorite('${result.url}')`);
        }else{
            saveText.textContent = 'Remove from favourites';
            saveText.setAttribute('onclick',`removeFavorite('${result.url}')`);
        }

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
    
        const date = document.createElement('strong');
        date.textContent = result.date;
    
        result.copyright === undefined ? result.copyright = '' : false;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${result.copyright}`;
    
    
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(img);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    })

    window.scrollTo({
        top:0,
        behavior: 'instant'
    })

    loader.classList.add('hidden');
    
}
 
function updateDOM(page) {
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);    
}

async function getNasaPictures() {
    try{
        const resp = await fetch(apiUrl);
        resultsArray = await resp.json()
        if(resultsArray.error){
            console.log('updateDOM error');
            updateDOM('error');
        }else{
            console.log('updateDOM results');
            updateDOM('results');
        }
   }catch(err){
    console.log('err: ', err);
}
}

function saveFavorite(itemUrl) {
    resultsArray.forEach((item) =>{
        if (item.url.includes(itemUrl) && !favorites[itemUrl] ) {
            favorites[itemUrl] = item;
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}



getNasaPictures();