const URL_MOVIE =
  "https://us-central1-itfighters-movies.cloudfunctions.net/api/movie";
allMovies = [];
let tableWithAllMovies;
let searchInput;

window.onload = () => {
  getAllMovies();
  bindDOMElements();
  addEventListeners();
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
      console.log(allMovies);
      createListWithAllMovies(allMovies);
    })
    .catch(error => {
      console.warn(error);
    });
};

function addEventListeners() {
  searchInput.addEventListener("input", e => {
    handleMoviesInputChange(e);
  });
}
function handleMoviesInputChange(e) {
  const searchText = e.target.value;
  const filteredMovies = filterMovies(searchText);
  generateCountriesList(filteredMovies);
}

function filterMovies(searchText) {
  searchText = searchText.toLocaleLowerCase().trim();
  return allMovies.filter(movie => {
    if (movie.name && movie.name.toLocaleLowerCase().includes(searchText)) {
      return true;
    }
    return false;
  });
}

function bindDOMElements() {
  tableWithAllMovies = document.getElementById("allMoviesList");
  searchInput = document.getElementById("search");
}

function createListWithAllMovies(allMovies) {
  debugger;
  allMovies.forEach(movie => {
    let idMovie = movie.id;
    let titleMovie = movie.title;
    let yearMovie = movie.year;
    let rateMovie = movie.rate;
    let imgMovie = movie.imgSrc;
    console.log(movie.id);
    debugger;
    let tr = document.createElement("tr");
    let tdId = document.createElement("td");
    tdId.innerText = idMovie;
    tr.appendChild(tdId);
    let tdTitle = document.createElement("td");
    tdId.innerText = titleMovie;
    tr.appendChild(tdTitle);
    let tdYear = document.createElement("td");
    tdId.innerText = yearMovie;
    tr.appendChild(tdYear);
    let tdRate = document.createElement("td");
    tdId.innerText = rateMovie;
    tr.appendChild(tdRate);
    let tdImg = document.createElement("td");
    tdId.innerText = imgMovie;
    tr.appendChild(tdImg);
    tableWithAllMovies.appendChild(tr);
  });
}
