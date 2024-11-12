import React from "react";
import { Cover } from "./components/Cover";
import Placeholder from "visual/component/Placeholder";
import classnames from "classnames";
import { Controls } from "./components/Controls";
import { VideoProps as PreviewProps } from "./types";
import { FCC } from "visual/utils/react/types";
import { isCustomVideo } from "./utils";

export const PlaylistPreview: FCC<PreviewProps> = ({
  coverImageSrc,
  videoSrc,
  start,
  end,
  controls,
  loop,
  type,
  attributes,
  hasPauseIcon,
  hasUnmuteIcon,
  handleCoverIconClick
}) => {
  const isCustom = isCustomVideo(type);
  const hasControls = controls === "on" && videoSrc && isCustom;
  const hidePlaceholder = isCustom ? coverImageSrc : videoSrc || coverImageSrc;

  const coverClassName = classnames(
    "brz-video-playlist-col",
    "brz-video-playlist-main",
    "brz-video-playlist-main__cover",
    { "brz-d-none": !coverImageSrc }
  );
  const videoClassName = classnames(
    "brz-video-playlist-col",
    "brz-video-playlist-main",
    "brz-video-playlist-main__video",
    { "brz-d-none": isCustom || !videoSrc || coverImageSrc }
  );
  const placeholderClassName = classnames(
    "brz-video-playlist-col",
    "brz-video-playlist-main",
    "brz-video-playlist-main__placeholder",
    { "brz-d-none": hidePlaceholder }
  );

  const controlsClassName = classnames(
    "brz-video-playlist-main__controls",
    "brz-video-custom-video-controls",
    {
      "brz-d-none": !hasControls
    }
  );

  const customClassName = classnames(
    "brz-video-playlist-col",
    "brz-video-playlist-main",
    "brz-video-playlist-main__custom",
    { "brz-d-none": !isCustom }
  );

  const customVideoClassName = classnames(
    "brz-video-playlist-main__custom-video",
    "brz-video-playlist-main__content",
    "brz-p-relative",
    "brz-d-none"
  );

  return (
    <>
      <div className={coverClassName}>
        <Cover
          attributes={attributes}
          handleCoverIconClick={handleCoverIconClick}
        />
      </div>
      <div className={placeholderClassName}>
        <div className="brz-video-playlist-main__content brz-p-relative">
          <Placeholder icon="play" />
        </div>
      </div>
      <div className={videoClassName}>
        <div className="brz-video-playlist-main__content brz-p-relative">
          {!isCustom && (
            <iframe
              className="brz-iframe intrinsic-ignore"
              allowFullScreen={true}
              allow="autoplay"
              src={videoSrc}
            />
          )}
        </div>
      </div>
      <div className={customClassName}>
        <div className="brz-video-elem">
          <div className={customVideoClassName}>
            {isCustom && (
              <video
                data-time-start={start}
                data-time-end={end}
                className="brz-hidden intrinsic-ignore"
                preload="none"
                loop={loop === "on"}
                src={videoSrc}
                playsInline
              />
            )}
          </div>
          <div className={controlsClassName}>
            <Controls
              hasPauseIcon={hasPauseIcon}
              hasUnmuteIcon={hasUnmuteIcon}
            />
          </div>
        </div>
      </div>
    </>
  );
};
