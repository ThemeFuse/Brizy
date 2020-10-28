import React from "react";

const URL =
  "https://www.google.com/maps/embed/v1/place?key=AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw";

export default function Map({ map, mapZoom }) {
  const iframeStyle = {
    display: map ? "block" : "none"
  };
  const src = map ? `${URL}&q=${map}&zoom=${mapZoom}` : null;

   // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
   // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
   // and breaks our code(video, map inside megamenu isn't showing as example)
  return (
    <div className="brz-bg-map">
      <iframe
        className="brz-iframe intrinsic-ignore brz-bg-map__cover"
        src={src}
        style={iframeStyle}
      />
    </div>
  );
}
