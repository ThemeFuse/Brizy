import classNames from "classnames";
import React, { ReactElement } from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { Props } from "./types";

export const Audio: React.FC<Props> = ({
  src,
  isLoop,
  showCurrentTime,
  showDurationTime,
  showProgressBarTrack,
  showProgressBarVolume,
  classNameAudio,
  classNameControls,
  classNameIcon
}): ReactElement => {
  const playClassName = classNames(
    "brz-icon-svg",
    "brz-audio-play",
    classNameIcon
  );
  const pauseClassName = classNames(
    "brz-hidden",
    "brz-icon-svg",
    "brz-audio-pause",
    classNameIcon
  );
  const muteClassName = classNames(
    "brz-icon-svg",
    "brz-audio-mute",
    classNameIcon
  );
  const unmuteClassName = classNames(
    "brz-hidden",
    "brz-icon-svg",
    "brz-audio-unmute",
    classNameIcon
  );

  return (
    <div className={classNameAudio}>
      <div className="brz-audio__cover" />
      <div className="brz-audio-play-pause-btn">
        <ThemeIcon className={playClassName} name="button-play" type="glyph" />
        <ThemeIcon
          className={pauseClassName}
          name="button-pause"
          type="glyph"
        />
      </div>
      <div className={classNameControls}>
        {showCurrentTime && (
          <span className="brz-audio-current-time">0:00</span>
        )}
        {showProgressBarTrack && (
          <div className="brz-audio-slider">
            <div className="brz-audio-progress" />
          </div>
        )}
        {showDurationTime && <span className="brz-audio-total-time">0:00</span>}
      </div>
      {showProgressBarVolume && (
        <div className="brz-audio-volume">
          <div className="brz-audio-volume-btn">
            <ThemeIcon
              className={muteClassName}
              name="volume-97"
              type="glyph"
            />
            <ThemeIcon
              className={unmuteClassName}
              name="volume-ban"
              type="glyph"
            />
          </div>

          <div className="brz-audio-volume-controls">
            <div className="brz-audio-slider">
              <div className="brz-audio-progress" />
            </div>
          </div>
        </div>
      )}
      <audio preload="none" src={src} loop={isLoop ?? false} />
    </div>
  );
};
