const breedSelect = document.getElementById('breed-select');
const subBreedSelect = document.getElementById('sub-breed-select');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const randomBtn = document.getElementById('random-btn');
const search = document.getElementById('search');
const favorites = document.getElementById('favorites');

let allBreeds = {};

async function fetchBreeds() {
    const res = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await res.json();
    allBreeds = data.message;
    updateBreedSelect();
}

function updateBreedSelect(filter = '') {
    breedSelect.innerHTML = '<option value="">Выбери породу</option>';
    Object.keys(allBreeds)
        .filter(b => b.includes(filter.toLowerCase()))
        .forEach(breed => {
            const option = document.createElement('option');
            option.value = breed;
            option.textContent = breed;
            breedSelect.appendChild(option);
        });
}

async function fetchImages(breed, sub = null) {
    let url = sub
        ? `https://dog.ceo/api/breed/${breed}/${sub}/images/random/5`
        : `https://dog.ceo/api/breed/${breed}/images/random/5`;
    loader.style.display = 'block';
    gallery.innerHTML = '';
    const res = await fetch(url);
    const data = await res.json();
    loader.style.display = 'none';
    displayImages(data.message, breed, sub);
}

function displayImages(images, breed, sub) {
    gallery.innerHTML = '';
    images.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = breed;
        img.title = sub ? `${breed} (${sub})` : breed;
        img.addEventListener('click', () => saveFavorite(url));
        gallery.appendChild(img);
    });
}

async function fetchRandomDog() {
    loader.style.display = 'block';
    gallery.innerHTML = '';
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();
    loader.style.display = 'none';
    const url = data.message;
    const parts = url.split('/');
    const breed = parts[parts.indexOf('breeds') + 1];
    displayImages([url], breed);
}

async function fetchSubBreeds(breed) {
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
    const data = await res.json();
    return data.message;
}

function saveFavorite(url) {
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favs.includes(url)) {
        favs.push(url);
        localStorage.setItem('favorites', JSON.stringify(favs));
        renderFavorites();
    }
}

function renderFavorites() {
    favorites.innerHTML = '';
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    favs.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        favorites.appendChild(img);
    });
}

// --- События ---

breedSelect.addEventListener('change', async () => {
    const breed = breedSelect.value;
    const subBreeds = await fetchSubBreeds(breed);

    if (subBreeds.length) {
        subBreedSelect.style.display = 'inline';
        subBreedSelect.innerHTML = '<option value="">Все подпороды</option>';
        subBreeds.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            opt.textContent = sub;
            subBreedSelect.appendChild(opt);
        });
    } else {
        subBreedSelect.style.display = 'none';
    }

    fetchImages(breed);
});

subBreedSelect.addEventListener('change', () => {
    const breed = breedSelect.value;
    const sub = subBreedSelect.value;
    fetchImages(breed, sub);
});

randomBtn.addEventListener('click', fetchRandomDog);

search.addEventListener('input', (e) => {
    updateBreedSelect(e.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
    fetchBreeds();
    fetchRandomDog();
    renderFavorites();
});
