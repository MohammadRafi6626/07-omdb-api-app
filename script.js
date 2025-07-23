// Get references to DOM elements
const searchForm = document.getElementById('search-form');
const movieSearchInput = document.getElementById('movie-search');

const movieResultsGrid = document.getElementById('movie-results');
const watchlistGrid = document.getElementById('watchlist');

// Store watchlist movies in an array
let watchlist = [];

// Load watchlist from localStorage when the page loads
window.addEventListener('DOMContentLoaded', function() {
  const saved = localStorage.getItem('watchlist');
  if (saved) {
    watchlist = JSON.parse(saved);
    updateWatchlist();
  }
});

// Your OMDb API key goes here
const OMDB_API_KEY = '3eb7d0fc'; // Replace with your OMDb API key

// Listen for form submit event
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page reload
  const searchTerm = movieSearchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
    movieSearchInput.value = ''; // Clear the input field after submitting
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
          <button class="btn btn-add" data-imdbid="${movie.imdbID}">Add to Watchlist</button>
        </div>
      </div>
    `;
  }
  // Insert the movies into the grid
  movieResultsGrid.innerHTML = html;

  // Add event listeners to 'Add to Watchlist' buttons
  const addButtons = document.querySelectorAll('.btn-add');
  for (const btn of addButtons) {
    btn.addEventListener('click', function() {
      // Find the movie by imdbID
      const imdbID = btn.getAttribute('data-imdbid');
      const movie = movies.find(m => m.imdbID === imdbID);
      addToWatchlist(movie);
    });
  }
}

// Add a movie to the watchlist (no duplicates)
function addToWatchlist(movie) {
  // Check if movie is already in watchlist
  const exists = watchlist.some(m => m.imdbID === movie.imdbID);
  if (!exists) {
    watchlist.push(movie);
    // Save watchlist to localStorage
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    updateWatchlist();
  }
}

// Update the watchlist section

function updateWatchlist() {
  if (watchlist.length === 0) {
    watchlistGrid.innerHTML = 'Your watchlist is empty. Search for movies to add!';
    return;
  }
  let html = '';
  for (const movie of watchlist) {
    html += `
      <div class="movie-card">
        <img class="movie-poster" src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x350?text=No+Image'}" alt="Poster for ${movie.Title}">
        <div class="movie-info">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
          <button class="btn btn-remove" data-imdbid="${movie.imdbID}">Remove</button>
        </div>
      </div>
    `;
  }
  watchlistGrid.innerHTML = html;

  // Add event listeners to 'Remove' buttons
  const removeButtons = document.querySelectorAll('.btn-remove');
  for (const btn of removeButtons) {
    btn.addEventListener('click', function() {
      const imdbID = btn.getAttribute('data-imdbid');
      removeFromWatchlist(imdbID);
    });
  }
}

// Remove a movie from the watchlist
function removeFromWatchlist(imdbID) {
  watchlist = watchlist.filter(m => m.imdbID !== imdbID);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  updateWatchlist();
}
