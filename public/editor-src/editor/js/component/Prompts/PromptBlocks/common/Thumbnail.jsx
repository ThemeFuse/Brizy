import React, { Component } from "react";
import _ from "underscore";
import LazyLoadImage from "visual/component/LazyLoadImage";
import EditorIcon from "visual/component/EditorIcon";
import { imageWrapperSize } from "visual/utils/image";
import { t } from "visual/utils/i18n";

const MAX_CONTAINER_WIDTH = 292;

const animationStyle = {
  animationName: "fadeIn",
  animationFillMode: "both",
  animationDelay: "200ms",
  animationDuration: "200ms"
};

export default class Thumbnail extends Component {
  static defaultProps = {
    showRemoveIcon: false,
    blockData: {},
    animation: false,
    onAdd: _.noop,
    onRemove: _.noop,
    onImageLoaded: _.noop
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
      animation,
      data: {
        thumbnailSrc,
        thumbnailWidth,
        thumbnailHeight,
        blank,
        showRemoveIcon
      },
      onImageLoaded
    } = this.props;
    let thumbnail;

    const isBlank = blank && blank === "blank";
    if (isBlank) {
      thumbnail = (
        <div
          onClick={this.handleClick}
          className="brz-ed-popup-two-block-item brz-ed-popup-two-block__blank brz-ed-popup-two-block__blank-first"
        >
          <div className="brz-ed-container-trigger brz-ed-container-trigger--small" />
          <p className="brz-p">{t("Add a blank block")}</p>
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
          className="brz-figure brz-ed-popup-two-block-item"
          onClick={this.handleClick}
        >
          <LazyLoadImage
            observerRootSelector=".brz-ed-popup-two-blocks-body"
            style={animation ? animationStyle : {}}
            src={thumbnailSrc}
            width={width}
            height={height}
            onImageLoaded={onImageLoaded}
          />
          <span className="brz-ed-popup-two-block__span-pro">pro</span>
          <span className="brz-ed-popup-two-block__span-lock">
            <EditorIcon icon="nc-lock" />
          </span>
        </figure>
      );
    }

    return (
      <div className="brz-ed-popup-two-block">
        {showRemoveIcon && (
          <div
            onClick={this.handleRemove}
            className="brz-ed-popup-two-block-remove"
          >
            <EditorIcon icon="nc-trash" />
          </div>
        )}
        {thumbnail}
      </div>
    );
  }
}

export class LayoutThumbnail extends Component {
  state = {
    thumbnailLoaded: false
  };

  handleLoaded = () => {
    this.setState({
      thumbnailLoaded: true
    });
  };

  render() {
    const {
      data: { name, pages, color },
      ...otherProps
    } = this.props;
    const { thumbnailLoaded } = this.state;

    return (
      <div
        className="brz-ed-popup-two-block-info"
        style={thumbnailLoaded ? animationStyle : {}}
      >
        <Thumbnail
          {...otherProps}
          data={this.props.data}
          onImageLoaded={this.handleLoaded}
        />
        {thumbnailLoaded && pages.length > 1 && (
          <span
            className="brz-ed-popup-two-block-info-color"
            style={{ backgroundColor: color }}
          >
            <span
              className="brz-ed-popup-two-block-info-color-opacity"
              style={{ backgroundColor: color }}
            />
          </span>
        )}
        <div className="brz-ed-popup-two-block-info-downline">
          <div className="brz-ed-popup-two-block-info-title">{name}</div>
          <div className="brz-ed-popup-two-block-info-title">
            {pages.length} {pages.length > 1 ? t("layouts") : t("layout")}
          </div>
        </div>
      </div>
    );
  }
}
