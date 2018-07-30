import React, { Component } from "react";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component-new/EditorIcon";
import { imageWrapperSize } from "visual/utils/image";
import { getBlocksThumbs } from "visual/utils/options";
import { blockThumbnailUrl } from "visual/utils/blocks";

const MAX_CONTAINER_WIDTH = 140;

class BlockThumbnail extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    attr: {},
    helper: false,
    helperContent: "",
    display: "inline",
    value: ""
  };

  handleClick = id => {
    if (this.props.value === id) {
      this.props.onChange("");
    } else {
      this.props.onChange(id);
    }
  };

  renderLabel = () => {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div className="brz-ed-option__helper__content">{helperContent}</div>
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label">
        {label}
        {helper}
      </div>
    );
  };

  renderThumbnails(blocks) {
    const { value } = this.props;
    return blocks.map(
      ({ id, blockId, title, thumbnailWidth, thumbnailHeight }, key) => {
        const className = classnames("brz-figure", {
          active: id === value
        });
        const { width, height } = imageWrapperSize(
          thumbnailWidth,
          thumbnailHeight,
          MAX_CONTAINER_WIDTH
        );

        return (
          <figure
            key={key}
            className={className}
            style={{
              width: `${width}px`,
              height: `${height}px`
            }}
            onClick={() => {
              this.handleClick(id);
            }}
          >
            <div className="brz-ed-option__block-thumbnail-loading">
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            </div>
            <img
              className="brz-img"
              src={blockThumbnailUrl(blockId)}
              alt={title}
            />
          </figure>
        );
      }
    );
  }

  render() {
    const blocks = getBlocksThumbs();
    const { className: _className, attr, label, helper, display } = this.props;

    const className = classnames(
      "brz-ed-option__block-thumbnail",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        <ScrollPane
          style={{ height: "100%", overflow: "hidden" }}
          className="brz-ed-scroll-pane brz-ed-scroll--small brz-ed-scroll--darker"
        >
          {this.renderThumbnails(blocks)}
        </ScrollPane>
      </div>
    );
  }
}

export default BlockThumbnail;
