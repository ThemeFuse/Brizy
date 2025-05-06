import React, { ReactElement, useMemo } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { useConfig } from "visual/providers/ConfigProvider";
import { Block } from "visual/types/Block";
import { blockThumbnailData } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import { imageWrapperSize } from "visual/utils/image";
import { FCC } from "visual/utils/react/types";

interface Props {
  block: Block;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
}

const MAX_CONTAINER_WIDTH = 140;

export const Thumbnail: FCC<Props> = ({
  block,
  onEdit,
  onDelete
}): ReactElement => {
  const config = useConfig();
  const { screenshot } = config.urls ?? {};

  const { width, height, url } = useMemo(
    () => blockThumbnailData({ block, screenshot, config }),
    [block, screenshot, config]
  );

  const { width: wrapperWidth, height: wrapperHeight } = useMemo(
    () => imageWrapperSize(width, height, MAX_CONTAINER_WIDTH),
    [width, height]
  );

  const style = useMemo(
    () => ({
      width: `${wrapperWidth}px`,
      height: `${wrapperHeight}px`
    }),
    [wrapperWidth, wrapperHeight]
  );

  return (
    <figure
      className="brz-figure brz-ed-option__prompt-popup__image"
      style={style}
    >
      <img
        src={url}
        className="brz-img"
        onClick={onEdit}
        alt={t("Popup Thumbnail")}
      />
      {typeof onDelete === "function" && (
        <div className="brz-ed-option__prompt-popup-remove" onClick={onDelete}>
          <EditorIcon icon="nc-circle-remove" />
        </div>
      )}
    </figure>
  );
};
