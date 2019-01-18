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
    showSpinner: true
  };

  componentDidMount() {
    this.mounted = true;
    this.cancelCurrentPreload = this.preloadThumbnail(this.state.blockData);

    // because the main thread gets busy
    // the spinner can take significantly
    // longer then the props value
    // commenting for now and displaying
    // the spinner without any delay
    // this.showSpinnerTimeout = setTimeout(() => {
    //   if (this.mounted && !this.state.imageFetched) {
    //     this.setState({ showSpinner: true });
    //   }
    // }, this.props.spinnerDelay);
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

    const resizedThumbnailWidth = 175; // this is from css. 185px - (10px border)
    const resizedThumbnailHeight =
      (resizedThumbnailWidth * thumbnailHeight) / thumbnailWidth;
    const containerStyle = {
      paddingTop: `${resizedThumbnailHeight}px`
    };
    const spinnerStyle = showSpinner ? {} : { display: "none" };

    return (
      <div className="brz-ed-sidebar-block-image" style={containerStyle}>
        <div
          className="brz-ed-sidebar-block-image-loading"
          style={spinnerStyle}
        >
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
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
