import React, { ReactElement, useMemo } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Block } from "visual/types";
import { blockThumbnailData } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import { imageWrapperSize } from "visual/utils/image";
import { FCC } from "visual/utils/react/types";

interface Props {
  popupBlock: Block;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
}

const MAX_CONTAINER_WIDTH = 140;

export const Thumbnail: FCC<Props> = ({
  popupBlock,
  onEdit,
  onDelete
}): ReactElement => {
  const { width, height, url } = useMemo(
    () =>
      blockThumbnailData(popupBlock, {
        searchScreenshotInStoreFirst: true
      }),
    [popupBlock]
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
