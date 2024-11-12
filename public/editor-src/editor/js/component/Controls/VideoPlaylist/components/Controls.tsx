import React from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { FCC } from "visual/utils/react/types";
import { ControlProps as Props } from "../types";

export const Controls: FCC<Props> = ({ hasPauseIcon, hasUnmuteIcon }) => (
  <>
    <div className="brz-video-custom-play-pause-btn">
      <ThemeIcon
        className="brz-icon-svg brz-video-custom-play"
        name="button-play"
        type="glyph"
      />
      {hasPauseIcon && (
        <ThemeIcon
          className="brz-hidden brz-icon-svg brz-video-custom-pause"
          name="button-pause"
          type="glyph"
        />
      )}
    </div>
    <div className="brz-video-custom-controls">
      <span className="brz-video-custom-current-time">0:00</span>

      <div className="brz-video-custom-slider">
        <div className="brz-video-custom-progress" />
      </div>

      <span className="brz-video-custom-total-time">0:00</span>
    </div>
    <div className="brz-video-custom-volume">
      <div className="brz-video-custom-fullscreen-btn">
        <ThemeIcon
          className="brz-icon-svg brz-video-custom-fullscreen-icon"
          name="zoom-e"
          type="glyph"
        />
      </div>
      <div className="brz-video-custom-volume-btn">
        <ThemeIcon
          className="brz-icon-svg brz-video-custom-mute"
          name="volume-97"
          type="glyph"
        />
        {hasUnmuteIcon && (
          <ThemeIcon
            className="brz-hidden brz-icon-svg brz-video-custom-unmute"
            name="volume-ban"
            type="glyph"
          />
        )}
      </div>
      <div className="brz-video-custom-volume-controls brz-video-custom-slider">
        <div className="brz-video-custom-progress" />
      </div>
    </div>
  </>
);
