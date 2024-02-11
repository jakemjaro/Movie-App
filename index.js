const apiKey = "e0494b660f3bddebb49e11dbe99b328a";
const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const imageApi = `https://image.tmdb.org/t/p/w500/`;
const searchbar  = document.querySelector("#searchbar");
const searchform = document.querySelector("#search-form");
const mainElement = document.querySelector("main");
let page = 1;
const navLinks = document.querySelectorAll(".nav-menu div");
const popular = document.querySelector("#Popular");
const gallery = document.querySelector("#Gallery");

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

function clearMain() {
    mainElement.innerHTML = "";
}

function showItems(items) {
    const pageContent = items.map(createMovieCard).join("");
    mainElement.innerHTML += pageContent;
}

navLinks.forEach(link => {
    link.addEventListener('click',() => {
        document.querySelector(".current")?.classList.remove("current");
        link.classList.add("current");
    });
});

async function getAndShowResults(url) {
    const response = await getResults(url);
    const popularList = response.results;

    if (response && popularList) {
        clearMain();
        showItems(popularList);
    }
}

searchform.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (searchbar.value) {
        const query = searchbar.value.trim();
        const searchURL = `${searchApi}${query}&page=${page}`;

        const responseObj = await getResults(searchURL);
        const movieList = responseObj.results;

        if (responseObj && movieList) {
            clearMain();
            showItems(movieList);
        }

        document.querySelector("h2").innerHTML = "Results";

        navLinks.forEach(link => {
            if (link.classList.contains("current")) {
                link.classList.remove("current");
            }
        });
    }
});

popular.addEventListener('click', async () => {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
    await getAndShowResults(url);

    document.querySelector("h2").innerHTML = "Popular";
});

async function showGallery() {
    const date = new Date();
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=${date.getFullYear()-1}`;
    await getAndShowResults(url);

    document.querySelector("h2").innerHTML = "Gallery";
}

gallery.addEventListener('click', showGallery);
