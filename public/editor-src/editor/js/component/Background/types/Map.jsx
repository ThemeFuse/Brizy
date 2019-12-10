import React from "react";

const URL =
  "https://www.google.com/maps/embed/v1/place?key=AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw";

export default function Map({ map, mapZoom }) {
  const iframeStyle = {
    display: map ? "block" : "none"
  };
  const src = map ? `${URL}&q=${map}&zoom=${mapZoom}` : null;

  return (
    <div className="brz-bg-map">
      <iframe
        className="brz-iframe brz-bg-map__cover"
        src={src}
        style={iframeStyle}
      />
    </div>
  );
}
