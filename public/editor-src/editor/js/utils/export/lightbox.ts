function svgFromString(svgString: string): Element | null {
  const container = document.createElement("div");
  container.innerHTML = svgString.trim();
  return container.firstElementChild;
}

const createZoomControls = (mfpContent: Element): HTMLElement | null => {
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

  mfpContent.insertAdjacentElement("afterbegin", zoomControls);

  return zoomControls;
};

export const handleLightBoxZoom = (): void => {
  let currentZoom = 1;

  const mfpContent = document.querySelector(".mfp-content .mfp-figure");

  if (!mfpContent) return;

  const zoomControls = createZoomControls(mfpContent);
  if (!zoomControls) return;

  const zoomInBtn = zoomControls.querySelector(".zoom-in");
  const zoomOutBtn = zoomControls.querySelector(".zoom-out");

  if (zoomInBtn && zoomOutBtn) {
    zoomInBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentZoom = Math.min(currentZoom + 0.2, 3);
      const img = document.querySelector<HTMLElement>(".mfp-img");
      if (!img) return;

      img.style.transform = `scale(${currentZoom})`;
      img.style.transformOrigin = "center center";
    });

    zoomOutBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentZoom = Math.max(currentZoom - 0.2, 1);
      const img = document.querySelector<HTMLElement>(".mfp-img");
      if (!img) return;

      img.style.transform = `scale(${currentZoom})`;
      img.style.transformOrigin = "center center";
    });
  }
};
