import axios from 'axios';

export default class PixabayApi {
  #API_KEY = process.env.PIXABAY_API_KEY;
  #URL = 'https://pixabay.com/api/';
  #PER_PAGE = 40;
  #page = 1;
  #query = '';

  constructor() {
    if (!this.#API_KEY) {
      console.warn(
        'PixabayApi: PIXABAY_API_KEY is not set. Please check your .env configuration.'
      );
    }
  }

  async loadImages(query) {
    this.#page = 1;
    this.#query = query.trim();
    return this.#fetch();
  }

  async loadNextImages() {
    this.#page += 1;
    return this.#fetch();
  }

  resetPage() {
    this.#page = 1;
  }

  get page() {
    return this.#page;
  }

  get perPage() {
    return this.#PER_PAGE;
  }

  async #fetch() {
    if (!this.#API_KEY) {
      throw new Error(
        'Pixabay API key is missing. Ensure PIXABAY_API_KEY is configured in your .env file.'
      );
    }

    const response = await axios({
      url: this.#URL,
      params: {
        key: this.#API_KEY,
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: this.#PER_PAGE,
        page: this.#page,
      },
    });

    return response.data;
  }
}
