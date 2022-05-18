import React, { ReactElement, RefObject, useRef } from "react";
import jQuery from "jquery";
import { videoUrl } from "visual/utils/video";
import { useLayoutEffect } from "../utils";

import "../lib/jquery.background-video.js";

type Props = {
  video?: {
    type: string;
    key: string;
  };
  videoLoop?: boolean;
  videoStart?: string;
  children: (data: {
    innerRef?: RefObject<HTMLElement>;
    attr: {
      "data-type"?: string;
      "data-key"?: string;
      "data-loop"?: boolean;
      "data-start"?: string;
      className?: string;
    };
    children: ReactElement;
  }) => ReactElement;
};

const Video: React.FC<Props> = ({ video, videoLoop, videoStart, children }) => {
  const iframeStyle = {
    display: video ? "block" : "none"
  };

  const settings = {
    autoplay: true,
    background: true,
    controls: false,
    suggestedVideo: false,
    loop: videoLoop
  };

  const dataType = video ? video.type : undefined;
  const src = video ? videoUrl(video, settings) : undefined;

  const videoRef = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    return (): void => {
      if (videoRef.current) {
        jQuery(videoRef.current).backgroundVideo("destroy");
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isInitialMount.current && videoRef.current) {
      jQuery(videoRef.current).backgroundVideo("resize");
    }
  });

  useLayoutEffect(() => {
    if (!isInitialMount.current && videoRef.current) {
      jQuery(videoRef.current).backgroundVideo("setLoop", videoLoop);
    }
  }, [videoLoop]);

  useLayoutEffect(() => {
    if (!isInitialMount.current && videoRef.current) {
      jQuery(videoRef.current).backgroundVideo("seekTo", videoStart);
    }
  }, [videoStart]);

  useLayoutEffect(() => {
    if (isInitialMount.current && videoRef.current) {
      isInitialMount.current = false;

      jQuery(videoRef.current).backgroundVideo({
        type: video?.type,
        key: video?.key,
        loop: videoLoop,
        start: videoStart
      });
    } else {
      if (videoRef.current) {
        jQuery(videoRef.current).backgroundVideo("typeChange", {
          type: video?.type,
          key: video?.key,
          loop: videoLoop,
          start: videoStart
        });
      }
    }
  }, [video?.type]);

  // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
  // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
  // and breaks our code(video, map inside megamenu isn't showing as example)
  const content = (
    <iframe
      src={src}
      data-src={src}
      className="brz-iframe intrinsic-ignore brz-bg-video__cover"
      loading="lazy"
      style={iframeStyle}
    />
  );

  return (
    <>
      {children({
        innerRef: videoRef,
        attr: {
          "data-type": dataType,
          "data-key": video?.key,
          "data-loop": videoLoop,
          "data-start": videoStart
        },
        children: content
      })}
    </>
  );
};

export default Video;
