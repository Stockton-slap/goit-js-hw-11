import { fetchPics } from './fetch-pics';
// import { renderGalleryMarkup } from './template';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let page = 1;
let perPage = 40;

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchFormSubmit(e) {
  e.preventDefault();

  const inputValue = e.currentTarget.elements.searchQuery.value;

  fetchPics(inputValue, page).then(pic => {
    const stats = pic.hits;

    if (stats.length === [].length) {
      noImagesFound();
    } else {
      renderGalleryMarkup(stats);
      page += 1;
    }
  });
}

function noImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function renderGalleryMarkup(stats) {
  // console.log(stats);

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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

function onLoadMoreBtnClick(e) {
  console.log(e.target);
}
