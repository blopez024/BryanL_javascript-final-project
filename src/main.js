import { generateRandomWord } from './data/words.js';
import { formattedData } from './server.js';

const randomButton = document.getElementById('random');

const input = document.getElementById('search-input');
const searchbar = document.getElementById('searchbar');

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const wordDiv = document.getElementById('word');
const pronunciationP = document.getElementById('pronunciation');
const soundButton = document.getElementById('sound');
const partOfSpeech = document.getElementById('parts-of-speech')
const meaningList = document.getElementById('meaning');
const imageDiv = document.getElementById('image')

const mainDiv = document.getElementById('main-content')
const errorDiv = document.getElementById('word-not-found')

// Get Random Word
randomButton.addEventListener('click', async () => {
    const randomWord = generateRandomWord();
    input.value = randomWord;
    await loadData(randomWord);
});

// Search Bar Highlight
input.addEventListener('focus', () => {
    searchbar.classList.add('focused');
});

input.addEventListener('blur', () => {
    searchbar.classList.remove('focused');
});

// Search Bar Functionality
async function handleSearch() {
    const query = input.value.trim().toLowerCase();
    if (query !== '') {
        await loadData(query);
    }
}

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

searchButton.addEventListener('click', handleSearch);

// Audio 
let currentAudio = null;

function resetAudio() {
    const newButton = soundButton.cloneNode(true);
    soundButton?.parentNode?.replaceChild(newButton, soundButton);
    return newButton;
}

function setAudio(soundURL) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(soundURL);
    const freshButton = resetAudio();
    freshButton.addEventListener('click', () => {
        currentAudio.play();
    })
}

// Load Data
async function loadData(word) {
    try {
        const data = await formattedData(word);

        errorDiv.classList.add('hideElement')
        mainDiv.classList.remove('hideElement');

        setAudio(data['sound-url']);

        wordDiv.innerHTML = word;
        pronunciationP.innerHTML = data['pronunciation'];
        partOfSpeech.innerHTML = data['part-of-speech']

        meaningList.innerHTML = '';
        data['definitions'].forEach((definition, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${definition}`;
            meaningList.appendChild(li);
        })

        imageDiv.innerHTML = `
        <img src="${data['image']}" alt="">
        `

    } catch (error) {
        console.log(error);
        mainDiv.classList.add('hideElement');
        errorDiv.classList.remove('hideElement')

    }
}
