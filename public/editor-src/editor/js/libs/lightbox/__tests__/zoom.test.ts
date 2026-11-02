// The zoom controls are added by `callbacks.open`, so the suites open the lightbox first.

import { openLightbox, handleLightBoxZoom } from "visual/libs/lightbox";
import type { LightboxHandle } from "visual/libs/lightbox";
import { attrOf, markupOf, track, useLightboxEnv } from "../__fixtures__/env";
import { imageContainer } from "../__fixtures__/markup";

useLightboxEnv();

const openZoomableImage = (): LightboxHandle => {
  const target = imageContainer([{ href: "/a.jpg", title: "A", alt: "A" }]);

  return track(
    openLightbox({
      kind: "element",
      target,
      options: {
        delegate: "a",
        type: "image",
        gallery: undefined,
        closeOnContentClick: true,
        mainClass: "",
        callbacks: { open: handleLightBoxZoom, close: undefined }
      }
    })
  );
};

/** A gallery of the same shape the ImageGallery call site opens, so `goTo` has somewhere to go. */
const openZoomableGallery = (): LightboxHandle => {
  const target = imageContainer([
    { href: "/a.jpg", title: "A", alt: "A" },
    { href: "/b.jpg", title: "B", alt: "B" },
    { href: "/c.jpg", title: "C", alt: "C" }
  ]);

  return track(
    openLightbox({
      kind: "element",
      target,
      options: {
        delegate: "a",
        type: "image",
        gallery: { enabled: true },
        closeOnContentClick: false,
        mainClass: "",
        callbacks: { open: handleLightBoxZoom, close: undefined }
      }
    })
  );
};

// jsdom has no `click()` on `<svg>`, so the event is dispatched.
const click = (selector: string): void => {
  const control = document.querySelector(selector);

  if (!control) {
    throw new Error(`no element matches ${selector}`);
  }

  control.dispatchEvent(new MouseEvent("click", { bubbles: true }));
};

/** The zoom factor read off the image; it carries float error (1.6 is 1.5999…). */
const scale = (): number => {
  const transform = attrOf(".brz-lb-img", "style");
  const match = /scale\(([\d.]+)\)/.exec(transform);

  if (!match) {
    throw new Error(`no scale in "${transform}"`);
  }

  return Number(match[1]);
};

describe("the zoom controls", () => {
  it("are added to the top of the figure, as a pair", () => {
    openZoomableImage().open();

    expect(document.querySelector(".brz-lb-figure > .brz-lightbox-controls")).not.toBeNull();
    expect(document.querySelectorAll(".brz-lightbox-controls > svg")).toHaveLength(2);
    expect(markupOf(".brz-lightbox-controls")).toMatchSnapshot();
  });

  it("do nothing when there is no image open", () => {
    expect(() => handleLightBoxZoom()).not.toThrow();
    expect(document.querySelector(".brz-lightbox-controls")).toBeNull();
  });

  it.each([
    { case: "a move to another image", steps: [1] },
    { case: "a move away and back", steps: [1, 0] },
    { case: "a move the length of the gallery", steps: [1, 2, 0] }
  ])("stay on the figure through $case", ({ steps }) => {
    const handle = openZoomableGallery();

    handle.open();
    steps.forEach((step) => handle.goTo(step));

    expect(document.querySelector(".brz-lb-figure > .brz-lightbox-controls")).not.toBeNull();
    expect(document.querySelectorAll(".brz-lightbox-controls > svg")).toHaveLength(2);
  });

  it("start the image they move to unzoomed", () => {
    const handle = openZoomableGallery();

    handle.open();
    click(".zoom-in");
    click(".zoom-in");
    expect(scale()).toBeCloseTo(1.4, 5);

    // The figure outlives the image, so the factor must not carry over.
    handle.goTo(1);
    click(".zoom-in");

    expect(scale()).toBeCloseTo(1.2, 5);
  });

  it.each([
    { case: "one step in", clicks: [".zoom-in"], factor: 1.2 },
    { case: "three steps in", clicks: [".zoom-in", ".zoom-in", ".zoom-in"], factor: 1.6 },
    { case: "in then out again", clicks: [".zoom-in", ".zoom-in", ".zoom-out"], factor: 1.2 },
    { case: "out before any zoom in", clicks: [".zoom-out"], factor: 1 },
    { case: "further out than the start", clicks: [".zoom-out", ".zoom-out"], factor: 1 }
  ])("scales the image $case", ({ clicks, factor }) => {
    openZoomableImage().open();

    clicks.forEach(click);

    // An unzoomed image carries no transform at all, and a zoomed one keeps its `max-height`.
    expect(scale()).toBeCloseTo(factor, 5);
  });

  it("centres the zoom", () => {
    openZoomableImage().open();

    click(".zoom-in");

    expect(attrOf(".brz-lb-img", "style")).toContain("transform-origin: center center");
  });

  it("stops at three times the size, however many times it is asked", () => {
    openZoomableImage().open();

    for (let step = 0; step < 20; step += 1) {
      click(".zoom-in");
    }

    expect(scale()).toBeCloseTo(3, 5);
  });

  it("does not close the popup when a control is clicked", () => {
    const handle = openZoomableImage();

    handle.open();
    click(".zoom-in");

    expect(document.querySelector(".brz-lb-wrap")).not.toBeNull();
  });
});
