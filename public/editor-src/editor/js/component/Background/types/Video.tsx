import jQuery from "jquery";
import React, { ReactElement, RefObject, useMemo, useRef } from "react";
import { customFileUrl } from "visual/utils/customFile/customFileUrl.js";
import { videoUrl } from "visual/utils/video";
import "../lib/jquery.background-video.js";
import { useLayoutEffect } from "../utils";

enum VideoType {
  Youtube = "youtube",
  Vimeo = "vimeo",
  BgVideoCustom = "bgVideoCustom",
  URL = "url"
}
type Props = {
  video?: {
    type: string;
    key: string;
  };
  videoLoop?: boolean;
  videoStart?: string;
  videoType?: string;
  customVideo?: string;
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

const Video: React.FC<Props> = ({
  video,
  videoLoop,
  videoStart,
  children,
  videoType,
  customVideo
}) => {
  const videoMedia = video || customVideo;

  const iframeStyle = {
    display: videoMedia ? "block" : "none"
  };

  const settings = {
    autoplay: true,
    background: true,
    controls: false,
    suggestedVideo: false,
    loop: videoLoop
  };

  const dataType = videoType ? videoType : "undefined";

  const isCustomVideo = useMemo(
    () => videoType === VideoType.BgVideoCustom || videoType === VideoType.URL,
    [videoType]
  );

  const videoRef = useRef<HTMLElement>(null);
  const customVideoRef = useRef<HTMLVideoElement>(null);
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

  useLayoutEffect(() => {
    if (videoRef.current && isCustomVideo) {
      jQuery(videoRef.current).backgroundVideo("reinit", {
        type: "custom",
        loop: videoLoop,
        start: videoStart
      });
    }
  }, [videoLoop, videoStart, isCustomVideo]);

  const src =
    video && !isCustomVideo
      ? videoUrl(video, settings)
      : dataType === VideoType.BgVideoCustom
      ? customFileUrl(customVideo)
      : customVideo;

  const getContent = useMemo((): ReactElement => {
    if (video && !isCustomVideo) {
      return (
        <>
          {src && (
            // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
            // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
            // and breaks our code(video, map inside megamenu isn't showing as example)
            <iframe
              src={src}
              data-src={src}
              className="brz-iframe intrinsic-ignore brz-bg-video__cover absolute top-0 left-0 w-full h-full border-none !max-w-none bg-no-repeat bg-cover"
              loading="lazy"
              style={iframeStyle}
              title="background-video"
            />
          )}
        </>
      );
    } else if (customVideo) {
      return (
        <>
          {src && (
            <video
              className="brz-bg-video-custom brz-bg-video__cover absolute top-0 left-0 w-full h-full border-none !max-w-none bg-no-repeat bg-cover"
              muted
              autoPlay
              playsInline
              src={src}
              data-src={src}
              ref={customVideoRef}
              style={iframeStyle}
            />
          )}
        </>
      );
    }
    return <></>;
  }, [video, customVideo, isCustomVideo, src, iframeStyle]);

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
        children: getContent
      })}
    </>
  );
};

export default Video;
