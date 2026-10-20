import { PixabayHit } from '../types/pixabay';

export default class GalleryCardsBuilder {
  buildCards(cardsData: PixabayHit[]): string {
    return cardsData.map(card => this.buildCard(card)).join('');
  }

  buildCard(cardData: PixabayHit): string {
    const escapedTags = this.#escapeHtml(cardData.tags || 'Photo');
    const likes = Number(cardData.likes || 0).toLocaleString();
    const views = Number(cardData.views || 0).toLocaleString();
    const comments = Number(cardData.comments || 0).toLocaleString();
    const downloads = Number(cardData.downloads || 0).toLocaleString();

    return `
      <li class="gallery__item">
        <a href="${cardData.largeImageURL}" class="photo-card">
          <div class="photo-card__thumb">
            <img class="photo-card__image" src="${cardData.webformatURL}" alt="${escapedTags}" loading="lazy" />
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${downloads}</span>
            </p>
          </div>
        </a>
      </li>
    `;
  }

  #escapeHtml(str: string): string {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
