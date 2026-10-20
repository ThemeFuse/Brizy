import React from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import type { FCC } from "visual/utils/react/types";
import type { CoverProps as Props } from "../types";

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
