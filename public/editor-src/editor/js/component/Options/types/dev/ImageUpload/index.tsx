import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { ImageSetter } from "visual/component/Controls/ImageSetter";
import { Image } from "./model";
import { Component } from "./Types";
import {
  DEFAULT_VALUE,
  getModel,
  getElementModel,
  patchPosition,
  patchImageData
} from "visual/component/Options/types/dev/ImageUpload/utils";
import { t } from "visual/utils/i18n";

export const ImageUpload: Component = ({ onChange, value, config, label }) => {
  const className = classNames(
    "brz-ed-option__focal-point",
    "brz-ed-option__inline"
  );

  const disableSizes = config?.disableSizes ?? true;
  const sizes = useMemo(
    () => [
      {
        value: "custom",
        label: t("Custom")
      },
      {
        value: "original",
        label: t("Original")
      },
      ...(config?.sizes ?? [])
    ],
    [config?.sizes]
  );

  const onImageChange = useCallback(
    (v: Image, meta: { isChanged: "image" | "pointer" }): void => {
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
    },
    [onChange]
  );

  const onTypeChange = useCallback(
    (sizeType: string) => onChange({ sizeType }),
    [onChange]
  );

  return (
    <>
      {label}
      <ImageSetter<string>
        className={className}
        onlyPointer={!config?.edit}
        showPointer={value.extension !== "svg" && (config?.pointer ?? true)}
        extension={value.extension}
        x={value.x}
        y={value.y}
        width={value.width}
        height={value.height}
        src={value.src}
        onChange={onImageChange}
        size={value.sizeType}
        sizes={!disableSizes ? sizes : undefined}
        onSizeChange={onTypeChange}
      />
    </>
  );
};

ImageUpload.getModel = getModel;

ImageUpload.getElementModel = getElementModel;

ImageUpload.defaultValue = DEFAULT_VALUE;
