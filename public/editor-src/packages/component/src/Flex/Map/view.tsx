import classNames from "classnames";
import React, { ReactElement } from "react";
import { Props } from "./types";

const URL = "https://www.google.com/maps/embed/v1/place";
const KEY = "AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw";

export const MapPreview = (props: Props): ReactElement => {
  const { className, address, platform, zoom } = props;
  // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
  // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
  // and breaks our code(video, map inside megamenu isn't showing as example)
  const _className = classNames(className, "brz-iframe", {
    "intrinsic-ignore": platform === "WP"
  });

  const iframeSrc = `${URL}?key=${KEY}&q=${encodeURIComponent(
    address
  )}&zoom=${zoom}`;

  return (
    <div className="brz-map-content">
      <iframe className={_className} src={iframeSrc} />
    </div>
  );
};

export const MapEditor = (props: Props): ReactElement => {
  const { className, address, platform, zoom } = props;
  const _className = classNames(className, "brz-blocked");

  return (
    <MapPreview
      address={address}
      platform={platform}
      className={_className}
      zoom={zoom}
    />
  );
};
