import classnames from "classnames";
import React from "react";
import Placeholder from "visual/component/Placeholder";
import type { FCC } from "visual/utils/react/types";
import { Controls } from "./components/Controls";
import { Cover } from "./components/Cover";
import type { VideoProps as Props } from "./types";
import { isCustomVideo } from "./utils";

export const CustomVideoEdit: FCC<Props> = ({
  coverImageSrc,
  controls,
  type,
  videoSrc,
  attributes,
  hasPauseIcon,
  hasUnmuteIcon,
  handleCoverIconClick
}) => {
  const isCustom = isCustomVideo(type);
  const hasControls = controls === "on" && videoSrc && isCustom;

  const coverClassName = classnames(
    "brz-video-playlist-col",
    "brz-video-playlist-main",
    "brz-video-playlist-main__cover",
    { "brz-d-none": !coverImageSrc }
  );
  const placeholderClassName = classnames(
    "brz-video-playlist-col",
    "brz-video-playlist-main",
    "brz-video-playlist-main__placeholder",
    { "brz-d-none": coverImageSrc }
  );
  const controlsClassName = classnames(
    "brz-video-playlist-main__controls",
    "brz-video-custom-video-controls",
    { "brz-d-none": !hasControls }
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
      <div className="brz-video-playlist-col brz-video-playlist-main brz-video-elem">
        <div className={controlsClassName}>
          <Controls hasPauseIcon={hasPauseIcon} hasUnmuteIcon={hasUnmuteIcon} />
        </div>
      </div>
    </>
  );
};
