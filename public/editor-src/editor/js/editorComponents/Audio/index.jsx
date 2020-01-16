import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import ThemeIcon from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import {
  styleContent,
  styleWrapperAudio,
  styleControls,
  styleSliderProgress,
  styleIcon
} from "./styles";
import { css } from "visual/utils/cssStyle";
import { customFileUrl } from "visual/utils/customFile";
import defaultValue from "./defaultValue.json";

const resizerPoints = [
  "centerLeft",
  "centerRight",
  "topCenter",
  "bottomCenter"
];
const resizerRestrictions = {
  height: {
    min: 40,
    max: 300
  }
};

class Audio extends EditorComponent {
  static get componentId() {
    return "Audio";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderCover() {
    return <div className="brz-audio__cover" />;
  }

  renderForEdit(v, vs, vd) {
    const {
      audio,
      showCurrentTime,
      showDurationTime,
      showProgressBarTrack,
      showProgressBarVolume
    } = v;

    const audioFile = customFileUrl(audio);

    const classNameContent = classnames(
      "brz-audio",
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

    const classNameSliderProgress = classnames(
      "progress",
      css(
        `${this.constructor.componentId}-progress-bar`,
        `${this.getId()}-progress-bar`,
        styleSliderProgress(v, vs, vd)
      )
    );

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

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={classNameContent}>
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {content}
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Audio;
