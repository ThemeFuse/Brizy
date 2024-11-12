import React, { useMemo } from "react";
import Placeholder from "visual/component/Placeholder";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { SidebarProps as Props } from "../types";
import { isCustomVideo } from "../utils";
import { FCC } from "visual/utils/react/types";

export const Sidebar: FCC<Props> = ({
  videoSrc,
  title,
  subTitle,
  coverImageSrc,
  coverUrl,
  imgHref,
  className,
  attributes,
  type,
  onClick,
  handleTitleChange,
  handleSubtitleChange
}) => {
  const video = useMemo(() => {
    if (coverImageSrc) {
      return <img className="brz-img" src={coverUrl} alt="cover" />;
    }
    if (videoSrc && !isCustomVideo(type)) {
      return (
        <img
          className="brz-img"
          src={`https://img.youtube.com/vi/${imgHref}/hqdefault.jpg`}
          alt="cover"
        />
      );
    }
    return (
      <Placeholder icon="play" className="brz-video-playlist-placeholder" />
    );
  }, [coverImageSrc, videoSrc, coverUrl, imgHref, type]);

  return (
    <div className={className} onClick={onClick} {...attributes}>
      <div className="brz-video-playlist-video-elem">{video}</div>
      <div className="brz-video-playlist-title-video">
        <TextEditor value={title} onChange={handleTitleChange} />
        <TextEditor value={subTitle} onChange={handleSubtitleChange} />
      </div>
    </div>
  );
};
