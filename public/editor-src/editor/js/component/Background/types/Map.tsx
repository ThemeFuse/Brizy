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

  return (
    <iframe
      className="brz-iframe brz-bg-map__cover"
      src={src}
      style={iframeStyle}
    />
  );
};

export default Map;
