const generationLimits = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 898],
    9: [899, 1000]
};

const typeTranslations = {
    "water": "Água",
    "fire": "Fogo",
    "grass": "Planta",
    "electric": "Elétrico",
    "bug": "Inseto",
    "normal": "Normal",
    "poison": "Veneno",
    "psychic": "Psíquico",
    "fairy": "Fada",
    "fighting": "Lutador",
    "ghost": "Fantasma",
    "dark": "Sombrio",
    "dragon": "Dragão",
    "steel": "Aço",
    "ice": "Gelo",
    "rock": "Pedra",
    "ground": "Terrestre",
    "flying": "Voador"
};

document.getElementById('generation-select').addEventListener('change', (event) => {
    const generation = event.target.value;
    const [start, end] = generationLimits[generation];
    fetchPokemonData(start, end);
});

async function fetchPokemonData(start, end) {
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.innerHTML = '';

    for (let id = start; id <= end; id++) {
        const pokemonResponse = await fetch(`${apiUrl}${id}`);
        const pokemonData = await pokemonResponse.json();

        const cardHtml = createPokemonCard(pokemonData);
        pokemonContainer.innerHTML += cardHtml;
    }
}

function createPokemonCard(pokemonData) {
    const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    const defaultSprite = pokemonData.sprites.front_default;
    const shinySprite = pokemonData.sprites.front_shiny;
    const types = pokemonData.types.map(type => typeTranslations[type.type.name]).join(", ");
    const id = pokemonData.id;

    return `
        <div class="col-md-3">
            <div class="pokemon-card card">
                <div class="card-body">
                    <h5 class="card-title text-center">${pokemonName} (ID: ${id})</h5>
                    <p class="text-center">Tipos: ${types}</p>
                    <img src="${defaultSprite}" alt="${pokemonName}" class="pokemon-img card-img-top">
                    <p class="text-center mt-2"><strong>Shiny:</strong></p>
                    <img src="${shinySprite}" alt="${pokemonName} Shiny" class="pokemon-img">
                </div>
            </div>
        </div>
    `;
}

async function fetchTCGData() {
    const tcgUrl = 'https://api.pokemontcg.io/v2/cards';
    const response = await fetch(tcgUrl);
    const data = await response.json();
    const tcgDecksContainer = document.getElementById('tcg-decks');
    tcgDecksContainer.innerHTML = '';

    data.data.forEach(card => {
        const tcgCardHtml = createTCGCard(card);
        tcgDecksContainer.innerHTML += tcgCardHtml;
    });
}

function createTCGCard(card) {
    // Converter preço em dólares para reais (assumindo uma taxa de 1 USD = 5.00 BRL)
    const priceInReal = card.cardmarket ? (card.cardmarket.prices.averageSellPrice * 5).toFixed(2) : 'N/A';

    return `
        <div class="col-md-3 tcg-card">
            <img src="${card.images.small}" alt="${card.name}" class="img-fluid">
            <div class="card-details">
                <p><strong>Nome:</strong> ${card.name}</p>
                <p><strong>Versão:</strong> ${card.set.name}</p>
                <p><strong>Preço:</strong> R$ ${priceInReal}</p>
                <p><strong>Raridade:</strong> ${card.rarity}</p>
            </div>
        </div>
    `;
}

fetchPokemonData(1, 151);
fetchTCGData();
