let galleryPage = 1;
let popularPage = 1;
let searchPage = 1;
let onGallery = true;
let onPopular = false;
let onSearch = false;
const date = new Date();
const apiKey = "e0494b660f3bddebb49e11dbe99b328a";
let searchApi = `https://api.themoviedb.org/3/search/movie?&api_key=${apiKey}&query=`;
const imageApi = `https://image.tmdb.org/t/p/w500/`;
let galleryURL = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&primary_release_year=${date.getFullYear()-1}&page=`;
let popularURL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=`;
const searchbar  = document.querySelector("#searchbar");
const searchform = document.querySelector("#search-form");
const mainElement = document.querySelector("main");
const navLinks = document.querySelectorAll(".nav-menu button");
const popularButton = document.querySelector("#Popular");
const galleryButton = document.querySelector("#Gallery");

async function getResults(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Bad Response");
        }
        return await response.json();
    } catch (err) {
        console.log(err);
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

function displayItems(items) {
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
    const movieList = response.results;

    if (response && movieList) {
        displayItems(movieList);
    }
}

async function handleSearch() {
    if (searchbar.value) {
        const query = searchbar.value.trim();
        const searchURL = `${searchApi}${query}&page=${searchPage}`;
        
        await getAndShowResults(searchURL);
    }
}

searchform.addEventListener('submit', async (event) => {
    event.preventDefault();
    onSearch = true;
    onGallery = false;
    onPopular = false;
    clearMain();
    await handleSearch();

    document.querySelector("h2").innerHTML = "Results";

    navLinks.forEach(link => {
        link.classList?.remove("current");
    });
});

popularButton.addEventListener('click', async () => {
    clearMain();
    await getAndShowResults(popularURL);
    document.querySelector("h2").innerHTML = "Popular";
    onGallery = false;
    onPopular = true;
});

async function showGallery() {
    clearMain();
    await getAndShowResults(galleryURL);
    document.querySelector("h2").innerHTML = "Gallery";
    onGallery = true;
    onPopular = false;
}

galleryButton.addEventListener('click', showGallery);

async function loadMore() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
        if (onGallery) {
            galleryPage++;
            await getAndShowResults(galleryURL+galleryPage);
        } else if (onPopular) {
            popularPage++;
            await getAndShowResults(popularURL+popularPage);
        } else if (onSearch) {
            searchPage++;
            await handleSearch();
        }
    }
}

window.addEventListener('scroll', loadMore);