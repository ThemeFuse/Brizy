import React from "react";

const URL =
  "https://www.google.com/maps/embed/v1/place?key=AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw";

type Props = {
  map?: string;
  mapZoom?: string;
};

const Map: React.FC<Props> = ({ map, mapZoom }) => {
  const iframeStyle = {
    display: map ? "block" : "none"
  };
  const src = map ? `${URL}&q=${map}&zoom=${mapZoom}` : undefined;

  // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
  // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
  // and breaks our code(video, map inside megamenu isn't showing as example)
  return (
    <iframe
      className="brz-iframe intrinsic-ignore brz-bg-map__cover absolute top-0 left-0 w-full h-full border-none max-w-none bg-no-repeat bg-cover"
      src={src}
      style={iframeStyle}
    />
  );
};

export default Map;
