import { fetchPics } from './fetch-pics';
import Notiflix from 'notiflix';
import axios from 'axios';

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

  inputValue = e.currentTarget.elements.searchQuery.value.trim();
  loadPics(inputValue, page);
  refs.loadMoreBtn.style.display = 'none';
}

async function loadPics(inputValue, page) {
  refs.loadMoreBtn.style.display = 'none';
  if (inputValue === '') {
    return;
  }
  try {
    const pic = await fetchPics(inputValue, page, perPage);
    const stats = pic.hits;
    const hitsPerPage = pic.totalHits / perPage;

    refs.loadMoreBtn.style.display = 'block';

    if (page > hitsPerPage) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.style.display = 'none';
    }

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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="350px" height="250px" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b></br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b></br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b></br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b></br>${downloads}
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
