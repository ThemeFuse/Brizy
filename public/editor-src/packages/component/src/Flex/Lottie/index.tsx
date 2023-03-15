import classNames from "classnames";
import { LottieOptions, useLottie } from "lottie-react";
import React, { useCallback, useEffect, useRef } from "react";
import { Props } from "./types";

export const LottieEditor: React.FC<Props> = ({
  isLoop = true,
  isAutoplay = true,
  animationData = {},
  speed = 1,
  direction = 1,
  renderer = "svg"
}) => {
  const preserveAspectRatio =
    renderer === "svg" ? "xMidYMid slice" : "xMidYMid meet";

  const options: LottieOptions = {
    loop: isLoop,
    autoplay: isAutoplay,
    animationData,
    // @ts-expect-error lottie-react renderer type is missing canvas
    renderer,
    rendererSettings: {
      preserveAspectRatio
    }
  };

  const Lottie = useLottie(options);
  const speedRef = useRef<number>(speed);

  const handleAnimation = useCallback(() => {
    if (!isAutoplay) {
      return Lottie.stop();
    }
    // play reverse animation when component mounts
    if (direction === -1 && speedRef.current === speed) {
      const duration = Lottie.getDuration(true);
      if (duration) {
        return Lottie.goToAndPlay(duration, true);
      }
    }

    speedRef.current = speed;
    Lottie.play();
  }, [Lottie]);

  useEffect(() => {
    Lottie.setSpeed(speed);
    Lottie.setDirection(direction);
    handleAnimation();
  }, [handleAnimation]);

  const { View } = Lottie;

  return View;
};

export const LottieView: React.FC<Props> = ({
  renderer,
  animationData,
  speed,
  isLoop,
  isAutoplay,
  direction
}) => {
  const className = classNames("brz-lottie-anim", {
    "brz-lottie__canvas": renderer === "canvas"
  });
  return (
    <div
      className={className}
      data-animate-name={animationData}
      data-anim-speed={speed}
      data-anim-loop={isLoop}
      data-anim-autoplay={isAutoplay}
      data-anim-direction={direction}
      data-render-type={renderer}
    />
  );
};
