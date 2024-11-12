import React from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { CoverProps as Props } from "../types";
import { FCC } from "visual/utils/react/types";

export const Cover: FCC<Props> = ({ attributes, handleCoverIconClick }) => {
  return (
    <div className="brz-video-playlist__cover">
      <div
        className="brz-video-playlist__cover-icon brz-play-button"
        onClick={handleCoverIconClick}
        {...attributes}
      >
        <ThemeIcon name="play" type="editor" />
      </div>
    </div>
  );
};
