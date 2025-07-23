// Get references to DOM elements
const searchForm = document.getElementById('search-form');
const movieSearchInput = document.getElementById('movie-search');
const movieResultsGrid = document.getElementById('movie-results');

// Your OMDb API key goes here
const OMDB_API_KEY = '3eb7d0fc'; // Replace with your OMDb API key

// Listen for form submit event
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page reload
  const searchTerm = movieSearchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

// Fetch movies from OMDb API
async function fetchMovies(searchTerm) {
  // Build the API URL
  const apiUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchTerm)}`;

  // Fetch data from OMDb API
  const response = await fetch(apiUrl);
  const data = await response.json();

  // Check if movies were found
  if (data.Response === 'True') {
    // Display the movies
    displayMovies(data.Search);
  } else {
    // Show a message if no movies found
    movieResultsGrid.innerHTML = `<div class="no-results">No movies found. Try another search!</div>`;
  }
}

// Display movies in the results grid
function displayMovies(movies) {
  // Create HTML for each movie
  let html = '';
  for (const movie of movies) {
    html += `
      <div class="movie-card">
        <img class="movie-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x350?text=No+Image'}" alt="Poster for ${movie.Title}">
        <div class="movie-info">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
        </div>
      </div>
    `;
  }
  // Insert the movies into the grid
  movieResultsGrid.innerHTML = html;
}
