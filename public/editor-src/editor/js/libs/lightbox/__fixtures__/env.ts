// Test helpers for the lightbox suites: jsdom stubs for viewport height and `keyCode`.

import type { LightboxHandle } from "../types";

export const VIEWPORT_HEIGHT = 800;

let openHandles: LightboxHandle[] = [];

export const track = <T extends LightboxHandle>(handle: T): T => {
  openHandles.push(handle);

  return handle;
};

/** Serialised markup, one node per line, so snapshot diffs are readable. */
export const markupOf = (selector: string): string => {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`no element matches ${selector}`);
  }

  return element.outerHTML.replace(/></g, ">\n<");
};

/** Class list, order-insensitive. Snapshots pin the exact order; assertions only pin membership. */
export const classesOf = (selector: string): string[] => {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`no element matches ${selector}`);
  }

  return [...element.classList].sort();
};

export const textOf = (selector: string): string => {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`no element matches ${selector}`);
  }

  return element.textContent ?? "";
};

export const attrOf = (selector: string, name: string): string => {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`no element matches ${selector}`);
  }

  return element.getAttribute(name) ?? "";
};

/** jsdom never loads an `<img>`; this fires the `load` a browser would. */
export const loadImage = (selector: string, naturalWidth = 1200): void => {
  const image = document.querySelector<HTMLImageElement>(selector);

  if (!image) {
    throw new Error(`no element matches ${selector}`);
  }

  Object.defineProperty(image, "complete", { configurable: true, value: true });
  Object.defineProperty(image, "naturalWidth", { configurable: true, value: naturalWidth });
  image.dispatchEvent(new Event("load"));
};

export const failImage = (selector: string): void => {
  const image = document.querySelector<HTMLImageElement>(selector);

  if (!image) {
    throw new Error(`no element matches ${selector}`);
  }

  Object.defineProperty(image, "complete", { configurable: true, value: true });
  image.dispatchEvent(new Event("error"));
};

const keyEvent = (type: string, key: string, keyCode: number): void => {
  const event = new KeyboardEvent(type, { key, bubbles: true });
  Object.defineProperty(event, "keyCode", { value: keyCode });
  document.dispatchEvent(event);
};

export const pressRight = (): void => keyEvent("keydown", "ArrowRight", 39);
export const pressLeft = (): void => keyEvent("keydown", "ArrowLeft", 37);
export const pressEscape = (): void => keyEvent("keyup", "Escape", 27);

export const useLightboxEnv = (): void => {
  beforeEach(() => {
    openHandles = [];
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("style");
    Object.defineProperty(document.documentElement, "clientHeight", {
      configurable: true,
      value: VIEWPORT_HEIGHT
    });
  });

  afterEach(() => {
    openHandles.forEach((handle) => handle.close());
    openHandles = [];
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("style");
  });
};
