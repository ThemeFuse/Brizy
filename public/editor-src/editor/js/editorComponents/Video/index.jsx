import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import Toolbar from "visual/component/Toolbar";
import ThemeIcon from "visual/component/ThemeIcon";
import * as toolbarConfig from "./toolbar";
import { styleContent, styleWrapper } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

class Video extends EditorComponent {
  static get componentId() {
    return "Video";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  handleCoverIconClick(e) {
    e.preventDefault();
  }

  getVideoSrc(v) {
    const { videoPopulation, video, coverImageSrc, controls, start } = v;

    if (videoPopulation) {
      return videoPopulation;
    }

    const videoSrc = getVideoData(video);

    return videoSrc
      ? getVideoUrl(videoSrc, {
          autoplay: Boolean(coverImageSrc),
          controls: controls === "on",
          suggestedVideo: false,
          start
        })
      : "";
  }

  renderCover(videoSrc) {
    return (
      <div className="brz-video__cover">
        <div className="brz-video__cover-icon">
          <a
            className="brz-a"
            href={videoSrc}
            onClick={this.handleCoverIconClick}
          >
            <ThemeIcon name="play" type="editor" />
          </a>
        </div>
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const { coverImageSrc, videoPopulation, ratio } = v;
    const videoSrc = this.getVideoSrc(v);

    const classNameContent = classnames(
      "brz-video",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );

    const classNameWrapper = classnames(
      `brz-image-fix-${ratio.replace(":", "-")}`,
      css(
        `${this.constructor.componentId}-wrapper`,
        `${this.getId()}-wrapper`,
        styleWrapper(v, vs, vd)
      )
    );

    let content = coverImageSrc ? (
      this.renderCover(videoSrc)
    ) : (
      <iframe allowFullScreen={true} className="brz-iframe" src={videoSrc} />
    );

    if ((!videoSrc && !coverImageSrc) || (videoPopulation && !coverImageSrc)) {
      content = <Placeholder icon="play" />;
    }

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={classNameContent}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              <div className="brz-video-content">
                <div className={classNameWrapper}>{content}</div>
              </div>
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { coverImageSrc, controls, videoPopulation, ratio } = v;
    const videoSrc = this.getVideoSrc(v);

    const classNameContent = classnames(
      "brz-video",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );

    const classNameWrapper = classnames(
      `brz-image-fix-${ratio.replace(":", "-")}`,
      css(
        `${this.constructor.componentId}-wrapper`,
        `${this.getId()}-wrapper`,
        styleWrapper(v, vs, vd)
      )
    );

    let content = coverImageSrc ? (
      this.renderCover(videoSrc)
    ) : (
      <iframe
        allowFullScreen={true}
        className="brz-iframe"
        loading="lazy"
        src={videoPopulation ? "" : videoSrc}
      />
    );

    if (!videoSrc && !coverImageSrc) {
      content = <Placeholder icon="play" />;
    }

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div
          className={classNameContent}
          data-auto-play={Boolean(coverImageSrc)}
          data-controls={controls === "on"}
          data-population={videoPopulation}
        >
          <div className="brz-video-content">
            <div className={classNameWrapper}>
              {content}
              {videoPopulation && (
                <Placeholder className="brz-hidden" icon="play" />
              )}
            </div>
          </div>
        </div>
      </CustomCSS>
    );
  }
}

export default Video;
