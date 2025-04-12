const breedSelect = document.getElementById('breed-select');
const randomDogBtn = document.getElementById('random-dog-btn');
const dogImage = document.getElementById('dog-image');

// Получить список пород
async function fetchBreeds() {
    const res = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await res.json();

    Object.keys(data.message).forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
        breedSelect.appendChild(option);
    });
}

// Показать случайную собаку
async function showRandomDog() {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();
    dogImage.src = data.message;
}

// Показать собаку по породе
async function showBreedDog(breed) {
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    const data = await res.json();
    dogImage.src = data.message;
}

// События
randomDogBtn.addEventListener('click', showRandomDog);
breedSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        showBreedDog(e.target.value);
    }
});

// Инициализация
fetchBreeds();
showRandomDog();
