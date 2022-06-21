import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import {
  styleContent,
  styleWrapperAudio,
  styleControls,
  styleIcon
} from "./styles";
import { css } from "visual/utils/cssStyle";
import { customFileUrl } from "visual/utils/customFile";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";
import { getOptionColorHexByPalette } from "visual/utils/options";

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

class Audio extends EditorComponent {
  static get componentId() {
    return "Audio";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleResizerChange = patch => this.patchValue(patch);

  getResizerRestrictions(v) {
    return {
      height: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        }
      },
      width: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      tabletHeight: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        }
      },
      tabletWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      mobileHeight: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        }
      },
      mobileWidth: {
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
  }

  renderCover() {
    return <div className="brz-audio__cover" />;
  }

  renderSoundCloud(v) {
    const {
      url,
      autoPlay,
      showArtwork,
      likeButton,
      buyButton,
      downloadButton,
      shareButton,
      comments,
      playCounts,
      username,
      artWork,
      controlsHex,
      controlsPalette
    } = v;
    // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
    // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
    // and breaks our code(video, map inside megamenu isn't showing as example)
    const wrapperClassName = classnames("brz-iframe", "intrinsic-ignore", {
      "brz-blocked": IS_EDITOR
    });

    const { hex: controlsColorHex } = getOptionColorHexByPalette(
      controlsHex,
      controlsPalette
    );

    const controlsColor = controlsColorHex.split("#")[1];

    const src = `https://w.soundcloud.com/player/?url=${url}&auto_play=${autoPlay ===
      "on"}&how_teaser=true&visual=${showArtwork ===
      "on"}&color=${controlsColor}&buying=${buyButton ===
      "on"}&sharing=${shareButton === "on"}&download=${downloadButton ===
      "on"}&show_artwork=${artWork === "on"}&show_playcount=${playCounts ===
      "on"}&show_user=${username === "on"}&show_comments=${comments ===
      "on"}&liking=${likeButton === "on"}&`;

    return url ? (
      <div className="brz-soundCloud-content">
        <iframe
          className={wrapperClassName}
          scrolling="no"
          frameBorder="no"
          src={src}
        />
      </div>
    ) : (
      <Placeholder icon="sound-cloud" />
    );
  }

  renderCustom(v, vs, vd) {
    const {
      loop,
      audio,
      showCurrentTime,
      showDurationTime,
      showProgressBarTrack,
      showProgressBarVolume
    } = v;
    const audioFile = customFileUrl(audio);
    const classNameAudio = classnames(
      "brz-custom-audio",
      css(
        `${this.constructor.componentId}-bg2`,
        `${this.getId()}-bg2`,
        styleWrapperAudio(v, vs, vd)
      )
    );
    const classNameControls = classnames(
      "brz-audio-controls",
      css(
        `${this.constructor.componentId}-controls`,
        `${this.getId()}-controls`,
        styleControls(v, vs, vd)
      )
    );
    const styleIconClass = css(
      `${this.constructor.componentId}-icon`,
      `${this.getId()}-icon`,
      styleIcon(v, vs, vd)
    );
    const playClassName = classnames(
      "brz-icon-svg",
      "brz-audio-play",
      styleIconClass
    );
    const pauseClassName = classnames(
      "brz-hidden",
      "brz-icon-svg",
      "brz-audio-pause",
      styleIconClass
    );
    const muteClassName = classnames(
      "brz-icon-svg",
      "brz-audio-mute",
      styleIconClass
    );
    const unmuteClassName = classnames(
      "brz-hidden",
      "brz-icon-svg",
      "brz-audio-unmute",
      styleIconClass
    );

    return (
      <div className={classNameAudio}>
        {this.renderCover(v, vs, vd)}
        <div className="brz-audio-play-pause-btn brz-d-xs-flex">
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
          {showCurrentTime === "on" && (
            <span className="brz-audio-current-time">0:00</span>
          )}
          {showProgressBarTrack === "on" && (
            <div className="brz-audio-slider">
              <div className="brz-audio-progress" />
            </div>
          )}
          {showDurationTime === "on" && (
            <span className="brz-audio-total-time">0:00</span>
          )}
        </div>
        {showProgressBarVolume === "on" && (
          <div className="brz-audio-volume brz-d-xs-flex">
            <div className="brz-audio-volume-btn brz-d-xs-flex">
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

            <div className="brz-audio-volume-controls brz-d-xs-flex">
              <div className="brz-audio-slider">
                <div className="brz-audio-progress" />
              </div>
            </div>
          </div>
        )}

        {IS_PREVIEW && (
          <audio
            preload="none"
            src={audioFile}
            {...(loop === "on" ? { loop } : {})}
          />
        )}
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const { type } = v;
    const classNameContent = classnames(
      { "brz-audio": type === "custom" },
      { "brz-soundcloud": type === "soundcloud" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className: classNameContent })}>
            <BoxResizer
              points={resizerPoints}
              restrictions={this.getResizerRestrictions(v)}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {type === "custom"
                ? this.renderCustom(v, vs, vd)
                : this.renderSoundCloud(v, vs, vd)}
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Audio;
