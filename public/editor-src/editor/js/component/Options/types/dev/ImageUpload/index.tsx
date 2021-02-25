import React from "react";
import classNames from "classnames";
import ImageSetter from "visual/component/Controls/ImageSetter";
import { Image } from "./model";
import { Component } from "./Types";
import {
  DEFAULT_VALUE,
  getModel,
  getElementModel,
  patchPosition,
  patchImageData
} from "visual/component/Options/types/dev/ImageUpload/utils";

export const ImageUpload: Component = ({ onChange, value, config, label }) => {
  const className = classNames(
    "brz-ed-option__focal-point",
    "brz-ed-option__inline"
  );

  const onImageChange = (
    v: Image,
    meta: { isChanged: "image" | "pointer" }
  ): void => {
    switch (meta.isChanged) {
      case "image":
        {
          const patch = patchImageData(v, value);
          patch && onChange(patch);
        }
        break;
      case "pointer":
        {
          const patch = patchPosition(v, value);
          patch && onChange(patch);
        }
        break;
    }
  };

  return (
    <>
      {label}
      <ImageSetter
        className={className}
        onlyPointer={!config?.edit}
        showPointer={value.extension !== "svg" && config?.pointer}
        x={value.x}
        y={value.y}
        width={value.width}
        height={value.height}
        src={value.src}
        onChange={onImageChange}
      />
    </>
  );
};

ImageUpload.getModel = getModel;

ImageUpload.getElementModel = getElementModel;

ImageUpload.defaultValue = DEFAULT_VALUE;

ImageUpload.defaultProps = {
  className: "",
  config: {
    pointer: true,
    edit: true
  }
};
