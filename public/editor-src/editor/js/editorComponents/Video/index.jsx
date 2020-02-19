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
import * as sidebarConfig from "./sidebar";
import {
  styleContent,
  styleWrapper,
  styleCustomVideo,
  styleControls,
  styleIcon
} from "./styles";
import { css } from "visual/utils/cssStyle";
import { customFileUrl } from "visual/utils/customFile";
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
    const { videoPopulation, video, coverImageSrc, controls, start, end } = v;

    if (videoPopulation) {
      return videoPopulation;
    }

    const videoSrc = getVideoData(video);

    let branding = v.branding;
    if (v.branding === "off") {
      branding = 1;
    } else if (v.branding === "on") {
      branding = 0;
    }

    let intro = v.intro;
    if (v.intro === "off") {
      intro = 0;
    } else if (v.intro === "on") {
      intro = 1;
    }

    return videoSrc
      ? getVideoUrl(videoSrc, {
          autoplay: Boolean(coverImageSrc),
          controls: controls === "on",
          branding,
          intro,
          suggestedVideo: false,
          start,
          end
        })
      : "";
  }

  renderCover(videoSrc) {
    const { type } = this.getValue();

    return (
      <div className="brz-video__cover">
        <div className="brz-video__cover-icon">
          <a
            className="brz-a"
            href={type === "custom" ? "" : videoSrc}
            onClick={this.handleCoverIconClick}
          >
            <ThemeIcon name="play" type="editor" />
          </a>
        </div>
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const {
      type,
      custom,
      coverImageSrc,
      videoPopulation,
      ratio,
      start,
      end,
      controls,
      loop
    } = v;

    const customVideoFile = customFileUrl(custom);
    const videoSrc = this.getVideoSrc(v);

    const classNameContent = classnames(
      "brz-video",
      { "brz-custom-video": v.type === "custom" },
      { "brz-youtube-video": v.type === "youtube" },
      { "brz-vimeo-video": v.type === "vimeo" },
      `${controls}-controls-hidden`,
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

    const classNameVideo = classnames(
      "video",
      css(
        `${this.constructor.componentId}-bg2`,
        `${this.getId()}-bg2`,
        styleCustomVideo(v, vs, vd)
      )
    );

    const classNameControls = classnames(
      "controls",
      css(
        `${this.constructor.componentId}-controls`,
        `${this.getId()}-controls`,
        styleControls(v, vs, vd)
      )
    );

    const classNameSliderProgress = classnames("progress");

    const styleIconClass = css(
      `${this.constructor.componentId}-icon-controls`,
      `${this.getId()}-icon-controls`,
      styleIcon(v, vs, vd)
    );

    const playClassName = classnames("brz-icon-svg", "play", styleIconClass);
    const pauseClassName = classnames(
      "brz-hidden",
      "brz-icon-svg",
      "pause",
      styleIconClass
    );
    const muteClassName = classnames("brz-icon-svg", "mute", styleIconClass);
    const unmuteClassName = classnames(
      "brz-hidden",
      "brz-icon-svg",
      "unmute",
      styleIconClass
    );
    const fullScreenIcon = classnames(
      "brz-icon-svg",
      "fullscreen-icon",
      styleIconClass
    );

    let content = coverImageSrc ? (
      this.renderCover(videoSrc)
    ) : type !== "custom" ? (
      <iframe allowFullScreen={true} className="brz-iframe" src={videoSrc} />
    ) : (
      <Placeholder icon="play" />
    );

    if (
      (!videoSrc && !coverImageSrc) ||
      (IS_PREVIEW && videoPopulation && !coverImageSrc)
    ) {
      content = <Placeholder icon="play" />;
    }

    let autoplay = v.autoplay;
    if (v.coverImageSrc) {
      autoplay = "off";
    } else if (v.controls === "off") {
      autoplay = "on";
    }

    let muted = v.muted;
    if (autoplay === "on") {
      muted = "on";
    }

    const customVideoPlyaer = (
      <div className={classNameVideo}>
        {controls === "on" && (
          <div className="video-controls">
            <div className="play-pause-btn">
              <ThemeIcon
                className={playClassName}
                name="button-play"
                type="glyph"
              />
              {IS_PREVIEW && (
                <ThemeIcon
                  className={pauseClassName}
                  name="button-pause"
                  type="glyph"
                />
              )}
            </div>
            <div className={classNameControls}>
              <span className="current-time">0:00</span>

              <div className="slider">
                <div className={classNameSliderProgress} />
              </div>

              <span className="total-time">0:00</span>
            </div>
            <div className="volume">
              <div className="fullscreen-btn">
                <ThemeIcon
                  className={fullScreenIcon}
                  name="zoom-e"
                  type="glyph"
                />
              </div>
              <div className="volume-btn">
                <ThemeIcon
                  className={muteClassName}
                  name="volume-97"
                  type="glyph"
                />
                {IS_PREVIEW && (
                  <ThemeIcon
                    className={unmuteClassName}
                    name="volume-ban"
                    type="glyph"
                  />
                )}
              </div>
              <div className="volume-controls">
                <div className="slider">
                  <div className={classNameSliderProgress} />
                </div>
              </div>
            </div>
          </div>
        )}
        {IS_PREVIEW && (
          <video
            data-time-start={start}
            data-time-end={end}
            className="brz-hidden"
            preload="none"
            loop={loop === "on"}
            muted={muted === "on"}
            src={customVideoFile}
          />
        )}
      </div>
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div
            className={classNameContent}
            data-autoplay={autoplay}
            data-population={videoPopulation}
          >
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              <div className="brz-video-content">
                <div className={classNameWrapper}>
                  {content}
                  {IS_PREVIEW && videoPopulation && (
                    <Placeholder className="brz-hidden" icon="play" />
                  )}
                </div>
                {v.type === "custom" && customVideoPlyaer}
              </div>
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Video;
