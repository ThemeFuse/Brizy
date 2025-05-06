import React, { useState } from "react";
import {
  MouseCoordinates,
  Props
} from "visual/component/Controls/ImageSetter/types";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/providers/ConfigProvider";
import { getImageUrl, imageWrapperSize } from "visual/utils/image";
import Draggable from "./Draggable";

const MAX_IMAGE_SETTER_WIDTH = 140;

function Image(props: Props) {
  const {
    src = "",
    x: _x = 50,
    y: _y = 50,
    width: _width = 0,
    height: _height = 0,
    customUrl = false,
    showPointer = true,
    fileName = "",
    onChange
  } = props;

  const [x, setX] = useState(_x);
  const [y, setY] = useState(_y);

  const [prevX, setPrevX] = useState<number | null>(null);
  const [prevY, setPrevY] = useState<number | null>(null);

  const config = useConfig();

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
    : getImageUrl(
        {
          fileName,
          uid: src,
          sizeType: SizeType.custom,
          crop: { iW: MAX_IMAGE_SETTER_WIDTH, iH: "any" }
        },
        config
      );

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
