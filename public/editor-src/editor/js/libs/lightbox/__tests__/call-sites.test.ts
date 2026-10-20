// What each call site asks the lightbox for, with the lightbox stubbed out.

import imageExport from "visual/editorComponents/Image/export";
import imageGalleryExport from "visual/editorComponents/ImageGallery/export";
import videoExport from "visual/editorComponents/Video/export";
import { handleLightBoxZoom } from "visual/libs/lightbox";
import type {
  ElementLightboxOptions,
  GlobalLightboxOptions,
  LightboxHandle,
  LightboxRequest
} from "visual/libs/lightbox";

type CallSiteRun = (root: HTMLElement) => void;

const image = (href: string, title: string): string =>
  `<div class="brz-image"><a href="${href}" title="${title}"><img src="${href}" alt="${title}" /></a></div>`;

const gallery = (count: number): string =>
  `<div class="brz-image__gallery-lightbox" id="lightbox">${Array.from(
    { length: count },
    (_, index) => `<div class="brz-image__gallery-item">${image(`/img-${index}.jpg`, `Image ${index}`)}</div>`
  ).join("")}</div>`;

const bigImage = (): string =>
  `<div class="brz-image__gallery"><div class="brz-image__gallery-big-image" data-lightbox="on" data-images='${JSON.stringify([
    "/img-0.jpg",
    "/img-1.jpg",
    "/img-2.jpg"
  ])}'><img src="/img-0.jpg" />${[0, 1, 2]
    .map(
      (index) =>
        `<a class="brz-image__gallery-big-image-lightbox" href="/img-${index}.jpg"></a>`
    )
    .join(
      ""
    )}</div><div class="brz-image__gallery-item"><picture><img src="/img-0.jpg" /></picture></div></div>`;

const video = (attributes: string): string => `<a class="brz-video__lightbox" ${attributes}></a>`;

interface CallSite {
  case: string;
  run: CallSiteRun;
  markup: string;
  /** The element the site's handler is bound to. */
  click: string;
  /** What the request is built around, for an element-bound lightbox. */
  target: string;
  /** Every option but the callbacks, which are compared by presence. */
  options: ElementLightboxOptions | GlobalLightboxOptions;
  openCallback: "zoom" | "set" | "unset";
  closeCallback: "set" | "unset";
  goTo: number | undefined;
}

const callSites: CallSite[] = [
  {
    case: "a single image",
    run: imageExport,
    markup: `<div class="brz-image__lightbox">${image("/a.jpg", "A")}</div>`,
    click: ".brz-image__lightbox",
    target: ".brz-image__lightbox",
    options: {
      type: "image",
      delegate: "a",
      gallery: undefined,
      closeOnContentClick: true,
      mainClass: "",
      callbacks: { open: undefined, close: undefined }
    },
    openCallback: "zoom",
    closeCallback: "unset",
    goTo: undefined
  },
  {
    case: "an image gallery, which lands on the image that was clicked",
    run: imageGalleryExport,
    markup: gallery(3),
    click: ".brz-image__gallery-item:nth-child(2) a",
    target: "#lightbox",
    options: {
      type: "image",
      delegate: "a",
      gallery: { enabled: true },
      closeOnContentClick: false,
      mainClass: "brz brz-lightbox",
      callbacks: { open: undefined, close: undefined }
    },
    openCallback: "zoom",
    closeCallback: "unset",
    goTo: 1
  },
  {
    case: "the big image of a gallery, which opens on the image it is showing",
    run: imageGalleryExport,
    markup: bigImage(),
    click: ".brz-image__gallery-big-image",
    target: ".brz-image__gallery-big-image",
    options: {
      type: "image",
      delegate: "a",
      gallery: { enabled: true },
      closeOnContentClick: false,
      mainClass: "",
      callbacks: { open: undefined, close: undefined }
    },
    openCallback: "zoom",
    closeCallback: "unset",
    goTo: 0
  },
  {
    case: "a video that plays inline",
    run: videoExport,
    markup: video(`data-brz-popup-type="inline" data-brz-src="#player"`),
    click: ".brz-video__lightbox",
    target: "",
    options: {
      type: "inline",
      src: "#player",
      closeOnContentClick: false,
      mainClass: "",
      callbacks: { open: undefined, close: undefined }
    },
    openCallback: "set",
    closeCallback: "set",
    goTo: undefined
  },
  {
    case: "a video that plays in an iframe, from a watch url",
    run: videoExport,
    markup: video(
      `data-brz-popup-type="iframe" data-brz-src="https://www.youtube.com/watch?v=ABC123"`
    ),
    click: ".brz-video__lightbox",
    target: "",
    options: {
      type: "iframe",
      src: "//www.youtube.com/embed/ABC123?playlist=ABC123&autoplay=1&mute=0&loop=0&start=0&end=0",
      closeOnContentClick: true,
      mainClass: "",
      callbacks: { open: undefined, close: undefined }
    },
    openCallback: "unset",
    closeCallback: "unset",
    goTo: undefined
  }
];

let requests: LightboxRequest[] = [];

let handle: LightboxHandle;

beforeEach(() => {
  requests = [];
  handle = { open: jest.fn(), close: jest.fn(), goTo: jest.fn() };

  // The real `BrizyLibs` is far bigger than a test needs, and only these two members are read.
  Object.assign(window, {
    BrizyLibs: {
      openLightbox: (request: LightboxRequest): LightboxHandle => {
        requests.push(request);

        return handle;
      },
      handleLightBoxZoom
    },
    // The image gallery needs them present; nothing constructs them here.
    BrizyProLibs: { Isotope: true, ImagesLoaded: true, Gallery: true },
    Brz: { on: () => {} }
  });
});

describe("the call sites", () => {
  it.each(callSites)("asks for what it used to: $case", (site) => {
    // A root per case, so the previous case's delegated handler is gone.
    const root = document.createElement("div");
    root.innerHTML = site.markup;
    document.body.append(root);

    site.run(root);
    root.querySelector<HTMLElement>(site.click)?.click();

    expect(requests).toHaveLength(1);

    const [request] = requests;
    const { callbacks, ...options } = request.options;

    expect(options).toEqual({ ...site.options, callbacks: undefined });
    const open = callbacks.open
      ? callbacks.open === handleLightBoxZoom
        ? "zoom"
        : "set"
      : "unset";

    expect(open).toBe(site.openCallback);
    expect(callbacks.close ? "set" : "unset").toBe(site.closeCallback);

    if (request.kind === "element") {
      expect(request.target).toBe(root.querySelector(site.target));
    } else {
      expect(site.target).toBe("");
    }

    // Every site opens on click; the two galleries also jump to the right image.
    expect(handle.open).toHaveBeenCalledTimes(1);

    if (site.goTo === undefined) {
      expect(handle.goTo).not.toHaveBeenCalled();
    } else {
      expect(handle.goTo).toHaveBeenCalledWith(site.goTo);
    }
  });
});
