import React from "react";
import _ from "underscore";
import LazyLoadImage from "visual/component-new/LazyLoadImage";
import EditorIcon from "visual/component-new/EditorIcon";
import { imageWrapperSize } from "visual/utils/image";
import { blockThumbnailUrl } from "visual/utils/blocks";

const MAX_CONTAINER_WIDTH = 292;

class BlockThumbnail extends React.Component {
  static defaultProps = {
    showRemoveIcon: false,
    blockData: {},
    onClick: _.noop,
    onRemove: _.noop
  };

  handleClick = () => {
    const { blockData, onClick } = this.props;

    onClick(blockData);
  };

  handleRemove = () => {
    const { blockData, onRemove } = this.props;

    onRemove(blockData);
  };

  render() {
    const {
      blockData: { id, blank, thumbnailWidth, thumbnailHeight },
      showRemoveIcon
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
          <p className="brz-p">Add a Blank Block</p>
        </div>
      );
    } else {
      const src = blockThumbnailUrl(id);
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
            src={src}
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

export default BlockThumbnail;
