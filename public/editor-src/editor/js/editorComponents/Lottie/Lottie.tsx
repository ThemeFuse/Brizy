import React from "react";
import Lottie from "react-lottie";

type Props = {
  loop: boolean;
  autoplay: boolean;
  animationData: object;
  speed: number;
  direction: number;
};

const LottieControl: React.FC<Props> = ({
  loop = true,
  autoplay = true,
  animationData = {},
  speed = 1,
  direction = 1
}) => {
  const defaultOptions = {
    loop,
    autoplay,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
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
