import _ from "underscore";

const calcSizesFluid = (cW, data) => {
  data.imageHeight = cW / (data.imageWidth / data.imageHeight);
  data.imageWidth = cW;

  return data;
};
const calcImageMargin = (sizes, isPreview) => {
  let mL, mH, x1, y1;

  const ratioX = sizes.positionX;
  const ratioY = sizes.positionY;

  const maxWidth = sizes.imgWidth - sizes.wrapperWidth;
  const maxHeight = sizes.imgHeight - sizes.wrapperHeight;

  x1 = ratioX * sizes.imgWidth / 100;
  y1 = ratioY * sizes.imgHeight / 100;

  mL = x1 - sizes.wrapperWidth / 2;
  mH = y1 - sizes.wrapperHeight / 2;

  if (sizes.imgWidth > sizes.wrapperWidth) {
    if (mL < 0) {
      mL = 0;
    }

    if (mL > maxWidth) {
      mL = maxWidth;
    }
  } else {
    mL = isPreview ? 0 : maxWidth / 2;
  }

  if (sizes.imgHeight > sizes.wrapperHeight) {
    if (mH < 0) {
      mH = 0;
    }

    if (mH > maxHeight) {
      mH = maxHeight;
    }
  } else {
    mH = isPreview ? 0 : maxHeight / 2;
  }

  return {
    left: -mL,
    top: -mH
  };
};

export const calcWrapperSizes = (
  cW,
  { imageWidth, imageHeight, resize, width, height }
) => {
  const iH = cW / (imageWidth / imageHeight);

  return {
    width: Math.round(cW * (resize / 100) * (width / 100)),
    height: Math.round(iH * (resize / 100) * (height / 100))
  };
};

export const calcImageSizes = (cW, v, isPreview = false) => {
  let data = _.extend({}, v);
  const wrapperSize = calcWrapperSizes(cW, data);

  data.wrapperWidth = wrapperSize.width;
  data.wrapperHeight = wrapperSize.height;

  const imageSizes = calcSizesFluid(cW, data);

  data = _.extend(data, imageSizes);

  let heightOffset = 1;
  if (data.height > 100) {
    heightOffset = data.height / 100;
  }
  let imgWidth =
    data.imageWidth * (data.resize / 100) * (data.zoom / 100) * heightOffset;
  let imgHeight =
    data.imageHeight * (data.resize / 100) * (data.zoom / 100) * heightOffset;
  const containerWidth = wrapperSize.width * (data.zoom / 100);
  const containerHeight = wrapperSize.height * (data.zoom / 100);
  const imgMarginWidth = imgWidth - containerWidth;
  const imgMarginHeight = imgHeight - containerHeight;

  var sizes = {
    imgWidth: imgWidth,
    imgHeight: imgHeight,
    imgMarginWidth: imgMarginWidth,
    imgMarginHeight: imgMarginHeight,
    wrapperWidth: data.wrapperWidth,
    wrapperHeight: data.wrapperHeight,
    positionX: data.positionX,
    positionY: data.positionY
  };
  const margin = calcImageMargin(sizes, isPreview);

  return {
    width: Math.round(sizes.imgWidth),
    height: Math.round(sizes.imgHeight),
    marginLeft: Math.round(margin.left),
    marginTop: Math.round(margin.top)
  };
};
