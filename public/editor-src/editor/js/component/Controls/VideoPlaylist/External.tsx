import React from "react";
import { Cover } from "./components/Cover";
import Placeholder from "visual/component/Placeholder";
import { ExternalVideoEdit as Props } from "./types";
import { FCC } from "visual/utils/react/types";

export const ExternalVideoEdit: FCC<Props> = ({
  coverImageSrc,
  videoSrc,
  attributes,
  handleCoverIconClick
}) => {
  if (coverImageSrc) {
    return (
      <div className="brz-video-playlist-col brz-video-playlist-main brz-video-playlist-main__cover">
        <Cover
          attributes={attributes}
          handleCoverIconClick={handleCoverIconClick}
        />
      </div>
    );
  }

  if (videoSrc) {
    return (
      <div className="brz-video-playlist-col brz-video-playlist-main">
        <div className="brz-video-playlist-main__content brz-p-relative brz-pointer-events-none">
          <iframe
            allowFullScreen={true}
            className="brz-iframe intrinsic-ignore"
            src={videoSrc}
            title="video-playlist"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="brz-video-playlist-col brz-video-playlist-main brz-video-playlist-main__placeholder">
      <div className="brz-video-playlist-main__content brz-p-relative">
        <Placeholder icon="play" />
      </div>
    </div>
  );
};
