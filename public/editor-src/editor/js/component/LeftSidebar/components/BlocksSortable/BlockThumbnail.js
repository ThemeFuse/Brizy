import React, { Component } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { blockThumbnailData } from "visual/utils/blocks";
import { preloadImage } from "visual/utils/image";
import { t } from "visual/utils/i18n";

export default class BlockThumbnail extends Component {
  static defaultProps = {
    blockData: null,
    spinnerDelay: 300
  };

  state = {
    blockData: this.props.blockData,
    imageFetched: false,
    showSpinner: false
  };

  componentDidMount() {
    this.mounted = true;
    this.cancelCurrentPreload = this.preloadThumbnail(this.state.blockData);
    this.showSpinnerTimeout = setTimeout(() => {
      if (this.mounted && !this.state.imageFetched) {
        this.setState({ showSpinner: true });
      }
    }, this.props.spinnerDelay);
  }

  componentDidUpdate() {
    if (this.props.blockData !== this.state.blockData) {
      this.cancelCurrentPreload();
      this.cancelCurrentPreload = this.preloadThumbnail(this.props.blockData);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.cancelCurrentPreload();
    clearTimeout(this.showSpinnerTimeout);
  }

  preloadThumbnail(blockData) {
    let canceled = false;
    const { url } = blockThumbnailData(blockData);

    preloadImage(url).then(() => {
      if (this.mounted && !canceled) {
        this.setState({
          imageFetched: true,
          showSpinner: false,
          blockData: blockData
        });
      }
    });

    return () => (canceled = true);
  }

  render() {
    const { blockData, imageFetched, showSpinner } = this.state;
    const {
      url,
      width: thumbnailWidth,
      height: thumbnailHeight
    } = blockThumbnailData(blockData);
    let containerStyle = {};

    if (!imageFetched) {
      const resizedThumbnailWidth = 175; // this is from css. 185px - (10px border)
      const resizedThumbnailHeight =
        (resizedThumbnailWidth * thumbnailHeight) / thumbnailWidth;

      containerStyle = {
        paddingTop: `${resizedThumbnailHeight}px`
      };
    }

    return (
      <div className="brz-ed-sidebar-block-image" style={containerStyle}>
        {showSpinner && (
          <div className="brz-ed-sidebar-block-image-loading">
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          </div>
        )}
        {imageFetched && <img className="brz-img" src={url} />}
        <div className="brz-ed-sidebar-block-layout">
          <span className="brz-span brz-ed-sidebar-block-drag">
            {t("Drag to reorder")}
          </span>
        </div>
      </div>
    );
  }
}
