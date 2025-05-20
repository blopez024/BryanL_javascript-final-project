// Borrowed from https://github.com/knjiang/dictionary-app
const DICTIONARY_API_KEY = '497f069e-3608-4b8e-8451-44a1302617aa';

// Borrowed from https://github.com/rmorey/image-search
const IMAGE_API_KEY = '22259626-cf646f94d7bf37e93a1753150';

const BASE_DICTIONARY_API = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';
const BASE_SOUND_API = `https://media.merriam-webster.com/audio/prons/en/us/mp3/`;
const BASE_IMAGE_API = `https://pixabay.com/api/`
const BASE_WIKI_API = `https://api.dictionaryapi.dev/api/v2/entries/en/`;

async function formattedData(word) {
    const wordData = await fetchWord(word);
    const definition = wordData[0];

    // sound folder && audio file
    const folder = word.charAt(0);
    const audio = definition?.hwi?.prs[0]?.sound?.audio ?? '';
    const soundData = getSoundURL(folder, audio);

    const image = await fetchImage(word);

    const wikiLink = await fetchWikiLink(word)

    const formattedInfo = {
        'pronunciation': definition.hwi.prs[0].mw,
        'syllabus': definition.hwi.hw,
        'part-of-speech': definition.fl,
        'sound-url': soundData,
        'definitions': definition.shortdef,
        'image': image,
        'wiki': wikiLink,
    }

    return formattedInfo;
}

async function fetchWord(word) {
    try {
        const DICTIONARY_API = BASE_DICTIONARY_API + `${word}?key=${DICTIONARY_API_KEY}`;
        const response = await fetch(DICTIONARY_API);

        if (!response.ok) {
            throw new Error(`[fetchWord - HTTP ERROR]: ${response}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`[fetchWord - Fetch ERROR]: ${error}`);
    }
}

function getSoundURL(location, sound) {
    const soundURL = BASE_SOUND_API + `${location}/${sound}.mp3`;
    return soundURL;
}

async function fetchImage(word) {
    try {
        const IMAGE_API = BASE_IMAGE_API + `?key=${IMAGE_API_KEY}&q=${word}`;
        const response = await fetch(IMAGE_API);

        if (!response.ok) {
            throw new Error(`[fetchImage - HTTP ERROR]: ${response}`);
        }

        const data = await response.json();
        return data.hits[0].webformatURL;
    } catch (error) {
        console.error(`[fetchImage - Fetch ERROR]: ${error}`);
    }
}

async function fetchWikiLink(word) {
    try {
        const WIKI_API = BASE_WIKI_API + `${word}`;
        const response = await fetch(WIKI_API);

        if (!response.ok) {
            throw new Error(`[fetchWikiLink - HTTP ERROR]: ${response}`);
        }

        const data = await response.json();
        return data[0].sourceUrls[0];
    } catch (error) {
        console.error(`[fetchWikiLink - Fetch ERROR]: ${error}`);
    }
}




export { formattedData };
