import React, { useMemo } from "react";
import EditorIcon from "visual/component/EditorIcon";
import {
  animationStyle,
  getPreviewPointerStyle,
  getThumbnailHeightStyle,
  getTransitionPreview,
  previewClassName
} from "visual/component/Prompts/PromptBlocks/Library/Details/utils";
import ImageLoad from "visual/component/Prompts/PromptBlocks/common/ImageLoad";
import { t } from "visual/utils/i18n";

export interface Props {
  onBack: VoidFunction;
  previewPointer: string;
  activePageSrc: string;
  thumbnailHeight: number;
  title?: string;
}

export const Left = React.forwardRef<HTMLDivElement, Props>(
  ({ onBack, previewPointer, activePageSrc, thumbnailHeight, title }, ref) => {
    const _getHeightStyle = useMemo(() => {
      return getThumbnailHeightStyle(`${thumbnailHeight}px`);
    }, [thumbnailHeight]);

    const _getPreviewPointerStyle = useMemo(() => {
      return getPreviewPointerStyle(previewPointer);
    }, [previewPointer]);

    const _getTransitionPreview = useMemo(() => {
      return getTransitionPreview(thumbnailHeight ?? 0);
    }, [thumbnailHeight]);

    return (
      <div className="brz-ed-popup-two-details-left">
        <div className="brz-ed-popup-two-details-back" onClick={onBack}>
          <EditorIcon
            icon="nc-arrow-left"
            className="brz-ed-popup-two-details-back-icon"
          />
          {t("Back to Layouts")}
        </div>
        <div className="brz-ed-popup-two-details-title">
          <h2 className="brz-ed-popup-two-details-title-name">{title}</h2>
          <div className="brz-ed-popup-two-details-title-count">
            {t("layout")}
          </div>
        </div>
        <div
          ref={ref}
          className={previewClassName}
          style={{
            ..._getHeightStyle,
            ..._getPreviewPointerStyle
          }}
        >
          <ImageLoad
            className="brz-ed-popup-two-details-preview-img"
            src={activePageSrc}
            style={{
              ...animationStyle,
              ..._getTransitionPreview
            }}
          />
        </div>
      </div>
    );
  }
);

Left.displayName = "Left";
