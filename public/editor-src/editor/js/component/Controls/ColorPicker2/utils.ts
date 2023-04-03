import { mPipe } from "fp-utilities";

export const isInIframe = (w: Window): boolean => w.frameElement !== null;

const getIframeFromWindow = (w: Window): HTMLElement | null =>
  w.document.getElementById("brz-ed-iframe");

const addClassToElement = (element: HTMLElement): void => {
  element.classList.add("brz-ed--no-events");
};

const removeClassFromElement = (element: HTMLElement): void => {
  element.classList.remove("brz-ed--no-events");
};

export const disableIframeEvents = (w: Window) =>
  mPipe(getIframeFromWindow, addClassToElement)(w);

export const enableIframeEvents = (w: Window) =>
  mPipe(getIframeFromWindow, removeClassFromElement)(w);
