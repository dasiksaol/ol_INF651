// Array to store movies
let movieArray = [];

// DOM references
const movieInput = document.getElementById("movie-name");
const addMovieBtn = document.getElementById("add-movie-btn");
const movieList = document.getElementById("movie-list");

// Add a new movie Function
function addMovie() {
  const movieTitle = movieInput.value.trim();

  if (movieTitle === "") {
    return;
  }

  movieArray.push(movieTitle); // add to array
  movieInput.value = ""; // clear input
  displayMovies(); // update display
}

// Display movies Function
function displayMovies() {
  movieList.innerHTML = ""; // clear current list

  movieArray.forEach((movie, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("collection-item");

    // Movie title
    const titleSpan = document.createElement("span");
    titleSpan.classList.add("movie-title");
    titleSpan.textContent = movie;
    
    const removeIcon = document.createElement("i");
    removeIcon.classList.add("material-icons", "remove-btn");
    removeIcon.textContent = "delete";
    removeIcon.addEventListener("click", () => removeMovie(index));

    listItem.appendChild(titleSpan);
    listItem.appendChild(removeIcon);
    movieList.appendChild(listItem);
  });
}

// Remove movie Function
function removeMovie(index) {
  movieArray.splice(index, 1); // remove 1 item at index
  displayMovies(); 
}

addMovieBtn.addEventListener("click", addMovie);
movieInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addMovie();
  }
});
