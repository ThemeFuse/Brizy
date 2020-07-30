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
import { Wrapper } from "../tools/Wrapper";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

class Video extends EditorComponent {
  static get componentId() {
    return "Video";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  getVideoSrc(v) {
    const { video, coverImageSrc, controls, start, end } = v;

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

  //temp
  getAutoplay(v) {
    let autoplay = v.autoplay;
    if (v.coverImageSrc) {
      autoplay = "off";
    } else if (v.controls === "off") {
      autoplay = "on";
    }

    return autoplay;
  }

  renderCover() {
    return (
      <div key="cover" className="brz-video__cover">
        <div className="brz-video__cover-icon">
          <a className="brz-a">
            <ThemeIcon name="play" type="editor" />
          </a>
        </div>
      </div>
    );
  }

  renderExternalPlayer(v) {
    const {
      coverImageSrc,
      video,
      videoPopulation,
      controls,
      branding,
      intro,
      start,
      end
    } = v;
    const videoSrc = this.getVideoSrc(v);

    const videoDataElem = (
      <div
        key="url"
        className="brz-video-data brz-hidden"
        data-src={videoSrc}
        data-population={videoPopulation}
        data-controls={controls === "on"}
        data-branding={branding === "on"}
        data-intro={intro === "on"}
        data-start={start}
        data-end={end}
      />
    );

    if (coverImageSrc) {
      return [videoDataElem, this.renderCover()];
    } else if (videoPopulation) {
      return [videoDataElem, this.renderPlaceholder()];
    } else if (video) {
      return [
        videoDataElem,
        <iframe
          key="iframe"
          allowFullScreen={true}
          className="brz-iframe"
          src={videoSrc}
        />
      ];
    }

    return this.renderPlaceholder();
  }

  renderCustomPlayer(v, vs, vd) {
    const { coverImageSrc, custom, start, end, controls, loop, ratio } = v;

    const customVideoFile = customFileUrl(custom);

    const classNameVideo = classnames(
      "brz-video-element",
      css(
        `${this.constructor.componentId}-bg2`,
        `${this.getId()}-bg2`,
        styleCustomVideo(v, vs, vd)
      )
    );
    const classNameControls = classnames(
      "brz-video-custom-controls",
      css(
        `${this.constructor.componentId}-controls`,
        `${this.getId()}-controls`,
        styleControls(v, vs, vd)
      )
    );

    const styleIconClass = css(
      `${this.constructor.componentId}-icon-controls`,
      `${this.getId()}-icon-controls`,
      styleIcon(v, vs, vd)
    );

    const playClassName = classnames(
      "brz-icon-svg",
      "brz-video-custom-play",
      styleIconClass
    );
    const pauseClassName = classnames(
      "brz-hidden",
      "brz-icon-svg",
      "brz-video-custom-pause",
      styleIconClass
    );
    const muteClassName = classnames(
      "brz-icon-svg",
      "brz-video-custom-mute",
      styleIconClass
    );
    const unmuteClassName = classnames(
      "brz-hidden",
      "brz-icon-svg",
      "brz-video-custom-unmute",
      styleIconClass
    );
    const fullScreenIcon = classnames(
      "brz-icon-svg",
      "brz-video-custom-fullscreen-icon",
      styleIconClass
    );

    const classNameWrapper = classnames(
      "video-wrapper",
      `brz-image-fix-${ratio.replace(":", "-")}`,
      css(
        `${this.constructor.componentId}-wrapper`,
        `${this.getId()}-wrapper`,
        styleWrapper(v, vs, vd)
      )
    );

    let muted = v.muted;
    if (this.getAutoplay(v) === "on") {
      muted = "on";
    }

    let content = coverImageSrc
      ? this.renderCover(v)
      : this.renderPlaceholder();

    return (
      <React.Fragment>
        <div className={classNameWrapper}>{content}</div>
        <div className={classNameVideo}>
          {controls === "on" && (
            <div className="brz-video-custom-video-controls">
              <div className="brz-video-custom-play-pause-btn">
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
                <span className="brz-video-custom-current-time">0:00</span>

                <div className="brz-video-custom-slider">
                  <div className="brz-video-custom-progress" />
                </div>

                <span className="brz-video-custom-total-time">0:00</span>
              </div>
              <div className="brz-video-custom-volume">
                <div className="brz-video-custom-fullscreen-btn">
                  <ThemeIcon
                    className={fullScreenIcon}
                    name="zoom-e"
                    type="glyph"
                  />
                </div>
                <div className="brz-video-custom-volume-btn">
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
                <div className="brz-video-custom-volume-controls brz-video-custom-slider">
                  <div className="brz-video-custom-progress" />
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
              data-autoplay={this.getAutoplay(v)}
              src={customVideoFile}
            />
          )}
        </div>
      </React.Fragment>
    );
  }

  renderPlaceholder() {
    return <Placeholder key="placeholder" icon="play" />;
  }

  renderForEdit(v, vs, vd) {
    const { type, ratio, controls } = v;

    const restrictions = {
      size: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      tabletSize: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      mobileSize: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      }
    };

    const classNameContent = classnames(
      "brz-video",
      { "brz-custom-video": type === "custom" },
      { "brz-youtube-video": type === "youtube" },
      { "brz-vimeo-video": type === "vimeo" },
      `brz-video-${controls}-controls-hidden`,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );
    const classNameWrapper = classnames(
      "video-wrapper",
      `brz-image-fix-${ratio.replace(":", "-")}`,
      css(
        `${this.constructor.componentId}-wrapper`,
        `${this.getId()}-wrapper`,
        styleWrapper(v, vs, vd)
      )
    );

    let content =
      type === "custom" ? (
        this.renderCustomPlayer(v, vs, vd)
      ) : (
        <div className={classNameWrapper}>{this.renderExternalPlayer(v)}</div>
      );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className: classNameContent })}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
              restrictions={restrictions}
            >
              <div className="brz-video-content">{content}</div>
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Video;
