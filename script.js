const apiKey = '6d8a0232';
const searchInput = document.querySelector('#search-input');
const resultContanier = document.querySelector('#results-container');
const modal = document.querySelector('#movie-modal');
const modalTitle = document.querySelector('#modal-title');
const modalPoster = document.querySelector('#modal-poster');
const modalDescription = document.querySelector('#modal-description');
const closeModal = document.querySelector('#close-modal');
const placeholderImage = '/mnt/data/image.png';

async function fetchMovies(userInput, page = 1) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${userInput}&page=${page}`);
  console.log(response);
  const data = await response.json();
  if(data.Response === "True") {
    renderMovies(data.Search);
    console.log(data);
  }else {
    resultContanier.innerHTML = "<p>No results found.</p>"
  }
}
function renderMovies(movies) {
  resultContanier.innerHTML = movies.map(movie => `<div class="movie-card" data-id="${movie.imdbID}">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : placeholderImage}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
    </div>`).join('');

  document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const imdbID = card.getAttribute('data-id');
      fetchMovieDetails(imdbID);
    });
  });
}

async function fetchMovieDetails(imdbID) {
const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
const data = await response.json();
if (data.Response === "True") {
  modalTitle.textContent = data.Title;
  modalPoster.src = data.Poster !== 'N/A' ? data.Poster : 'placeholder.jpg';
  modalDescription.textContent = data.Plot || "No description available.";
  document.getElementById('modal-metascore').textContent = data.Metascore || "N/A";
  document.getElementById('modal-imdbRating').textContent = data.imdbRating || "N/A";
  document.getElementById('modal-imdbVotes').textContent = data.imdbVotes || "N/A";
  document.getElementById('modal-imdbID').textContent = data.imdbID || "N/A";
  modal.style.display = 'block';
}
}

closeModal.addEventListener('click', () => {
modal.style.display = 'none';
});


window.addEventListener('click', event => {
if (event.target === modal) {
  modal.style.display = 'none';
}
});

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSearch = debounce(userInput => {
  if(userInput.trim() != '') {
    fetchMovies(userInput);
  } 
}, 100);

searchInput.addEventListener('input', e => {
  debouncedSearch(e.target.value);
});