import { fetchPics, fetchPics } from './fetch-pics';
// import { renderGalleryMarkup } from './template';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let inputValue = '';
let page = 1;
const perPage = 3;

refs.loadMoreBtn.style.display = 'none';

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchFormSubmit(e) {
  e.preventDefault();

  refs.gallery.innerHTML = '';

  inputValue = e.currentTarget.elements.searchQuery.value;
  loadPics(inputValue, page);
  refs.loadMoreBtn.style.display = 'none';
}

async function loadPics(inputValue, page) {
  refs.loadMoreBtn.style.display = 'none';

  try {
    const pic = await fetchPics(inputValue, page, perPage);

    const stats = pic.hits;

    if (stats.length === 0) {
      noImagesFound();
    } else {
      renderGalleryMarkup(stats);
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    refs.searchForm.reset();
  }
  refs.loadMoreBtn.style.display = 'block';
}

function noImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function renderGalleryMarkup(stats) {
  stats.forEach(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const markup = `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="350px" height="350px" />
  <div class="info">
    <p class="info-item">
      <b>Likes${likes}</b>
    </p>
    <p class="info-item">
      <b>Views${views}</b>
    </p>
    <p class="info-item">
      <b>Comments${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${downloads}</b>
    </p>
  </div>
</div>`;
      refs.gallery.insertAdjacentHTML('beforeend', markup);
    }
  );
}

function onLoadMoreBtnClick() {
  page += 1;
  loadPics(inputValue, page);
}
