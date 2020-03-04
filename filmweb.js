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

window.onload = () => {
  getAllMovies();
  bindDOMElements();
  addEventToInput();
  addEventsToButtons();
};

let getAllMovies = function() {
  fetch(URL_MOVIE)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject(response);
      }
    })
    .then(function(response) {
      allMovies = response;
      return allMovies;
    })
    .catch(error => {
      console.warn(error);
    });
};

function bindDOMElements() {
  tableWithAllMoviesTBody = document.getElementById("tableWithAllMoviesTBody");
  searchInput = document.getElementById("search");
  console.log(searchInput);
  searchButton = document.getElementsByClassName("searchButton")[0];
  allMoviesList = document.getElementById("allMoviesList");
  tableWithDetails = document.getElementById("tableWithDetails");
  navButtonBest = document.getElementById("best");
  navButtonFav = document.getElementById("favourites");
  tableDetailsHead = document.getElementById("tableWithDetailsHead");
}

function addEventToInput() {
  searchInput.addEventListener("change", event => {
    event.preventDefault();
    handleMoviesInputChange(event);
  });
}

function addEventsToButtons() {
  navButtonBest.addEventListener("click", event => {
    event.preventDefault();
    showBestMovies();
  });
  navButtonFav.addEventListener("click", event => {
    event.preventDefault();
    showFavMovies(favouritesMovies);
  });
}

function handleMoviesInputChange(event) {
  debugger;
  const title = event.target.value;

  if (title == "") {
    toggleVisibility(allMoviesList, false);
    clearList(allMoviesList);
  } else {
    debugger;
    filteredMovies = [];
    console.log(filteredMovies);
    clearList(tableWithAllMoviesTBody);
    filteredMovies = getByTitle(title);
  }
}

function clearList(list) {
  list.innerHTML = "";
}

function showBestMovies() {
  toggleVisibility(allMoviesList, true);
  return allMovies.filter(movie => {
    if (movie.rate >= 5) {
      filteredMovies.push(movie);
      createListWithAllMovies(filteredMovies);
      clearInput();
      return filteredMovies;
    }
    return false;
  });
}

function getByTitle(title) {
  title = title.toLocaleLowerCase().trim();
  const requestUrl = `${URL_MOVIE}?name=${title}`;
  fetch(requestUrl)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject(response);
      }
    })
    .then(function(response) {
      clearList(tableWithDetails);
      toggleVisibility(allMoviesList, true);
      toggleVisibility(tableDetailsHead, false);
      toggleVisibility(tableWithDetails, false);
      toggleVisibility(tableWithAllMoviesTBody, true);
      filteredMovies = response;
      createListWithAllMovies(filteredMovies);
      clearInput();
    })
    .catch(error => {
      console.warn(error);
    });
}

function createListWithAllMovies(allMovies) {
  allMovies.forEach(movie => {
    function createTd(value) {
      let tdNew = document.createElement("td");
      tdNew.innerText = value;
      tr.appendChild(tdNew);
    }
    let titleMovie = movie.title;
    let yearMovie = movie.year;
    let rateMovie = movie.rate;
    let imgMovie = movie.imgSrc;
    let tr = document.createElement("tr");
    let tdDetails = document.createElement("td");
    tdDetails.setAttribute("class", "tableContainer");
    let tdDetailsButton = document.createElement("button");
    tdDetailsButton.innerHTML = "Szczegóły";
    tdDetailsButton.setAttribute("id", movie.id);
    tdDetailsButton.setAttribute("class", "inTableButtons");
    tdDetailsButton.addEventListener("click", showDetails);
    tdDetails.appendChild(tdDetailsButton);
    let addToFavButton = document.createElement("button");
    addToFavButton.innerText = "Dodaj do ulubionych";
    addToFavButton.setAttribute("id", movie.id);
    addToFavButton.setAttribute("class", "inTableButtons");
    addToFavButton.addEventListener("click", addToFav);
    tdDetails.appendChild(addToFavButton);
    tr.appendChild(tdDetails);
    createTd(titleMovie);
    createTd(yearMovie);
    createTd(rateMovie);
    let tdImg = document.createElement("td");
    let imgIn = document.createElement("img");
    imgIn.setAttribute("src", imgMovie ? imgMovie : "alt.png");
    imgIn.setAttribute("alt", "Obrazek się nie wyświetla");
    tdImg.appendChild(imgIn);
    tr.appendChild(tdImg);
    tableWithAllMoviesTBody.appendChild(tr);
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
  tab.forEach(urlDetails => {
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
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject(response);
      }
    })
    .then(function(response) {
      clearList(allMoviesList);
      toggleVisibility(allMoviesList, false);
      toggleVisibility(tableDetailsHead, true);
      let detailsAboutMovie = response;
      toggleVisibility(tableWithDetails, true);
      createTableWithDetails(detailsAboutMovie);
    })
    .catch(error => {
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
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      console.log(response);
      clearList(detailsAboutMovie);
    })
    .catch(error => {
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
