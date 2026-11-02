// The lightbox contract, driven through `openLightbox` only.

import { openLightbox } from "visual/libs/lightbox";
import type {
  ElementLightboxOptions,
  LightboxGalleryOptions,
  LightboxHandle,
  LightboxType
} from "visual/libs/lightbox";
import {
  attrOf,
  classesOf,
  failImage,
  loadImage,
  markupOf,
  pressEscape,
  pressLeft,
  pressRight,
  textOf,
  track,
  useLightboxEnv
} from "../__fixtures__/env";
import { imageContainer, inlineVideo } from "../__fixtures__/markup";

useLightboxEnv();

const threeImages = [
  { href: "/a.jpg", title: "A", alt: "A" },
  { href: "/b.jpg", title: "B", alt: "B" },
  { href: "/c.jpg", title: "C", alt: "C" }
];

// `satisfies` keeps `type` the literal "image".
const imageShell = {
  delegate: "a",
  type: "image",
  gallery: undefined,
  closeOnContentClick: true,
  mainClass: "",
  callbacks: { open: undefined, close: undefined }
} satisfies ElementLightboxOptions;

interface ShellCase {
  case: string;
  type: LightboxType;
  images: { href: string; title: string; alt: string }[];
  gallery: LightboxGalleryOptions | undefined;
  closeOnContentClick: boolean;
  mainClass: string;
  wrap: string;
  container: string;
  bg: string;
}

describe("the shell", () => {
  it.each<ShellCase>([
    {
      case: "one image, no gallery, content click closes",
      type: "image",
      images: [threeImages[0]],
      gallery: undefined,
      closeOnContentClick: true,
      mainClass: "",
      wrap: "brz-lb-wrap brz-lb-close-btn-in",
      container: "brz-lb-container brz-lb-s-loading brz-lb-image-holder",
      bg: "brz-lb-bg"
    },
    {
      case: "a gallery whose content click does not close",
      type: "image",
      images: threeImages,
      gallery: { enabled: true },
      closeOnContentClick: false,
      mainClass: "",
      wrap: "brz-lb-wrap brz-lb-gallery brz-lb-close-btn-in brz-lb-auto-cursor",
      container: "brz-lb-container brz-lb-s-loading brz-lb-image-holder",
      bg: "brz-lb-bg"
    },
    {
      case: "a gallery with a main class, which also lands on the backdrop",
      type: "image",
      images: threeImages,
      gallery: { enabled: true },
      closeOnContentClick: false,
      mainClass: "brz brz-lightbox",
      wrap: "brz-lb-wrap brz-lb-gallery brz-lb-close-btn-in brz-lb-auto-cursor brz brz-lightbox",
      container: "brz-lb-container brz-lb-s-loading brz-lb-image-holder",
      bg: "brz-lb-bg brz brz-lightbox"
    },
    {
      case: "inline content whose click does not close",
      type: "inline",
      images: threeImages,
      gallery: undefined,
      closeOnContentClick: false,
      mainClass: "",
      wrap: "brz-lb-wrap brz-lb-close-btn-in brz-lb-auto-cursor",
      container: "brz-lb-container brz-lb-s-ready brz-lb-inline-holder",
      bg: "brz-lb-bg"
    },
    {
      case: "inline content whose click does close",
      type: "inline",
      images: threeImages,
      gallery: undefined,
      closeOnContentClick: true,
      mainClass: "",
      wrap: "brz-lb-wrap brz-lb-close-btn-in",
      container: "brz-lb-container brz-lb-s-ready brz-lb-inline-holder",
      bg: "brz-lb-bg"
    },
    {
      case: "an iframe whose content click does close",
      type: "iframe",
      images: threeImages,
      gallery: undefined,
      closeOnContentClick: true,
      mainClass: "",
      wrap: "brz-lb-wrap brz-lb-close-btn-in",
      container: "brz-lb-container brz-lb-s-ready brz-lb-iframe-holder",
      bg: "brz-lb-bg"
    },
    {
      case: "an iframe whose content click does not close",
      type: "iframe",
      images: threeImages,
      gallery: undefined,
      closeOnContentClick: false,
      mainClass: "",
      wrap: "brz-lb-wrap brz-lb-close-btn-in brz-lb-auto-cursor",
      container: "brz-lb-container brz-lb-s-ready brz-lb-iframe-holder",
      bg: "brz-lb-bg"
    }
  ])("builds the same shell for $case", ({ type, images, gallery, closeOnContentClick, mainClass, wrap, container, bg }) => {
    const open = (handle: LightboxHandle) => handle;

    if (type === "image") {
      const target = imageContainer(images);

      track(
        open(
          openLightbox({
            kind: "element",
            target,
            options: { ...imageShell, gallery, closeOnContentClick, mainClass }
          })
        )
      ).open();
    } else if (type === "inline") {
      inlineVideo();

      track(
        open(
          openLightbox({
            kind: "global",
            options: {
              type,
              src: "#inline-player",
              closeOnContentClick,
              mainClass,
              callbacks: { open: undefined, close: undefined }
            }
          })
        )
      ).open();
    } else {
      track(
        open(
          openLightbox({
            kind: "global",
            options: {
              type,
              src: "//example.com/player",
              closeOnContentClick,
              mainClass,
              callbacks: { open: undefined, close: undefined }
            }
          })
        )
      ).open();
    }

    expect(classesOf(".brz-lb-wrap")).toEqual(wrap.split(" ").sort());
    expect(classesOf(".brz-lb-container")).toEqual(container.split(" ").sort());
    expect(classesOf(".brz-lb-bg")).toEqual(bg.split(" ").sort());

    // The wrap is the focus target and owns the scroll container the content is centred in.
    expect(attrOf(".brz-lb-wrap", "tabindex")).toBe("-1");

    // The page behind the popup stops scrolling, and is handed back on close.
    expect(attrOf("html", "style")).toContain("overflow: hidden");

    expect(markupOf(".brz-lb-wrap")).toMatchSnapshot();
  });

  it("leaves nothing behind once closed", () => {
    const target = imageContainer(threeImages);
    const handle = track(
      openLightbox({
        kind: "element",
        target,
        options: { ...imageShell, closeOnContentClick: true, mainClass: "" }
      })
    );

    handle.open();
    handle.close();

    expect(document.querySelector(".brz-lb-wrap")).toBeNull();
    expect(document.querySelector(".brz-lb-bg")).toBeNull();
    expect(attrOf("html", "style")).not.toContain("overflow: hidden");
  });
});

describe("the content", () => {
  it.each([
    {
      case: "the titled first image of a gallery",
      images: threeImages,
      gallery: { enabled: true },
      goTo: 0,
      src: "/a.jpg",
      alt: "A",
      title: "A",
      counter: "1 of 3",
      arrows: 2
    },
    {
      case: "the third image of the same gallery",
      images: threeImages,
      gallery: { enabled: true },
      goTo: 2,
      src: "/c.jpg",
      alt: "C",
      title: "C",
      counter: "3 of 3",
      arrows: 2
    },
    {
      case: "an untitled image, which shows no title at all",
      images: [{ href: "/photos/holiday.jpg", title: "", alt: "Holiday" }],
      gallery: { enabled: true },
      goTo: 0,
      src: "/photos/holiday.jpg",
      alt: "Holiday",
      title: "",
      // A gallery of one is not a gallery: no counter, no arrows.
      counter: "",
      arrows: 0
    }
  ])("shows $case", ({ images, gallery, goTo, src, alt, title, counter, arrows }) => {
    const target = imageContainer(images);
    const handle = track(
      openLightbox({
        kind: "element",
        target,
        options: { ...imageShell, gallery, closeOnContentClick: false, mainClass: "" }
      })
    );

    handle.open();
    handle.goTo(goTo);

    expect(attrOf(".brz-lb-img", "src")).toBe(src);
    expect(attrOf(".brz-lb-img", "alt")).toBe(alt);
    expect(textOf(".brz-lb-title")).toBe(title);
    expect(textOf(".brz-lb-counter")).toBe(counter);

    // The image is capped to the viewport rather than scaled, so a tall photo never overflows.
    expect(attrOf(".brz-lb-img", "style")).toContain("max-height: 800px");

    // A gallery of one has nothing to navigate to, so it gets no arrows and no counter.
    expect(document.querySelectorAll(".brz-lb-arrow")).toHaveLength(arrows);

    expect(markupOf(".brz-lb-content")).toMatchSnapshot();
  });

  it("moves the inline element into the popup and appends the close button to it", () => {
    const inline = inlineVideo();

    track(
      openLightbox({
        kind: "global",
        options: {
          type: "inline",
          src: "#inline-player",
          closeOnContentClick: false,
          mainClass: "",
          callbacks: { open: undefined, close: undefined }
        }
      })
    ).open();

    expect(document.querySelector(".brz-lb-content > #inline-player")).toBe(inline);
    expect(document.querySelectorAll("#inline-player .brz-lb-close")).toHaveLength(1);
    expect(markupOf(".brz-lb-content")).toMatchSnapshot();
  });

  it.each([
    {
      case: "a youtube embed, which the video element already built",
      src: "//www.youtube.com/embed/ABC123?playlist=ABC123&autoplay=1&mute=0&loop=0&start=0&end=0"
    },
    {
      case: "a vimeo embed, whose fragment stays after the query",
      src: "//player.vimeo.com/video/ABC123?autoplay=1&mute=0&loop=0#t=10"
    },
    {
      case: "a url from anywhere else, used as it is",
      src: "//example.com/embed/ABC123?autoplay=1"
    }
  ])("shows $case", ({ src }) => {
    track(
      openLightbox({
        kind: "global",
        options: {
          type: "iframe",
          src,
          closeOnContentClick: true,
          mainClass: "",
          callbacks: { open: undefined, close: undefined }
        }
      })
    ).open();

    // The url is passed through as is, never rewritten.
    expect(attrOf(".brz-lb-iframe", "src")).toBe(src);
    expect(markupOf(".brz-lb-content")).toMatchSnapshot();
  });
});

describe("an image that is still loading", () => {
  it("waits, then reports ready", async () => {
    const target = imageContainer(threeImages);
    const handle = track(
      openLightbox({
        kind: "element",
        target,
        options: { ...imageShell, closeOnContentClick: false, mainClass: "" }
      })
    );

    handle.open();

    expect(classesOf(".brz-lb-container")).toContain("brz-lb-s-loading");
    expect(classesOf(".brz-lb-figure")).toContain("brz-lb-loading");
    expect(textOf(".brz-lb-preloader")).toBe("Loading...");

    loadImage(".brz-lb-img");

    expect(classesOf(".brz-lb-container")).toContain("brz-lb-s-ready");
    expect(classesOf(".brz-lb-container")).not.toContain("brz-lb-s-loading");
    expect(classesOf(".brz-lb-figure")).not.toContain("brz-lb-loading");
  });

  it("reports the failure instead of the image", async () => {
    const target = imageContainer(threeImages);

    track(
      openLightbox({
        kind: "element",
        target,
        options: { ...imageShell, closeOnContentClick: false, mainClass: "" }
      })
    ).open();

    failImage(".brz-lb-img");

    expect(classesOf(".brz-lb-container")).toContain("brz-lb-s-error");
    expect(textOf(".brz-lb-preloader")).toBe("The image could not be loaded.");
  });
});

describe("navigating a gallery", () => {
  const openGallery = (): LightboxHandle => {
    const target = imageContainer(threeImages);

    return track(
      openLightbox({
        kind: "element",
        target,
        options: { ...imageShell, gallery: { enabled: true }, closeOnContentClick: false, mainClass: "" }
      })
    );
  };

  const current = (): string => attrOf(".brz-lb-img", "src");

  it.each([
    { case: "the arrows move one image forward and back", act: (h: LightboxHandle) => {
        h.goTo(0);
        document.querySelector<HTMLElement>(".brz-lb-arrow-right")?.click();
        pressLeft();
        expect(current()).toBe("/a.jpg");
      } },
    { case: "the keyboard moves the same way", act: (h: LightboxHandle) => {
        h.goTo(0);
        pressRight();
        expect(current()).toBe("/b.jpg");
        pressLeft();
        expect(current()).toBe("/a.jpg");
      } },
    { case: "clicking the image itself moves forward", act: (h: LightboxHandle) => {
        h.goTo(0);
        document.querySelector<HTMLElement>(".brz-lb-img")?.click();
        expect(current()).toBe("/b.jpg");
      } },
    { case: "going past the last image wraps to the first", act: (h: LightboxHandle) => {
        h.goTo(2);
        document.querySelector<HTMLElement>(".brz-lb-arrow-right")?.click();
        expect(current()).toBe("/a.jpg");
      } },
    { case: "going before the first image wraps to the last", act: (h: LightboxHandle) => {
        h.goTo(0);
        document.querySelector<HTMLElement>(".brz-lb-arrow-left")?.click();
        expect(current()).toBe("/c.jpg");
      } },
    { case: "goTo jumps straight to an image", act: (h: LightboxHandle) => {
        h.goTo(1);
        expect(current()).toBe("/b.jpg");
        expect(textOf(".brz-lb-counter")).toBe("2 of 3");
      } }
  ])("$case", ({ act }) => {
    const handle = openGallery();

    handle.open();
    expect(current()).toBe("/a.jpg");

    act(handle);
  });
});

describe("closing", () => {
  const openGallery = (closeOnContentClick: boolean): LightboxHandle => {
    const target = imageContainer(threeImages);

    return track(
      openLightbox({
        kind: "element",
        target,
        options: { ...imageShell, gallery: { enabled: true }, closeOnContentClick, mainClass: "" }
      })
    );
  };

  it.each([
    {
      case: "the backdrop",
      closeOnContentClick: true,
      act: () => document.querySelector<HTMLElement>(".brz-lb-bg")?.click()
    },
    {
      case: "the backdrop, even when the content click does not close",
      closeOnContentClick: false,
      act: () => document.querySelector<HTMLElement>(".brz-lb-bg")?.click()
    },
    {
      case: "the close button",
      closeOnContentClick: false,
      act: () => document.querySelector<HTMLElement>(".brz-lb-close")?.click()
    },
    {
      case: "the content, when it is allowed to close",
      closeOnContentClick: true,
      act: () => document.querySelector<HTMLElement>(".brz-lb-figure")?.click()
    },
    {
      case: "escape",
      closeOnContentClick: false,
      act: () => pressEscape()
    }
  ])("closes on $case", ({ closeOnContentClick, act }) => {
    const handle = openGallery(closeOnContentClick);

    handle.open();
    act();

    expect(document.querySelector(".brz-lb-wrap")).toBeNull();
  });

  it.each([
    {
      case: "the arrows, which navigate instead",
      closeOnContentClick: false,
      act: () => document.querySelector<HTMLElement>(".brz-lb-arrow-right")?.click(),
      closed: false
    },
    {
      case: "the content, when it is not allowed to close",
      closeOnContentClick: false,
      act: () => document.querySelector<HTMLElement>(".brz-lb-figure")?.click(),
      closed: false
    }
  ])("stays open on $case", ({ closeOnContentClick, act, closed }) => {
    const handle = openGallery(closeOnContentClick);

    handle.open();
    act();

    expect(document.querySelector(".brz-lb-wrap") === null).toBe(closed);
  });

  it("hands focus back to whatever had it before", () => {
    const handle = openGallery(true);
    const button = document.createElement("button");

    document.body.append(button);
    button.focus();

    handle.open();
    handle.close();

    expect(document.activeElement).toBe(button);
  });
});

describe("inline content", () => {
  const openInline = (src: string): LightboxHandle =>
    track(
      openLightbox({
        kind: "global",
        options: {
          type: "inline",
          src,
          closeOnContentClick: false,
          mainClass: "",
          callbacks: { open: undefined, close: undefined }
        }
      })
    );

  it("leaves a hidden placeholder where the element used to be", () => {
    const inline = inlineVideo();
    const parent = inline.parentElement;

    const handle = openInline("#inline-player");

    handle.open();

    expect(inline.parentElement?.className).toBe("brz-lb-content");
    expect(parent?.children).toHaveLength(1);
    expect(parent?.firstElementChild?.className).toBe("brz-lb-hide");
  });

  it("puts the element back where it was, hidden", () => {
    const inline = inlineVideo();
    const parent = inline.parentElement;
    const handle = openInline("#inline-player");

    handle.open();
    handle.close();

    expect(inline.parentElement).toBe(parent);
    expect(inline.classList).toContain("brz-lb-hide");

    // The placeholder it left behind is taken away with it.
    expect(parent?.children).toHaveLength(1);
  });

  it("shows the element again on the next open", () => {
    const inline = inlineVideo();
    const handle = openInline("#inline-player");

    handle.open();
    handle.close();
    handle.open();

    expect(inline.classList).not.toContain("brz-lb-hide");

    // The close button is not duplicated by the round trip.
    expect(document.querySelectorAll("#inline-player .brz-lb-close")).toHaveLength(1);
  });

  it("puts the previous element back when another one is opened", () => {
    document.body.innerHTML = `<div id="first"><video id="v1"></video></div><div id="second"><video id="v2"></video></div>`;

    const first = openInline("#v1");

    first.open();
    first.close();

    const second = openInline("#v2");

    second.open();

    expect(document.querySelector("#v1")?.classList.contains("brz-lb-hide")).toBe(true);
    expect(document.querySelector(".brz-lb-content > #v2")).not.toBeNull();
  });

  it("reports a selector that matches nothing", () => {
    const handle = openInline("#missing");

    handle.open();

    expect(classesOf(".brz-lb-container")).toContain("brz-lb-s-error");
    expect(textOf(".brz-lb-preloader")).toBe("Content not found");
  });
});

describe("an iframe", () => {
  it("is reset on close, so the video stops playing", () => {
    const handle = track(
      openLightbox({
        kind: "global",
        options: {
          type: "iframe",
          src: "//example.com/embed/1",
          closeOnContentClick: true,
          mainClass: "",
          callbacks: { open: undefined, close: undefined }
        }
      })
    );

    handle.open();
    handle.close();

    // The popup is gone by the time this runs, so the src is read off the detached template.
    expect(attrOf("html", "style")).not.toContain("overflow: hidden");
  });
});
