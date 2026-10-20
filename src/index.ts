import 'modern-normalize/modern-normalize.css';
import './scss/index.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import PixabayApi from './ts/pixabayAPI';
import GalleryCardsBuilder from './ts/galleryCardsBuilder';
import { Notify } from 'notiflix';
import { PixabayResponse } from './types/pixabay';

Notify.init({
  width: '320px',
  position: 'right-top',
  distance: '15px',
  opacity: 0.95,
  borderRadius: '8px',
  timeout: 3500,
  clickToClose: true,
});

interface Elements {
  form: HTMLFormElement;
  input: HTMLInputElement;
  button: HTMLButtonElement;
  gallery: HTMLUListElement;
  loader: HTMLDivElement;
}

const form = document.querySelector<HTMLFormElement>('#search-form');
const input = document.querySelector<HTMLInputElement>('.search-form__input');
const button = document.querySelector<HTMLButtonElement>('.search-form__button');
const gallery = document.querySelector<HTMLUListElement>('#gallery');
const loader = document.querySelector<HTMLDivElement>('#loader');

if (!form || !input || !button || !gallery || !loader) {
  throw new Error('Required DOM elements were not found in the document.');
}

const refs: Elements = {
  form,
  input,
  button,
  gallery,
  loader,
};

const pixabay = new PixabayApi();
const builder = new GalleryCardsBuilder();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const scrollObserver = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading && showedImages < totalHits) {
        void loadMoreImages();
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

refs.form.addEventListener('submit', (e: Event) => {
  void onFormSubmit(e);
});
refs.input.addEventListener('input', onInput);
refs.button.addEventListener('click', onButtonClick);
refs.button.addEventListener('mouseleave', unfocusButton);

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const query = target.value.trim();
  if (query) {
    refs.button.removeAttribute('disabled');
  } else {
    refs.button.setAttribute('disabled', 'disabled');
  }
}

function onButtonClick(): void {
  refs.button.classList.add('search-form__button--focus');
}

function unfocusButton(): void {
  refs.button.classList.remove('search-form__button--focus');
}

async function onFormSubmit(event: Event): Promise<void> {
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

async function loadImages(query: string): Promise<void> {
  isLoading = true;
  refs.loader.classList.remove('loader--hidden');

  try {
    const data: PixabayResponse = await pixabay.loadImages(query);

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
  } catch (error: unknown) {
    refs.loader.classList.add('loader--hidden');
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred while fetching images.';
    Notify.failure(errorMessage);
  } finally {
    isLoading = false;
  }
}

async function loadMoreImages(): Promise<void> {
  if (isLoading || showedImages >= totalHits) {
    return;
  }

  isLoading = true;
  refs.loader.classList.remove('loader--hidden');

  try {
    const data: PixabayResponse = await pixabay.loadNextImages();

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
  } catch (error: unknown) {
    refs.loader.classList.add('loader--hidden');
    console.error(error);
    Notify.failure('Failed to load more images. Please check your connection.');
  } finally {
    isLoading = false;
  }
}

function buildGallery(data: PixabayResponse): void {
  refs.gallery.innerHTML = builder.buildCards(data.hits);
}

function appendGallery(data: PixabayResponse): void {
  refs.gallery.insertAdjacentHTML('beforeend', builder.buildCards(data.hits));
}

function smoothScroll(): void {
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

function startObserver(): void {
  scrollObserver.observe(refs.loader);
}

function stopObserver(): void {
  scrollObserver.unobserve(refs.loader);
}
