import classNames from "classnames";
import React, { useCallback, useMemo } from "react";
import { ImageSetter } from "visual/component/Controls/ImageSetter";
import { useConfig } from "visual/providers/ConfigProvider";
import { t } from "visual/utils/i18n";
import { ImageType } from "visual/utils/image/types";
import { Component } from "./Types";
import { Image } from "./model";
import { configSizeToSize } from "./utils";

export const ImageUpload: Component = ({ onChange, value, config, label }) => {
  const className = classNames(
    "brz-ed-option__focal-point",
    "brz-ed-option__inline"
  );

  const globalConfig = useConfig();

  const { addMedia } = globalConfig.api?.media ?? {};

  const disableSizes = config?.disableSizes ?? false;
  const imageSizes = globalConfig.imageSizes;
  const sizes = useMemo(
    () => [
      {
        value: "custom",
        label: t("Custom")
      },
      ...(imageSizes ?? []).map(configSizeToSize)
    ],
    [imageSizes]
  );

  const onImageChange = useCallback(
    (v: Image, meta: { isChanged: "image" | "pointer" }): void => {
      switch (meta.isChanged) {
        case "image":
          {
            onChange({
              imageSrc: v.src,
              imageFileName: v.fileName,
              imageExtension: v.extension,
              imageWidth: v.width,
              imageHeight: v.height,
              imageType: ImageType.Internal,
              alt: v.altTitle
            });
          }
          break;
        case "pointer":
          {
            onChange({
              positionX: v.x,
              positionY: v.y
            });
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
        onlyPointer={!(config?.edit ?? true)}
        showPointer={
          value.sizeType === "custom" &&
          value.extension !== "svg" &&
          (config?.pointer ?? true)
        }
        extension={value.extension}
        x={value.x}
        y={value.y}
        width={value.width}
        height={value.height}
        src={value.src}
        fileName={value.fileName}
        onChange={onImageChange}
        size={value.sizeType}
        sizes={!disableSizes && value.extension !== "svg" ? sizes : undefined}
        onSizeChange={onTypeChange}
        acceptedExtensions={config?.acceptedExtensions}
        addMedia={addMedia}
        globalConfig={globalConfig}
      />
    </>
  );
};
