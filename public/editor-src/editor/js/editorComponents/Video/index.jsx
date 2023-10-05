import classnames from "classnames";
import React from "react";
import { mergeDeep } from "timm";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import { makeOptionValueToAnimation } from "visual/component/Options/types/utils/makeValueToOptions";
import Placeholder from "visual/component/Placeholder";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Config from "visual/global/Config";
import { css } from "visual/utils/cssStyle";
import { customFileUrl } from "visual/utils/customFile";
import { isStory } from "visual/utils/models";
import { read as readBoolean } from "visual/utils/reader/bool";
import { read as readString } from "visual/utils/string/specs";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import {
  styleContent,
  styleControls,
  styleCustomVideo,
  styleIcon,
  styleWrapper
} from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

class Video extends EditorComponent {
  static get componentId() {
    return "Video";
  }

  static defaultValue = defaultValue;

  state = {
    isDragging: false,
    sizePatch: null
  };

  getDBValue() {
    if (this.state.sizePatch) {
      return mergeDeep(this.props.dbValue, this.state.sizePatch);
    } else {
      return this.props.dbValue;
    }
  }

  handleResizerChange = (patch) => {
    if (this.state.isDragging) {
      this.setState({ sizePatch: patch });
    } else {
      this.patchValue(patch);
    }
  };

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  onDragEnd = () => {
    const sizePatch = this.state.sizePatch;
    this.setState({ isDragging: false, sizePatch: null }, () =>
      this.handleResizerChange(sizePatch)
    );
  };

  getVideoSrc(v) {
    const {
      video,
      coverImageSrc,
      controls,
      start,
      end,
      loop,
      autoplay,
      privacyMode,
      suggestedVideos,
      muted
    } = v;

    const videoSrc = getVideoData(video);

    const suggestedVideo = suggestedVideos === "any" ? 1 : 0;
    const videoMuted = muted === "off" ? 0 : 1;

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
          autoplay: !!coverImageSrc || autoplay === "on",
          controls: controls === "on",
          branding,
          intro,
          suggestedVideo,
          start,
          end,
          loop: loop === "on",
          hasCover: !!coverImageSrc,
          privacyMode,
          videoMuted
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
          <span className="brz-span">
            <ThemeIcon name="play" type="editor" />
          </span>
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
      end,
      loop,
      lazyLoad
    } = v;
    const videoSrc = this.getVideoSrc(v);
    const _end = loop === "on" && end ? end + 1 : end;

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
        data-end={_end}
        data-loop={loop === "on"}
        data-autoplay={this.getAutoplay(v)}
      />
    );

    if (coverImageSrc) {
      return [videoDataElem, this.renderCover()];
    } else if (videoPopulation) {
      return [videoDataElem, this.renderPlaceholder()];
    } else if (video) {
      // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
      // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
      // and breaks our code(video, map inside megamenu isn't showing as example)
      return [
        videoDataElem,
        <iframe
          loading={lazyLoad === "on" ? "lazy" : "eager"}
          key="iframe"
          allowFullScreen={true}
          className="intrinsic-ignore brz-iframe"
          src={videoSrc}
          title="video"
        />
      ];
    }

    return this.renderPlaceholder();
  }

  renderCustomPlayer(v, vs, vd) {
    const {
      coverImageSrc,
      custom,
      start,
      end,
      controls,
      loop,
      ratio,
      type,
      video
    } = v;

    const customVideoFile = type === "custom" ? customFileUrl(custom) : video;

    const classNameVideo = classnames(
      "brz-video-elem",
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
      <>
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
              className="brz-hidden intrinsic-ignore"
              preload="none"
              loop={loop === "on"}
              muted={muted === "on"}
              data-autoplay={this.getAutoplay(v)}
              src={customVideoFile}
              playsInline
            />
          )}
        </div>
      </>
    );
  }

  renderPlaceholder() {
    return <Placeholder key="placeholder" icon="play" />;
  }

  renderForEdit(v, vs, vd) {
    const { type, ratio, controls, loop, muted, customCSS, hoverName } = v;

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
      { "brz-custom-video": type === "custom" || type === "url" },
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
      type === "custom" || type === "url" ? (
        this.renderCustomPlayer(v, vs, vd)
      ) : (
        <div className={classNameWrapper}>{this.renderExternalPlayer(v)}</div>
      );

    const _hoverName = readString(hoverName) ?? "none";
    const options = makeOptionValueToAnimation(v);
    const { wrapperAnimationId } = this.props.meta;
    const animationId = readString(wrapperAnimationId) ?? this.getId();
    const { wrapperAnimationActive } = this.props.meta;
    const isDisabledHover = readBoolean(wrapperAnimationActive);
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper {...this.makeWrapperProps({ className: classNameContent })}>
            <HoverAnimation
              animationId={animationId}
              cssKeyframe={_hoverName}
              options={getHoverAnimationOptions(options, _hoverName)}
              isDisabledHover={isDisabledHover}
              isHidden={isStory(Config.getAll())}
            >
              <BoxResizer
                points={resizerPoints}
                meta={this.props.meta}
                value={v}
                onChange={this.handleResizerChange}
                onStart={this.onDragStart}
                onEnd={this.onDragEnd}
                restrictions={restrictions}
              >
                <div
                  className="brz-video-content"
                  data-loop={loop === "on"}
                  data-muted={muted === "on"}
                  data-autoplay={this.getAutoplay(v)}
                >
                  {content}
                </div>
              </BoxResizer>
            </HoverAnimation>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Video;
