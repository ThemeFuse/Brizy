import { AnimationOptions } from "./types";

export default function (keyframe: string): AnimationOptions | undefined {
  const animations: Record<string, AnimationOptions> = {
    "brz-grow": {
      animation: [
        {
          WebkitTransform: "scale(1.1)",
          transform: "scale(1.1)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {
        fill: "forwards"
      }
    },
    "brz-shrink": {
      animation: [
        {
          WebkitTransform: "scale(0.9)",
          transform: "scale(0.9)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {
        fill: "forwards"
      }
    },
    "brz-pulse": {
      animation: [
        {
          WebkitTransform: "scale(1.1)",
          transform: "scale(1.1)",
          offset: 0.25,
          easing: "linear"
        },
        {
          WebkitTransform: "scale(0.9)",
          transform: "scale(0.9)",
          offset: 0.75,
          easing: "linear"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-pulse-grow": {
      animation: [
        {
          WebkitTransform: "scale(1)",
          transform: "scale(1)",
          offset: 0,
          easing: "linear"
        },
        {
          WebkitTransform: "scale(1.1)",
          transform: "scale(1.1)",
          offset: 0.5,
          easing: "linear"
        },
        {
          WebkitTransform: "scale(1)",
          transform: "scale(1)",
          offset: 1,
          easing: "linear"
        }
      ],
      extraOptions: { iterations: Infinity }
    },
    "brz-pulse-shrink": {
      animation: [
        {
          WebkitTransform: "scale(0.9)",
          transform: "scale(0.9)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-push": {
      animation: [
        {
          WebkitTransform: "scale(0.8)",
          transform: "scale(0.8)",
          offset: 0.5,
          easing: "ease"
        },
        {
          WebkitTransform: "scale(1)",
          transform: "scale(1)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-pop": {
      animation: [
        {
          WebkitTransform: "scale(1.2)",
          transform: "scale(1.2)",
          offset: 0.5,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-bounce-in": {
      animation: [
        {
          WebkitAnimationTimingFunction:
            "cubic-bezier(0.47, 2.02, 0.31, -0.36)",
          offset: 0,
          easing: "cubic-bezier(0.47, 2.02, 0.31, -0.36)"
        },
        {
          WebkitTransform: "scale(1.2)",
          transform: "scale(1.2)",
          offset: 1,
          easing: "cubic-bezier(0.47, 2.02, 0.31, -0.36)"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-bounce-out": {
      animation: [
        {
          WebkitAnimationTimingFunction:
            "cubic-bezier(0.47, 2.02, 0.31, -0.36)",
          offset: 0,
          easing: "cubic-bezier(0.47, 2.02, 0.31, -0.36)"
        },
        {
          WebkitTransform: "scale(0.8)",
          transform: "scale(0.8)",
          WebkitAnimationTimingFunction:
            "cubic-bezier(0.47, 2.02, 0.31, -0.36)",
          offset: 1,
          easing: "cubic-bezier(0.47, 2.02, 0.31, -0.36)"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-rotate": {
      animation: [
        {
          WebkitTransform: "rotate(4deg)",
          transform: "rotate(4deg)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-grow-rotate": {
      animation: [
        {
          WebkitTransform: "scale(1.1) rotate(4deg)",
          transform: "scale(1.1) rotate(4deg)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-float": {
      animation: [
        {
          WebkitTransform: "translateY(-0px)",
          transform: "translateY(-0px)",
          offset: 0
        },
        {
          WebkitTransform: "translateY(-8px)",
          transform: "translateY(-8px)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-sink": {
      animation: [
        {
          WebkitTransform: "translateY(0px)",
          transform: "translateY(0px)",
          offset: 0
        },
        {
          WebkitTransform: "translateY(8px)",
          transform: "translateY(8px)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-bob": {
      animation: [
        {
          WebkitTransform: "translateY(-8px)",
          transform: "translateY(-8px)",
          offset: 0.25
        },
        {
          WebkitTransform: "translateY(-4px)",
          transform: "translateY(-4px)",
          offset: 0.5
        },
        {
          WebkitTransform: "translateY(-8px)",
          transform: "translateY(-8px)",
          offset: 0.75
        }
      ],
      extraOptions: { easing: "ease", iterations: Infinity }
    },
    // floatxx
    "brz-hang": {
      animation: [
        {
          WebkitTransform: "translateY(8px)",
          transform: "translateY(8px)",
          offset: 0
        },
        {
          WebkitTransform: "translateY(4px)",
          transform: "translateY(4px)",
          offset: 0.5
        },
        {
          WebkitTransform: "translateY(8px)",
          transform: "translateY(8px)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease", iterations: Infinity }
    },
    "brz-skew": {
      animation: [
        {
          WebkitTransform: "skew(-10deg)",
          transform: "skew(-10deg)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-skew-forward": {
      animation: [
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 0,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-10deg)",
          transform: "skew(-10deg)",
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-skew-backward": {
      animation: [
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 0,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: { fill: "forwards" }
    },
    "brz-wobble-vertical": {
      animation: [
        {
          WebkitTransform: "translateY(8px)",
          transform: "translateY(8px)",
          offset: 0.16649999999999998,
          easing: "ease"
        },
        {
          WebkitTransform: "translateY(-6px)",
          transform: "translateY(-6px)",
          offset: 0.33299999999999996,
          easing: "ease"
        },
        {
          WebkitTransform: "translateY(4px)",
          transform: "translateY(4px)",
          offset: 0.49950000000000006,
          easing: "ease"
        },
        {
          WebkitTransform: "translateY(-2px)",
          transform: "translateY(-2px)",
          offset: 0.6659999999999999,
          easing: "ease"
        },
        {
          WebkitTransform: "translateY(1px)",
          transform: "translateY(1px)",
          offset: 0.8325,
          easing: "ease"
        },
        {
          WebkitTransform: "translateY(0)",
          transform: "translateY(0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-wobble-horizontal": {
      animation: [
        {
          WebkitTransform: "translateX(8px)",
          transform: "translateX(8px)",
          offset: 0.16649999999999998,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(-6px)",
          transform: "translateX(-6px)",
          offset: 0.33299999999999996,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(4px)",
          transform: "translateX(4px)",
          offset: 0.49950000000000006,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(-2px)",
          transform: "translateX(-2px)",
          offset: 0.6659999999999999,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(1px)",
          transform: "translateX(1px)",
          offset: 0.8325,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(0)",
          transform: "translateX(0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-wobble-to-bottom-right": {
      animation: [
        {
          WebkitTransform: "translate(8px, 8px)",
          transform: "translate(8px, 8px)",
          offset: 0.16649999999999998,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(-6px, -6px)",
          transform: "translate(-6px, -6px)",
          offset: 0.33299999999999996,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(4px, 4px)",
          transform: "translate(4px, 4px)",
          offset: 0.49950000000000006,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(-2px, -2px)",
          transform: "translate(-2px, -2px)",
          offset: 0.6659999999999999,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(1px, 1px)",
          transform: "translate(1px, 1px)",
          offset: 0.8325,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(0, 0)",
          transform: "translate(0, 0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-wobble-to-top-right": {
      animation: [
        {
          WebkitTransform: "translate(8px, -8px)",
          transform: "translate(8px, -8px)",
          offset: 0.16649999999999998,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(-6px, 6px)",
          transform: "translate(-6px, 6px)",
          offset: 0.33299999999999996,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(4px, -4px)",
          transform: "translate(4px, -4px)",
          offset: 0.49950000000000006,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(-2px, 2px)",
          transform: "translate(-2px, 2px)",
          offset: 0.6659999999999999,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(1px, -1px)",
          transform: "translate(1px, -1px)",
          offset: 0.8325,
          easing: "ease"
        },
        {
          WebkitTransform: "translate(0, 0)",
          transform: "translate(0, 0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-wobble-top": {
      animation: [
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 0,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-12deg)",
          transform: "skew(-12deg)",
          offset: 0.16649999999999998,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          offset: 0.33299999999999996,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-6deg)",
          transform: "skew(-6deg)",
          offset: 0.49950000000000006,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(4deg)",
          transform: "skew(4deg)",
          offset: 0.6659999999999999,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-2deg)",
          transform: "skew(-2deg)",
          offset: 0.8325,
          easing: "ease"
        },
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 1,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(0)",
          transform: "skew(0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-wobble-bottom": {
      animation: [
        {
          WebkitTransformOrigin: "100% 0",
          transformOrigin: "100% 0",
          offset: 0,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-12deg)",
          transform: "skew(-12deg)",
          offset: 0.16649999999999998,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          offset: 0.33299999999999996,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-6deg)",
          transform: "skew(-6deg)",
          offset: 0.49950000000000006,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(4deg)",
          transform: "skew(4deg)",
          offset: 0.6659999999999999,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-2deg)",
          transform: "skew(-2deg)",
          offset: 0.8325,
          easing: "ease"
        },
        {
          WebkitTransformOrigin: "100% 0",
          transformOrigin: "100% 0",
          offset: 1,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(0)",
          transform: "skew(0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-wobble-skew": {
      animation: [
        {
          WebkitTransform: "skew(-12deg)",
          transform: "skew(-12deg)",
          offset: 0.16649999999999998,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          offset: 0.33299999999999996,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-6deg)",
          transform: "skew(-6deg)",
          offset: 0.49950000000000006,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(4deg)",
          transform: "skew(4deg)",
          offset: 0.6659999999999999,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(-2deg)",
          transform: "skew(-2deg)",
          offset: 0.8325,
          easing: "ease"
        },
        {
          WebkitTransform: "skew(0)",
          transform: "skew(0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-buzz": {
      animation: [
        {
          WebkitTransform: "translateX(3px) rotate(2deg)",
          transform: "translateX(3px) rotate(2deg)",
          offset: 0.5
        },
        {
          WebkitTransform: "translateX(-3px) rotate(-2deg)",
          transform: "translateX(-3px) rotate(-2deg)",
          offset: 1
        }
      ],
      extraOptions: { iterations: Infinity, easing: "linear" }
    },
    "brz-buzz-out": {
      animation: [
        {
          WebkitTransform: "translateX(3px) rotate(2deg)",
          transform: "translateX(3px) rotate(2deg)",
          offset: 0.1,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(-3px) rotate(-2deg)",
          transform: "translateX(-3px) rotate(-2deg)",
          offset: 0.2,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(3px) rotate(2deg)",
          transform: "translateX(3px) rotate(2deg)",
          offset: 0.3,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(-3px) rotate(-2deg)",
          transform: "translateX(-3px) rotate(-2deg)",
          offset: 0.4,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(2px) rotate(1deg)",
          transform: "translateX(2px) rotate(1deg)",
          offset: 0.5,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(-2px) rotate(-1deg)",
          transform: "translateX(-2px) rotate(-1deg)",
          offset: 0.6,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(2px) rotate(1deg)",
          transform: "translateX(2px) rotate(1deg)",
          offset: 0.7,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(-2px) rotate(-1deg)",
          transform: "translateX(-2px) rotate(-1deg)",
          offset: 0.8,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(1px) rotate(0)",
          transform: "translateX(1px) rotate(0)",
          offset: 0.9,
          easing: "ease"
        },
        {
          WebkitTransform: "translateX(-1px) rotate(0)",
          transform: "translateX(-1px) rotate(0)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: {}
    },
    "brz-forward": {
      animation: [
        {
          WebkitTransform: "translateX(0px)",
          transform: "translateX(0px)",
          offset: 0
        },
        {
          WebkitTransform: "translateX(8px)",
          transform: "translateX(8px)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "linear" }
    },
    "brz-backward": {
      animation: [
        {
          WebkitTransform: "translateX(-8px)",
          transform: "translateX(-8px)",
          offset: 1,
          easing: "ease"
        }
      ],
      extraOptions: { fill: "forwards" }
    }
  };

  return animations[keyframe];
}
