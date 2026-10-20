import axios from 'axios';
import { PixabayResponse } from '../types/pixabay';

export default class PixabayApi {
  readonly #apiKey: string | undefined = process.env.PIXABAY_API_KEY;
  readonly #url: string = 'https://pixabay.com/api/';
  readonly #perPage: number = 40;
  #page: number = 1;
  #query: string = '';

  constructor() {
    if (!this.#apiKey) {
      console.warn(
        'PixabayApi: PIXABAY_API_KEY is not set. Please check your .env configuration.'
      );
    }
  }

  async loadImages(query: string): Promise<PixabayResponse> {
    this.#page = 1;
    this.#query = query.trim();
    return this.#fetch();
  }

  async loadNextImages(): Promise<PixabayResponse> {
    this.#page += 1;
    return this.#fetch();
  }

  resetPage(): void {
    this.#page = 1;
  }

  get page(): number {
    return this.#page;
  }

  get perPage(): number {
    return this.#perPage;
  }

  async #fetch(): Promise<PixabayResponse> {
    if (!this.#apiKey) {
      throw new Error(
        'Pixabay API key is missing. Ensure PIXABAY_API_KEY is configured in your .env file.'
      );
    }

    const response = await axios.get<PixabayResponse>(this.#url, {
      params: {
        key: this.#apiKey,
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: this.#perPage,
        page: this.#page,
      },
    });

    return response.data;
  }
}
