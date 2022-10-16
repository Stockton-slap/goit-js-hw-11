import { fetchPics } from './fetch-pics';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let inputValue = '';
let page = 1;
const perPage = 40;
let lightbox = null;

refs.loadMoreBtn.style.display = 'none';
refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onSearchFormSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  inputValue = e.currentTarget.elements.searchQuery.value.trim();

  const response = await loadPics(inputValue, page);
  const totalHits = response.data.totalHits;

  totalHitsFound(totalHits);
}

async function loadPics(inputValue, page) {
  refs.loadMoreBtn.style.display = 'none';
  if (inputValue === '') {
    return;
  }

  try {
    const pic = await fetchPics(inputValue, page, perPage);
    const stats = pic.data.hits;
    const hitsLength = pic.data.hits.length;

    if (hitsLength < perPage && hitsLength > 0) {
      refs.loadMoreBtn.style.display = 'none';
      endSearch();
    } else {
      refs.loadMoreBtn.style.display = 'block';
    }

    if (stats.length === 0) {
      noImagesFound();
    } else {
      renderGalleryMarkup(stats);
    }

    return pic;
  } catch (error) {
    console.log(error);
  } finally {
    refs.searchForm.reset();
  }
}

function noImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  refs.loadMoreBtn.style.display = 'none';
}

function endSearch() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
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
  <a href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy" width="350px" height="250px" /></a>
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

  if (lightbox !== null) {
    lightbox.refresh();
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });
}

async function onLoadMoreBtnClick() {
  page += 1;
  await loadPics(inputValue, page);
  smoothScroll();
}

function totalHitsFound(totalHits) {
  if (totalHits !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
