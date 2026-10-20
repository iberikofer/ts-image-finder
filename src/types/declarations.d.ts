declare module '*.css';
declare module '*.scss';

declare module 'simplelightbox' {
  export interface SimpleLightboxOptions {
    sourceAttr?: string;
    overlay?: boolean;
    spinner?: boolean;
    nav?: boolean;
    navText?: [string, string];
    captions?: boolean;
    captionDelay?: number;
    captionSelector?: string | 'img' | 'self';
    captionType?: 'attr' | 'data' | 'text';
    captionsData?: string;
    captionPosition?: 'bottom' | 'top';
    captionClass?: string;
    close?: boolean;
    closeText?: string;
    swipeClose?: boolean;
    showCounter?: boolean;
    fileExt?: string | boolean;
    animationSpeed?: number;
    animationSlide?: boolean;
    preloading?: boolean;
    enableKeyboard?: boolean;
    loop?: boolean;
    rel?: boolean;
    docClose?: boolean;
    swipeTolerance?: number;
    className?: string;
    widthRatio?: number;
    heightRatio?: number;
    scaleImageToRatio?: boolean;
    disableRightClick?: boolean;
    disableScroll?: boolean;
    alertError?: boolean;
    alertErrorMessage?: string;
    additionalHtml?: boolean | string;
    history?: boolean;
    throttleInterval?: number;
    doubleTapZoom?: number;
    maxZoom?: number;
    scrollZoom?: boolean;
    scrollZoomFactor?: number;
    html?: string;
    rtl?: boolean;
    focus?: boolean;
  }

  export default class SimpleLightbox {
    constructor(
      elements: string | HTMLElement[] | NodeListOf<Element>,
      options?: SimpleLightboxOptions
    );
    defaultOptions: SimpleLightboxOptions;
    elements: Element[];
    options: SimpleLightboxOptions;
    init(): void;
    open(elem?: HTMLElement | Element): void;
    close(): void;
    next(): void;
    prev(): void;
    destroy(): void;
    refresh(): SimpleLightbox;
    on(event: string, callback: (...args: unknown[]) => void): this;
    off(event: string, callback: (...args: unknown[]) => void): this;
  }
}
