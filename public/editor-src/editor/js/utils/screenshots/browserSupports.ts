// mainly inspired by html2canvas
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

let browsersSupports: boolean | undefined;
let count = 0;

export const browserSupports = async () => {
  while (count < 5) {
    browsersSupports = undefined;
    const isSupported = await _browserSupports();

    if (isSupported) {
      count = 0;
      return isSupported;
    } else {
      count = count + 1;
    }
  }

  if (count > 5) {
    browsersSupports = false;
  }

  return Promise.reject(false);
};

export const _browserSupports = () => {
  if (browsersSupports) {
    return Promise.resolve(true);
  }
  if (browsersSupports === false) {
    return Promise.reject(false);
  }

  const canvas = document.createElement("canvas");
  const size = 100;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    browsersSupports = false;
    return Promise.resolve(browsersSupports);
  }

  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fillRect(0, 0, size, size);

  const greenImageSrc = canvas.toDataURL();

  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, size, size);

  const img = new Image();
  img.src = greenImageSrc;

  const svg = createForeignObjectSVG(size, size, 0, 0, img);
  return loadSerializedSVG(svg)
    .then((img) => {
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Firefox 55 does not render inline <img /> tags
      if (!isGreenPixel(data)) {
        browsersSupports = false;
        return Promise.reject(browsersSupports);
      }

      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, size, size);

      const node = document.createElement("div");
      node.style.backgroundImage = `url("${greenImageSrc}")`;
      node.style.height = `${size}px`;

      const svg = createForeignObjectSVG(size, size, 0, 0, node);
      return loadSerializedSVG(svg);
    })
    .then((img) => {
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Edge does not render background-images
      browsersSupports = isGreenPixel(data);
      return browsersSupports;
    })
    .catch(() => {
      browsersSupports = false;
      return browsersSupports;
    });
};

const createForeignObjectSVG = (
  width: number,
  height: number,
  x: number,
  y: number,
  node: HTMLElement
) => {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  const foreignObject = document.createElementNS(xmlns, "foreignObject");
  svg.setAttributeNS(null, "width", `${width}`);
  svg.setAttributeNS(null, "height", `${height}`);

  foreignObject.setAttributeNS(null, "width", "100%");
  foreignObject.setAttributeNS(null, "height", "100%");
  foreignObject.setAttributeNS(null, "x", `${x}`);
  foreignObject.setAttributeNS(null, "y", `${y}`);
  foreignObject.setAttributeNS(null, "externalResourcesRequired", "true");
  svg.appendChild(foreignObject);

  foreignObject.appendChild(node);

  return svg;
};

const loadSerializedSVG = (svg: SVGElement): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      new XMLSerializer().serializeToString(svg)
    )}`;
  });
};

const isGreenPixel = (data: Uint8ClampedArray) =>
  data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;

const hasApiScreenshot = (config: ConfigCommon): boolean => {
  const screenshots = config.api?.screenshots;

  return (
    typeof screenshots?.create === "function" &&
    typeof screenshots?.update === "function"
  );
};

export const isScreenshotSupported = async (
  config: ConfigCommon
): Promise<boolean> => {
  try {
    const browserSupport = await browserSupports();
    return browserSupport && hasApiScreenshot(config);
  } catch (_) {
    return false;
  }
};
