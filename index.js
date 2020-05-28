const URL_MOVIE =
  "https://us-central1-itfighters-movies.cloudfunctions.net/api/movie";

let allMovies = [];
let filteredMovies = [];
let favouritesMovies = [];
let allMoviesList;
let tableWithAllMoviesTBody;
let searchInput;
let searchButton;
let tableWithDetails;
let tableDetailsHead;
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
};

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
      console.log(allMovies);
      return allMovies;
    })
    .catch((error) => {
      console.warn(error);
    });
};

function bindDOMElements() {
  tableWithAllMoviesTBody = document.getElementById("tableWithAllMoviesTBody");
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
    toggleVisibility(allMoviesList, false);
    clearList(allMoviesList);
  } else {
    filteredMovies = [];
    clearList(allMoviesList);
    filteredMovies = filterMovies(title);
    // filteredMovies = getByTitle(title);
    console.log(filteredMovies);
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
    showFavMovies(favouritesMovies);
  });
  hamburger.addEventListener("click", (event) => {
    event.preventDefault();
    hamburger.classList.toggle("hamburger__active");
    navigation.classList.toggle("navigation__active");
  });
}

function clearList(list) {
  list.innerText = "";
}

function showBestMovies() {
  toggleVisibility(allMoviesList, true);
  return allMovies.filter((movie) => {
    if (movie.rate >= 5) {
      filteredMovies.push(movie);
      createListWithAllMovies(filteredMovies);
      clearInput();
      return filteredMovies;
    }
    return false;
  });
}

// function getByTitle(title) {
//   title = title.toLocaleLowerCase().trim();
//   const requestUrl = `${URL_MOVIE}?name=${title}`;
//   fetch(requestUrl)
//     .then(function (response) {
//       if (response.ok) {
//         return response.json();
//       } else {
//         Promise.reject(response);
//       }
//     })
//     .then(function (response) {
//       clearList(tableWithDetails);
//       toggleVisibility(allMoviesList, true);
//       toggleVisibility(tableDetailsHead, false);
//       toggleVisibility(tableWithDetails, false);
//       toggleVisibility(tableWithAllMoviesTBody, true);
//       filteredMovies = response;
//       createListWithAllMovies(filteredMovies);
//       clearInput();
//     })
//     .catch((error) => {
//       console.warn(error);
//     });
// }

function createListWithAllMovies(array) {
  array.forEach((movie) => {
    debugger;
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
  let idDetails = parseInt(event.target.getAttribute("id"));
  const urlDetails = URL_MOVIE + "/" + idDetails;
  favouritesMovies.push(urlDetails);
  alert("Dodałes film do ulubionych");
}

function showFavMovies(tab) {
  tab.forEach((urlDetails) => {
    getFunction(urlDetails);
  });
  createListWithAllMovies(favouritesMovies);
}

function showDetails(event) {
  event.preventDefault();
  let idDetails = parseInt(event.target.getAttribute("id"));
  const urlDetails = URL_MOVIE + "/" + idDetails;
  getFunction(urlDetails);
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
      toggleVisibility(allMoviesList, false);
      toggleVisibility(tableDetailsHead, true);
      let detailsAboutMovie = response;
      toggleVisibility(tableWithDetails, true);
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
  let movieDesription = movie.description;
  let trBody = document.createElement("tr");
  tableWithDetails.appendChild(trBody);
  let tdImg = document.createElement("td");
  let imgIn = document.createElement("img");
  imgIn.setAttribute("src", imgMovie ? imgMovie : "alt.png");
  imgIn.setAttribute("alt", "Obrazek się nie wyświetla");
  tdImg.appendChild(imgIn);
  trBody.appendChild(tdImg);
  let tdDetails = document.createElement("td");
  let ul = document.createElement("ul");
  createLi(titleMovie);
  createLi(yearMovie);
  createLi(movieCast);
  createLi(movieGenres);
  createLi(rateMovie);
  createLi(movieDesription);
  tdDetails.appendChild(ul);
  trBody.appendChild(tdDetails);
  tableWithDetails.appendChild(trBody);
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "Usuń film";
  deleteButton.setAttribute("id", movie.id);
  deleteButton.setAttribute("class", "inTableButtons");
  deleteButton.addEventListener("click", deleteMovie);
  tableWithDetails.appendChild(deleteButton);
}

function clearInput() {
  searchInput.value = "";
}

function deleteMovie() {
  let idDetails = parseInt(event.target.getAttribute("id"));
  const urlDetails = URL_MOVIE + "/" + idDetails;
  console.log(idDetails);
  return fetch(urlDetails, {
    method: "DELETE",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response);
      clearList(detailsAboutMovie);
    })
    .catch((error) => {
      console.warn(error);
    });
}

function toggleVisibility(element, show) {
  if (show) {
    if (element.classList.contains("hidden")) {
      element.classList.remove("hidden");
    }
  } else {
    if (!element.classList.contains("hidden")) {
      element.classList.add("hidden");
    }
  }
}
