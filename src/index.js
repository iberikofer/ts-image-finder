import 'modern-normalize/modern-normalize.css';
import './scss/index.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import PixabayApi from './js/pixabayAPI';
import GalleryCardsBuilder from './js/galleryCardsBuilder';
import { Notify } from 'notiflix';

Notify.init({
  width: '320px',
  position: 'right-top',
  distance: '15px',
  opacity: 0.95,
  borderRadius: '8px',
  timeout: 3500,
  clickToClose: true,
});

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-form__input'),
  button: document.querySelector('.search-form__button'),
  gallery: document.querySelector('#gallery'),
  loader: document.querySelector('#loader'),
};

const pixabay = new PixabayApi();
const builder = new GalleryCardsBuilder();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const scrollObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading && showedImages < totalHits) {
        loadMoreImages();
      }
    });
  },
  {
    rootMargin: '0px 0px 300px 0px',
    threshold: 0.1,
  }
);

let showedImages = 0;
let totalHits = 0;
let isLoading = false;

refs.form.addEventListener('submit', onFormSubmit);
refs.input.addEventListener('input', onInput);
refs.button.addEventListener('click', onButtonClick);
refs.button.addEventListener('mouseleave', unfocusButton);

function onInput(event) {
  const query = event.target.value.trim();
  if (query) {
    refs.button.removeAttribute('disabled');
  } else {
    refs.button.setAttribute('disabled', 'disabled');
  }
}

function onButtonClick() {
  refs.button.classList.add('search-form__button--focus');
}

function unfocusButton() {
  refs.button.classList.remove('search-form__button--focus');
}

async function onFormSubmit(event) {
  event.preventDefault();
  const query = refs.input.value.trim();
  if (!query || isLoading) {
    return;
  }

  stopObserver();
  refs.gallery.innerHTML = '';
  showedImages = 0;
  totalHits = 0;

  await loadImages(query);
}

async function loadImages(query) {
  isLoading = true;
  refs.loader.classList.remove('loader--hidden');

  try {
    const data = await pixabay.loadImages(query);

    if (!data.hits || data.totalHits === 0) {
      refs.loader.classList.add('loader--hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    totalHits = data.totalHits;
    Notify.success(`Hooray! We found ${totalHits.toLocaleString()} images.`);
    buildGallery(data);
    lightbox.refresh();
    setTimeout(unfocusButton, 500);
    showedImages = data.hits.length;

    if (showedImages < totalHits) {
      refs.loader.classList.remove('loader--hidden');
      startObserver();
    } else {
      refs.loader.classList.add('loader--hidden');
    }
  } catch (error) {
    refs.loader.classList.add('loader--hidden');
    console.error(error);
    Notify.failure(error.message || 'An error occurred while fetching images.');
  } finally {
    isLoading = false;
  }
}

async function loadMoreImages() {
  if (isLoading || showedImages >= totalHits) {
    return;
  }

  isLoading = true;
  refs.loader.classList.remove('loader--hidden');

  try {
    const data = await pixabay.loadNextImages();

    if (!data.hits || data.hits.length === 0) {
      refs.loader.classList.add('loader--hidden');
      stopObserver();
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    appendGallery(data);
    lightbox.refresh();
    showedImages += data.hits.length;

    smoothScroll();

    if (showedImages >= totalHits) {
      refs.loader.classList.add('loader--hidden');
      stopObserver();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    refs.loader.classList.add('loader--hidden');
    console.error(error);
    Notify.failure('Failed to load more images. Please check your connection.');
  } finally {
    isLoading = false;
  }
}

function buildGallery(data) {
  refs.gallery.innerHTML = builder.buildCards(data.hits);
}

function appendGallery(data) {
  refs.gallery.insertAdjacentHTML('beforeend', builder.buildCards(data.hits));
}

function smoothScroll() {
  const firstCard = refs.gallery.firstElementChild;
  if (!firstCard) {
    return;
  }
  const { height: cardHeight } = firstCard.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}

function startObserver() {
  scrollObserver.observe(refs.loader);
}

function stopObserver() {
  scrollObserver.unobserve(refs.loader);
}
