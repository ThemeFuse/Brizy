import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import ThemeIcon from "visual/component/ThemeIcon";
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

  handleResizerChange = patch => this.patchValue(patch);

  getResizerRestrictions(v) {
    return {
      height: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      width: {
        min: 5,
        max: 100
      },
      tabletHeight: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      tabletWidth: {
        min: 5,
        max: 100
      },
      mobileHeight: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      mobileWidth: {
        min: 5,
        max: 100
      }
    };
  }

  renderCover() {
    return <div className="brz-audio__cover" />;
  }

  renderForEdit(v, vs, vd) {
    const {
      type,
      audio,
      showCurrentTime,
      showDurationTime,
      showProgressBarTrack,
      showProgressBarVolume
    } = v;

    const audioFile = customFileUrl(audio);

    const classNameContent = classnames(
      { "brz-audio": type === "custom" },
      { "brz-soundcloud": type === "soundcloud" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );

    const classNameAudio = classnames(
      "audio",
      css(
        `${this.constructor.componentId}-bg2`,
        `${this.getId()}-bg2`,
        styleWrapperAudio(v, vs, vd)
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
      `${this.constructor.componentId}-icon`,
      `${this.getId()}-icon`,
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

    const content = (
      <div className={classNameAudio}>
        {this.renderCover(v, vs, vd)}
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
          {showCurrentTime === "on" && (
            <span className="current-time">0:00</span>
          )}
          {showProgressBarTrack === "on" && (
            <div className="slider">
              <div className={classNameSliderProgress} />
            </div>
          )}
          {showDurationTime === "on" && (
            <span className="total-time">0:00</span>
          )}
        </div>
        {showProgressBarVolume === "on" && (
          <div className="volume">
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
        )}

        {IS_PREVIEW && <audio preload="none" src={audioFile} />}
      </div>
    );

    // SoundCloud

    const wrapperClassName = classnames("brz-iframe", {
      "brz-blocked": IS_EDITOR
    });
    let { url, autoPlay, showArtwork } = v;
    autoPlay = autoPlay === "on";
    showArtwork = showArtwork === "on";
    const src = `https://w.soundcloud.com/player/?url=${url}&amp;auto_play=${autoPlay}&amp;how_teaser=true&amp;visual=${showArtwork}&amp;`;

    const contentSoundCloud = !url ? (
      <Placeholder icon="sound-cloud" />
    ) : (
      <div className="brz-soundCloud-content">
        <iframe
          className={wrapperClassName}
          scrolling="no"
          frameBorder="no"
          src={src}
        />
      </div>
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={classNameContent}>
            <BoxResizer
              points={resizerPoints}
              restrictions={this.getResizerRestrictions(v)}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {type === "custom" ? content : contentSoundCloud}
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Audio;
