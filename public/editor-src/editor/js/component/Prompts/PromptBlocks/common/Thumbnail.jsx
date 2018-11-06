import React from "react";
import _ from "underscore";
import LazyLoadImage from "visual/component-new/LazyLoadImage";
import EditorIcon from "visual/component-new/EditorIcon";
import { imageWrapperSize } from "visual/utils/image";
import { t } from "visual/utils/i18n";

const MAX_CONTAINER_WIDTH = 292;

export default class Thumbnail extends React.Component {
  static defaultProps = {
    showRemoveIcon: false,
    blockData: {},
    onAdd: _.noop,
    onRemove: _.noop
  };

  handleClick = () => {
    const { data, onAdd } = this.props;

    onAdd(data);
  };

  handleRemove = () => {
    const { data, onRemove } = this.props;

    onRemove(data);
  };

  render() {
    const {
      data: {
        thumbnailSrc,
        thumbnailWidth,
        thumbnailHeight,
        blank,
        showRemoveIcon
      }
    } = this.props;
    let thumbnail;

    const isBlank = blank && blank === "blank";
    if (isBlank) {
      thumbnail = (
        <div
          onClick={this.handleClick}
          className="brz-ed-popup-block-item brz-ed-popup-block__blank"
        >
          <div className="brz-ed-container-trigger brz-ed-container-trigger--small" />
          <p className="brz-p">{t("Add a Blank Block")}</p>
        </div>
      );
    } else {
      const { width, height } = imageWrapperSize(
        thumbnailWidth,
        thumbnailHeight,
        MAX_CONTAINER_WIDTH
      );

      thumbnail = (
        <figure
          className="brz-figure brz-ed-popup-block-item"
          onClick={this.handleClick}
        >
          <LazyLoadImage
            observerRootSelector=".brz-ed-popup-blocks-body"
            src={thumbnailSrc}
            width={width}
            height={height}
          />
          <figcaption>
            <div className="brz-ed-container-trigger brz-ed-container-trigger--small" />
          </figcaption>
        </figure>
      );
    }

    return (
      <div className="brz-ed-popup-block">
        {showRemoveIcon && (
          <div
            onClick={this.handleRemove}
            className="brz-ed-popup-block__remove"
          >
            <EditorIcon icon="nc-circle-remove" />
          </div>
        )}
        {thumbnail}
      </div>
    );
  }
}
