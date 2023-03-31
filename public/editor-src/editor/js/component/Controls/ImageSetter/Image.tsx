import React, { useState } from "react";
import {
  ImageProps,
  MouseCoordinates
} from "visual/component/Controls/ImageSetter/types";
import { imageUrl, imageWrapperSize, svgUrl } from "visual/utils/image";
import Draggable from "./Draggable";

const MAX_IMAGE_SETTER_WIDTH = 140;

const isSVG = (extension: string) => extension === "svg";

function Image(props: ImageProps) {
  const {
    src = "",
    x: _x = 50,
    y: _y = 50,
    extension,
    width: _width = 0,
    height: _height = 0,
    customUrl = false,
    showPointer = true,
    onChange
  } = props;

  const [x, setX] = useState(_x);
  const [y, setY] = useState(_y);

  const [prevX, setPrevX] = useState<number | null>(null);
  const [prevY, setPrevY] = useState<number | null>(null);

  if (prevX !== _x) {
    setX(_x);
    setPrevX(_x);
  }

  if (prevY !== _y) {
    setY(_y);
    setPrevY(_y);
  }

  function handleChangePosition(value: MouseCoordinates) {
    value.x !== x && setX(value.x);
    value.y !== y && setY(value.y);

    onChange(value, { isChanged: "pointer" });
  }

  const imgUrl = customUrl
    ? src
    : isSVG(extension)
    ? svgUrl(src)
    : imageUrl(src, {
        iW: MAX_IMAGE_SETTER_WIDTH,
        iH: "any"
      });

  const { width, height } = imageWrapperSize(
    _width,
    _height,
    MAX_IMAGE_SETTER_WIDTH
  );

  return (
    <div
      key="setter"
      className="brz-ed-control__focal-point__setter"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {imgUrl && <img className="brz-img" src={imgUrl} />}
      {showPointer && (
        <Draggable
          bounds="parent"
          position={{ x, y }}
          onDrag={handleChangePosition}
          onDragEnd={handleChangePosition}
        >
          <div className="brz-ed-control__focal-point__point" />
        </Draggable>
      )}
    </div>
  );
}

export default Image;
