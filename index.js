const apiKey = "e0494b660f3bddebb49e11dbe99b328a";
const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const imageApi = `https://image.tmdb.org/t/p/w500/`;
const searchbar  = document.querySelector("#searchbar");
const searchform = document.querySelector("#search-form");
const mainElement = document.querySelector("main");
let page = 1;

async function getResults(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Bad Response");
        }
        return await response.json();
    } catch (err) {
        console.log(err.message);
        return null;
    }
}

function createMovieCard(movie) {
    const {poster_path, original_title, release_date, overview} = movie;
    const imageURL = imageApi + poster_path;
    newDate = `${release_date.slice(5,7)}/${release_date.slice(8)}/${release_date.slice(0,4)}`

    const cardElement = `
        <div class="movie-card">
            <div class="image-container">
                <img src="${imageURL}" alt="${original_title}">
            </div>
            <div class="movie-card-details">
                <h3>${original_title}</h3>
                <h5>${newDate}</h5>
                <p>${overview}</p>
            </div>
        </div>
    `;

    if (poster_path && original_title && release_date && overview) {
        return cardElement;
    } else {
        return "";
    }
}

function clearHTML() {
    mainElement.innerHTML = "";
}


searchform.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchbar.value.trim();
    const searchURL = `${searchApi}${query}&page=${page}`;

    const responseObj = await getResults(searchURL);
    const movieList = responseObj.results;

    if (responseObj && movieList) {
        const pageContent = movieList.map(createMovieCard).join("");
        clearHTML();
        mainElement.innerHTML += pageContent;
    }
});

