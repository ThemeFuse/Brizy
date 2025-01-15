import classnames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import {
  Swiper as SwiperControl,
  SwiperSlide as SwiperSlideControl
} from "swiper/react";
import { SwiperOptions } from "swiper/types/swiper-options";
import { SlideshowPreview } from "visual/component/Background/types/Slideshow/SlideshowPreview";
import type { Image } from "visual/component/Options/types/dev/Gallery/types/Image";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/global/hooks";
import { RenderType, isEditor, isView } from "visual/providers/RenderProvider";
import { makeAttr } from "visual/utils/i18n/attribute";
import { getImageUrl } from "visual/utils/image";
import { read as readString } from "visual/utils/reader/string";
import { Effect, KenEffect, Transition } from "../../type";
import { getSlideType, handleSwiperResize } from "../../utils";
import { Slide } from "./Slide";

interface Props {
  images: Image[];
  renderContext: RenderType;
  slideshowLoop?: string;
  slideshowDuration?: number;
  slideshowTransitionType?: Transition;
  slideshowTransition?: number;
  kenBurnsEffect?: KenEffect;
}

const Slideshow = ({
  images,
  renderContext,
  slideshowLoop = "on",
  slideshowDuration = 1,
  slideshowTransitionType = Transition.Fade,
  slideshowTransition = 1,
  kenBurnsEffect = KenEffect.Off
}: Props): ReactElement | null => {
  const { uid: _uid, fileName: _fileName } = images[0] ?? {};
  const config = useConfig();

  const _isEditor = isEditor(renderContext);

  const modules = _isEditor ? [EffectFade, Autoplay] : [];
  const Swiper = _isEditor ? SwiperControl : undefined;
  const SwiperSlide = _isEditor ? SwiperSlideControl : undefined;

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

  if (isView(renderContext) || !Swiper || !SwiperSlide) {
    const attr = {
      [makeAttr("loop")]: slideshowLoop,
      [makeAttr("duration")]: slideshowDuration,
      [makeAttr("transition")]: slideshowTransition,
      [makeAttr("transition-type")]: slideshowTransitionType,
      [makeAttr("total-items")]: images.length
    };

    return (
      <SlideshowPreview
        className={className}
        itemClassName={classNameItem}
        images={images}
        attributes={attr}
      />
    );
  }

  return (
    <Swiper
      {...options}
      key={key}
      className={className}
      modules={modules}
      onResize={handleResize}
    >
      {images.map((item, index) => (
        <SwiperSlide key={index}>
          <Slide className={classNameItem} item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slideshow;
