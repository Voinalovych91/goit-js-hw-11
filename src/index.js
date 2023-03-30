import Notiflix from 'notiflix';
import axios from 'axios';

const searchForm = document.querySelector('#search-form')
const input = document.querySelector('#search-form input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const searchParams = new URLSearchParams({
	key: "34896738-a1699c1dbaaca5ea67d26887d",
	q: "",
	image_type: "photo",
	orientation: "horizontal",
	safesearch: true,
	per_page: 40,
	page: 1,
});

let currentPage = 1;

searchForm.addEventListener("submit", (event) => handleSubmit(event, input, searchParams));

function setSearchParams(input, searchParams) {
  searchParams.set("q", input.value);
}

function getURL(searchParams) {
  return `https://pixabay.com/api/?${searchParams.toString()}`;
}

// function clearInput(input) {
//   input.value = '';
// }

async function getImages(URL) {
  try {
    const response = await axios.get(URL);
    const images = response.data.hits.map(hit => ({
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      likes: hit.likes,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
    }));

    if (images.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
    } else {
      galleryEl.innerHTML = renderGallery(images);
      loadMoreBtn.style.display = 'block';
      const totalHits = response.data.totalHits;
      const currentPage = Number(searchParams.get('page'));
      const perPage = Number(searchParams.get('per_page'));
      const displayedImages = (currentPage - 1) * perPage + images.length;
      if (displayedImages >= totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
      console.log(totalHits);
    }
    
    return images;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Error fetching images');
  }
}


function handleSubmit(event, input, searchParams) {
  event.preventDefault();

  if (input.value !== searchParams.get('q')) {
    searchParams.set('q', input.value);
    searchParams.set('page', 1);
    currentPage = 1;
    galleryEl.innerHTML = '';
    loadMoreBtn.style.display = 'none';
  }

  setSearchParams(input, searchParams);
  const URL = getURL(searchParams);
  getImages(URL)
    .then(images => {
      galleryEl.innerHTML = renderGallery(images);
      if (images.length === 0) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    })
    .catch(error => console.log(error));
}

function renderGallery(images) {
  const markup = images.map((image) => `<div class="photo-card">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${image.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${image.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${image.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${image.downloads}
      </p>
    </div>
  </div>`).join("");

  return markup;
};

loadMoreBtn.addEventListener('click', loadMoreImages);

async function loadMoreImages() {
  currentPage += 1;
  searchParams.set('page', currentPage); // update the 'page' parameter
  const URL = getURL(searchParams);
  try {
    const response = await axios.get(URL);
    const images = response.data.hits.map(hit => ({
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      likes: hit.likes,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
    }));

    galleryEl.insertAdjacentHTML('beforeend', renderGallery(images));
    if (images.length < searchParams.get('per_page')) {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}