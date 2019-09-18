import _ from "underscore";

// mainly inspired by html2canvas
export const browserSupportsScreenshots = () => {
  const canvas = document.createElement("canvas");
  const size = 100;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgb(0, 255, 0)";
  ctx.fillRect(0, 0, size, size);

  const greenImageSrc = canvas.toDataURL();

  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, size, size);

  const img = new Image();
  img.src = greenImageSrc;

  const svg = createForeignObjectSVG(size, size, 0, 0, img);
  return loadSerializedSVG(svg)
    .then(img => {
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Firefox 55 does not render inline <img /> tags
      if (!isGreenPixel(data)) {
        return Promise.reject(false);
      }

      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, size, size);

      const node = document.createElement("div");
      node.style.backgroundImage = `url(${greenImageSrc})`;
      node.style.height = `${size}px`;

      const svg = createForeignObjectSVG(size, size, 0, 0, node);
      return loadSerializedSVG(svg);
    })
    .then(img => {
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, size, size).data;

      // Edge does not render background-images
      return isGreenPixel(data);
    })
    .catch(e => false);
};

const createForeignObjectSVG = (width, height, x, y, node) => {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  const foreignObject = document.createElementNS(xmlns, "foreignObject");
  svg.setAttributeNS(null, "width", width);
  svg.setAttributeNS(null, "height", height);

  foreignObject.setAttributeNS(null, "width", "100%");
  foreignObject.setAttributeNS(null, "height", "100%");
  foreignObject.setAttributeNS(null, "x", x);
  foreignObject.setAttributeNS(null, "y", y);
  foreignObject.setAttributeNS(null, "externalResourcesRequired", "true");
  svg.appendChild(foreignObject);

  foreignObject.appendChild(node);

  return svg;
};

const loadSerializedSVG = svg => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;

    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      new XMLSerializer().serializeToString(svg)
    )}`;
  });
};

const isGreenPixel = data =>
  data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;
