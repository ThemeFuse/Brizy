import classnames from "classnames";
import React, { ReactElement, useMemo } from "react";
import { SlideshowPreview } from "visual/component/Background/types/Slideshow/SlideshowPreview";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/global/hooks";
import { makeAttr } from "visual/utils/i18n/attribute";
import { getImageUrl } from "visual/utils/image";
import { read as readString } from "visual/utils/reader/string";
import { KenEffect, Transition } from "../../type";
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

  const isSlideDown = slideshowTransitionType === Transition.SlideDown;

  const className = classnames("brz-bg-slideshow", {
    "brz-bg-slideshow-rotate-180": isSlideDown
  });

  const classNameItem = classnames({
    "brz-bg-slideshow-burns-effect": kenBurnsEffect !== KenEffect.Off,
    "brz-bg-slideshow-rotate-180": isSlideDown
  });

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
};

export default Slideshow;
