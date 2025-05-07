import classnames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import {
  Swiper as SwiperControl,
  SwiperSlide as SwiperSlideControl
} from "swiper/react";
import { SwiperOptions } from "swiper/types/swiper-options";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/providers/ConfigProvider";
import { getImageUrl } from "visual/utils/image";
import { read as readString } from "visual/utils/reader/string";
import { Effect, KenEffect, Transition } from "../../type";
import { getSlideType, handleSwiperResize } from "../../utils";
import { Slide } from "./Slide";
import { Props } from "./types";

const Slideshow = ({
  images,
  slideshowLoop = "on",
  slideshowDuration = 1,
  slideshowTransitionType = Transition.Fade,
  slideshowTransition = 1,
  kenBurnsEffect = KenEffect.Off
}: Props): ReactElement | null => {
  const { uid: _uid, fileName: _fileName } = images[0] ?? {};
  const config = useConfig();
  const modules = [EffectFade, Autoplay];
  const isSlideDown = slideshowTransitionType === Transition.SlideDown;
  const isFade = slideshowTransitionType === Transition.Fade;
  const isLoopEnabled = slideshowLoop === "on";

  const className = classnames("brz-bg-slideshow", {
    "brz-bg-slideshow-rotate-180": isSlideDown
  });

  const classNameItem = classnames({
    "brz-bg-slideshow-burns-effect": kenBurnsEffect !== KenEffect.Off,
    "brz-bg-slideshow-rotate-180": isSlideDown
  });

  const handleResize = useCallback(handleSwiperResize, []);

  const fadeOptions = useMemo(
    () =>
      isFade
        ? {
            fadeEffect: {
              crossFade: true
            }
          }
        : {},
    [isFade]
  );

  const firstImageStyle = useMemo(() => {
    const uid = readString(_uid) ?? "";
    const fileName = readString(_fileName) ?? "";

    return {
      backgroundImage: `url(${getImageUrl(
        {
          uid,
          fileName,
          sizeType: SizeType.original
        },
        config
      )})`
    };
  }, [_uid, _fileName, config]);

  const options: SwiperOptions = useMemo(() => {
    const dir =
      slideshowTransitionType === Transition.SlideRight ? { dir: "rtl" } : {};

    return {
      allowTouchMove: false,
      loop: isLoopEnabled,
      slidesPerView: 1,
      speed: slideshowTransition * 1000,
      direction: getSlideType(slideshowTransitionType),
      effect: isFade ? Effect.Fade : Effect.Slide,
      autoplay: {
        delay: slideshowDuration * 1000,
        stopOnLastSlide: !isLoopEnabled
      },
      ...fadeOptions,
      ...dir
    };
  }, [
    isFade,
    isLoopEnabled,
    fadeOptions,
    slideshowTransition,
    slideshowTransitionType,
    slideshowDuration
  ]);

  // these keys are required for reinitialize Swiper when value from toolbar was changed
  const key = useMemo(
    () =>
      `${JSON.stringify(
        images
      )} ${slideshowTransitionType} ${slideshowLoop} ${slideshowDuration} ${slideshowTransition} ${kenBurnsEffect}`,
    [
      images,
      slideshowTransitionType,
      slideshowLoop,
      slideshowDuration,
      slideshowTransition,
      kenBurnsEffect
    ]
  );

  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="brz-bg-slideshow">
        <div className="brz-bg-slideshow-item" style={firstImageStyle} />
      </div>
    );
  }

  return (
    <SwiperControl
      {...options}
      key={key}
      className={className}
      modules={modules}
      onResize={handleResize}
    >
      {images.map((item, index) => (
        <SwiperSlideControl key={index}>
          <Slide className={classNameItem} item={item} />
        </SwiperSlideControl>
      ))}
    </SwiperControl>
  );
};

export default Slideshow;
