/** Zoom controls, added to the figure through `callbacks.open` on an image lightbox. */

function svgFromString(svgString: string): Element | null {
  const container = document.createElement("div");
  container.innerHTML = svgString.trim();
  return container.firstElementChild;
}

const createZoomControls = (figure: Element): HTMLElement | null => {
  const maximizeIcon = svgFromString(
    '<svg viewBox="0 0 16 16" width="1em" height="1em" class="zoom-in" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.667 1.333a5.333 5.333 0 1 1 0 10.667 5.333 5.333 0 0 1 0-10.667z" stroke="currentColor"/><path d="m14 14-2.9-2.9M6.667 4.667v4m-2-2h4" stroke="currentColor" stroke-linecap="round"/></svg>'
  );
  const minimizeIcon = svgFromString(
    '<svg viewBox="0 0 16 16" width="1em" height="1em" class="zoom-out" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.667 1.333a5.333 5.333 0 1 1 0 10.667 5.333 5.333 0 0 1 0-10.667z" stroke="currentColor"/><path d="m14 14-2.9-2.9M4.667 6.667h4" stroke="currentColor" stroke-linecap="round"/></svg>'
  );

  if (!maximizeIcon || !minimizeIcon) {
    return null;
  }

  const zoomControls = document.createElement("div");
  zoomControls.className = "brz-lightbox-controls";

  zoomControls.append(maximizeIcon);
  zoomControls.append(minimizeIcon);

  figure.insertAdjacentElement("afterbegin", zoomControls);

  return zoomControls;
};

/** Zoom factor of the image on show, read off the image itself. */
const currentScale = (): number => {
  const transform = document.querySelector<HTMLElement>(".brz-lb-img")?.style.transform;
  const match = transform ? /scale\(([\d.]+)\)/.exec(transform) : null;

  return match?.[1] ? Number(match[1]) : 1;
};

const scaleImage = (factor: number): void => {
  const image = document.querySelector<HTMLElement>(".brz-lb-img");

  if (!image) return;

  image.style.transform = `scale(${factor})`;
  image.style.transformOrigin = "center center";
};

export const handleLightBoxZoom = (): void => {
  const figure = document.querySelector(".brz-lb-content .brz-lb-figure");

  if (!figure) return;

  const zoomControls = createZoomControls(figure);
  if (!zoomControls) return;

  const zoomInBtn = zoomControls.querySelector(".zoom-in");
  const zoomOutBtn = zoomControls.querySelector(".zoom-out");

  if (zoomInBtn && zoomOutBtn) {
    zoomInBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      scaleImage(Math.min(currentScale() + 0.2, 3));
    });

    zoomOutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      scaleImage(Math.max(currentScale() - 0.2, 1));
    });
  }
};
