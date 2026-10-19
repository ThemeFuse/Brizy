// Page markup as the compiler writes it for the components that open the lightbox.

type LightboxImage = { href: string; title: string; alt: string };

const anchor = ({ href, title, alt }: LightboxImage): string =>
  `<a href="${href}" title="${title}"><img src="${href}" alt="${alt}" /></a>`;

const mount = (html: string, selector: string): HTMLElement => {
  document.body.innerHTML = html;

  const element = document.querySelector<HTMLElement>(selector);

  if (!element) {
    throw new Error(`no element matches ${selector}`);
  }

  return element;
};

/** `.brz-image__lightbox` — the container the Image and ImageGallery call sites delegate from. */
export const imageContainer = (images: LightboxImage[]): HTMLElement =>
  mount(`<div class="brz-image__lightbox">${images.map(anchor).join("")}</div>`, ".brz-image__lightbox");

/** The Video inline call site: a player in the page, opened by selector. */
export const inlineVideo = (): HTMLElement =>
  mount(
    `<div class="brz-video"><div class="brz-video__player" id="inline-player"><video></video></div></div>`,
    "#inline-player"
  );
