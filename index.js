const URL_MOVIE =
  "https://us-central1-itfighters-movies.cloudfunctions.net/api/movie";
const FAVOURITIES = "fav";

let allMovies = [];
let filteredMovies = [];
let favouritesMovies = [];
let favFilteredMovies = [];
let allMoviesList;
let searchInput;
let searchButton;
let tableWithDetails;
let navButtonBest;
let navButtonFav;
let hamburger;
let navigation;
let activeElements;

window.onload = () => {
  getAllMovies();
  bindDOMElements();
  addEventToInput();
  addEventsToButtons();
  getFromLocalStorage();
};

function getFromLocalStorage() {
  let dataFromLocalStorage = localStorage.getItem(FAVOURITIES);
  if (dataFromLocalStorage != null && dataFromLocalStorage.length >= 1) {
    favouritesMovies = JSON.parse(dataFromLocalStorage);
  }
}

function addElementToLocalStorage(tab) {
  let obj = JSON.stringify(tab);
  localStorage.setItem(FAVOURITIES, obj);
}

function showDetails(event) {
  event.preventDefault();
  document.querySelector(".modal-wrap").classList.add("active");
  document.querySelector(".article").classList.add("blur");
  document.querySelector("span.hide").addEventListener("click", function () {
    document.querySelector(".modal-wrap").classList.remove("active");
    document.querySelector(".article").classList.remove("blur");
    clearList(tableWithDetails);
  });

  let idDetails = parseInt(event.target.getAttribute("id"));
  let urlDetails = URL_MOVIE + "/" + idDetails;
  getFunction(urlDetails);
}

let getAllMovies = function () {
  fetch(URL_MOVIE)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject(response);
      }
    })
    .then(function (response) {
      allMovies = response;
      return allMovies;
    })
    .catch((error) => {
      console.warn(error);
    });
};

function bindDOMElements() {
  searchInput = document.getElementById("search");
  searchButton = document.getElementsByClassName("searchButton")[0];
  allMoviesList = document.getElementById("allMoviesList");
  tableWithDetails = document.getElementById("tableWithDetails");
  navButtonBest = document.getElementById("best");
  navButtonFav = document.getElementById("favourites");
  tableDetailsHead = document.getElementById("tableWithDetailsHead");
  hamburger = document.querySelector(".hamburger");
  navigation = document.querySelector(".navigation");
  activeElements = document.querySelectorAll(".active");
}

function addEventToInput() {
  searchInput.addEventListener("input", (event) => {
    event.preventDefault();
    handleMoviesInputChange(event);
  });
}
function handleMoviesInputChange(event) {
  let title = event.target.value;
  if (title == "") {
    clearList(allMoviesList);
  } else {
    filteredMovies = [];
    clearList(allMoviesList);
    filteredMovies = filterMovies(title);
    createListWithAllMovies(filteredMovies);
  }
}

function filterMovies(searchText) {
  searchText = searchText.toLocaleLowerCase().trim();
  return allMovies.filter((movie) => {
    if (movie.title && movie.title.toLocaleLowerCase().includes(searchText)) {
      return true;
    }
    return false;
  });
}

function addEventsToButtons() {
  navButtonBest.addEventListener("click", (event) => {
    event.preventDefault();
    showBestMovies();
  });
  navButtonFav.addEventListener("click", (event) => {
    event.preventDefault();
    showFavMovies();
  });
  hamburger.addEventListener("click", (event) => {
    event.preventDefault();
    hamburger.classList.toggle("hamburger__active");
    navigation.classList.toggle("navigation__active");
  });
}

function clearList(list) {
  list.innerHTML = "";
}

function showBestMovies() {
  return allMovies.filter((movie) => {
    if (movie.rate >= 5) {
      filteredMovies.push(movie);
      createListWithAllMovies(filteredMovies);
      clearInput();
    }
  });
}

function createListWithAllMovies(array) {
  clearList(allMoviesList);
  array.forEach((movie) => {
    let titleMovie = movie.title;
    let imgMovie = movie.imgSrc;
    let divContainer = document.createElement("div");
    divContainer.setAttribute("class", "imagesContainer");
    let divTitle = document.createElement("div");
    divTitle.setAttribute("class", "divTitle");
    divTitle.innerText = titleMovie;
    divContainer.appendChild(divTitle);

    let divImg = document.createElement("div");
    divImg.setAttribute("class", "divImg");
    let imgIn = document.createElement("img");
    imgIn.setAttribute("src", imgMovie ? imgMovie : "alt.png");
    imgIn.setAttribute("alt", "picture unavailable");
    divImg.appendChild(imgIn);
    divContainer.appendChild(divImg);
    let divWithButtons = document.createElement("div");
    divWithButtons.setAttribute("class", "buttons");
    let tdDetailsButton = document.createElement("button");
    tdDetailsButton.setAttribute("class", "buttonDetails");
    tdDetailsButton.innerHTML = "Details";
    tdDetailsButton.setAttribute("id", movie.id);
    tdDetailsButton.addEventListener("click", showDetails);
    divWithButtons.appendChild(tdDetailsButton);
    let addToFavButton = document.createElement("button");
    addToFavButton.setAttribute("class", "buttonFav");
    addToFavButton.innerText = "Add to fav";
    addToFavButton.setAttribute("id", movie.id);
    addToFavButton.addEventListener("click", addToFav);
    divWithButtons.appendChild(addToFavButton);
    divContainer.appendChild(divWithButtons);
    allMoviesList.appendChild(divContainer);
  });
}

function addToFav(event) {
  event.preventDefault();
  let movieId = parseInt(event.target.getAttribute("id"));
  let movie = { id: movieId };
  favouritesMovies.push(movie);
  alert("Dodałes film do ulubionych");
  addElementToLocalStorage(favouritesMovies);
}

function showFavMovies() {
  if (favouritesMovies == []) {
    alert("You have not added any movie to favourities yet.");
  } else {
    favFilteredMovies = [];
    favouritesMovies.forEach((item) => {
      let movie = allMovies.find((movie) => {
        if (movie.id === item.id) {
          return true;
        }
        return false;
      });
      favFilteredMovies.push(movie);
      createListWithAllMovies(favFilteredMovies);
      clearInput();
    });
  }
}

function getFunction(urlDetails) {
  fetch(urlDetails)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject(response);
      }
    })
    .then(function (response) {
      clearList(allMoviesList);
      let detailsAboutMovie = response;
      createTableWithDetails(detailsAboutMovie);
    })
    .catch((error) => {
      console.warn(error);
    });
}

function createTableWithDetails(movie) {
  function createLi(value) {
    let newLi = document.createElement("li");
    newLi.innerText = value;
    ul.appendChild(newLi);
  }
  let titleMovie = movie.title;
  let yearMovie = movie.year;
  let movieCast = movie.cast;
  let movieGenres = movie.genres;
  let rateMovie = movie.rate;
  let imgMovie = movie.imgSrc;
  let detailsCover = document.createElement("div");
  detailsCover.setAttribute("class", "detailsCover");
  let imgDiv = document.createElement("div");
  imgDiv.setAttribute("class", "imgDiv");
  let imgIn = document.createElement("img");
  imgIn.setAttribute("src", imgMovie ? imgMovie : "alt.png");
  imgIn.setAttribute("alt", "Obrazek się nie wyświetla");
  imgDiv.appendChild(imgIn);
  detailsCover.appendChild(imgDiv);
  let divDetails = document.createElement("div");
  divDetails.setAttribute("class", "divDetails");
  let ul = document.createElement("ul");
  createLi(titleMovie);
  createLi(yearMovie);
  createLi(movieCast);
  createLi(movieGenres);
  createLi(rateMovie);
  divDetails.appendChild(ul);
  detailsCover.appendChild(divDetails);
  tableWithDetails.appendChild(detailsCover);
}

function clearInput() {
  searchInput.value = "";
}
