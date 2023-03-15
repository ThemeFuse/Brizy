import classNames from "classnames";
import React, { ReactElement } from "react";
import { Props } from "./types";

export const SoundCloud = (props: Props): ReactElement => {
  const {
    src,
    isAutoPlay,
    showArtwork,
    showLikeButton,
    showBuyButton,
    showDownloadButton,
    showShareButton,
    showComments,
    showPlayCounts,
    showUsername,
    isVisual,
    controlsColor,
    className
  } = props;

  // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
  // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
  // and breaks our code(video, map inside megamenu isn't showing as example)
  const _className = classNames(className, "brz-iframe", "intrinsic-ignore");

  const url = `https://w.soundcloud.com/player/?url=${src}&auto_play=${isAutoPlay}&how_teaser=true&visual=${isVisual}&color=${controlsColor}&buying=${showBuyButton}&sharing=${showShareButton}&download=${showDownloadButton}&show_artwork=${showArtwork}&show_playcount=${showPlayCounts}&show_user=${showUsername}&show_comments=${showComments}&liking=${showLikeButton}&`;

  return (
    <div className="brz-soundCloud-content">
      <iframe className={_className} src={url} />
    </div>
  );
};
