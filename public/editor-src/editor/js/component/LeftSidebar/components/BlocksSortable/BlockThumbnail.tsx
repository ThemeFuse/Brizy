import React, { Component } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Block } from "visual/types/Block";
import { blockThumbnailData } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import { preloadImage } from "visual/utils/image";
import { MValue } from "visual/utils/value";

interface Props {
  blockData: Block;
  screenshot: string;
}

interface State {
  blockData: Props["blockData"];
  imageFetched: boolean;
  showSpinner: boolean;
}

export default class BlockThumbnail extends Component<Props, State> {
  static defaultProps = {
    blockData: null,
    spinnerDelay: 300
  };

  private mounted = true;

  private cancelCurrentPreload: (() => boolean) | undefined;

  private showSpinnerTimeout: MValue<NodeJS.Timeout> = undefined;

  state = {
    blockData: this.props.blockData,
    imageFetched: false,
    showSpinner: true
  };

  componentDidMount() {
    this.mounted = true;
    this.cancelCurrentPreload = this.preloadThumbnail(this.state.blockData);
  }

  componentDidUpdate() {
    if (this.props.blockData !== this.state.blockData) {
      this.cancelCurrentPreload?.();
      this.cancelCurrentPreload = this.preloadThumbnail(this.props.blockData);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.cancelCurrentPreload?.();
    clearTimeout(this.showSpinnerTimeout);
  }

  preloadThumbnail(blockData: Block) {
    let canceled = false;
    const { screenshot } = this.props;

    const { url } = blockThumbnailData(blockData, screenshot);

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
    const { screenshot } = this.props;
    const {
      url,
      width: thumbnailWidth,
      height: thumbnailHeight
    } = blockThumbnailData(blockData, screenshot);

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
        {imageFetched && (
          <img alt={blockData.blockId} className="brz-img" src={url} />
        )}
        <div className="brz-ed-sidebar-block-layout">
          <span
            className="brz-span brz-ed-sidebar-block-drag"
            title={t("Drag to reorder")}
          >
            {t("Drag to reorder")}
          </span>
        </div>
      </div>
    );
  }
}
