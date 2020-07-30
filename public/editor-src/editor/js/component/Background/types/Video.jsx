import React, { useLayoutEffect, useRef } from "react";
import jQuery from "jquery";
import { videoUrl } from "visual/utils/video";

import "../lib/jquery.background-video.js";

export default function Video({ video, bgVideoLoop, bgVideoStart }) {
  const iframeStyle = {
    display: video ? "block" : "none"
  };
  const settings = {
    autoplay: true,
    background: true,
    controls: false,
    suggestedVideo: false,
    loop: false
  };

  const dataType = video ? video.type : null;
  const src = video ? videoUrl(video, settings) : null;

  const videoRef = useRef();
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    return () => {
      jQuery(videoRef.current).backgroundVideo("destroy");
    };
  }, []);

  useLayoutEffect(() => {
    if (!isInitialMount.current) {
      jQuery(videoRef.current).backgroundVideo("resize");
    }
  });

  useLayoutEffect(() => {
    if (!isInitialMount.current) {
      jQuery(videoRef.current).backgroundVideo("setLoop", bgVideoLoop);
    }
  }, [bgVideoLoop]);

  useLayoutEffect(() => {
    if (!isInitialMount.current) {
      jQuery(videoRef.current).backgroundVideo("seekTo", bgVideoStart);
    }
  }, [bgVideoStart]);

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      jQuery(videoRef.current).backgroundVideo({
        type: video.type,
        key: video.key,
        loop: bgVideoLoop,
        start: bgVideoStart
      });
    } else {
      jQuery(videoRef.current).backgroundVideo("typeChange", {
        type: video.type,
        key: video.key,
        loop: bgVideoLoop,
        start: bgVideoStart
      });
    }
  }, [video.type]);

  return (
    <div
      ref={videoRef}
      className="brz-bg-video"
      data-type={dataType}
      data-key={video.key}
      data-loop={bgVideoLoop}
      data-start={bgVideoStart}
    >
      <iframe
        src={src}
        data-src={src}
        className="brz-iframe brz-bg-video__cover"
        loading="lazy"
        style={iframeStyle}
      />
    </div>
  );
}
