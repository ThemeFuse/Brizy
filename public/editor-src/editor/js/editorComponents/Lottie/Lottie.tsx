import React from "react";
import Lottie from "react-lottie";

type Props = {
  loop: boolean;
  autoplay: boolean;
  animationData: object;
  speed: number;
  direction: number;
  renderer: string;
};

const LottieControl: React.FC<Props> = ({
  loop = true,
  autoplay = true,
  animationData = {},
  speed = 1,
  direction = 1,
  renderer = "svg"
}) => {
  const defaultOptions = {
    loop,
    autoplay,
    animationData,
    renderer,
    rendererSettings: {
      preserveAspectRatio:
        renderer === "svg" ? "xMidYMid slice" : "xMidYMid meet"
    }
  };

  return (
    <Lottie
      options={defaultOptions}
      speed={speed}
      direction={direction * 1}
      isClickToPauseDisabled={true}
    />
  );
};

export default LottieControl;
