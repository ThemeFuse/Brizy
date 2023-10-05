import { AnimationOptions } from "./types";

export function getAnimations(keyframe: string): AnimationOptions | undefined {
  const animations: Record<string, AnimationOptions> = {
    "brz-grow": {
      animation: [
        {
          WebkitTransform: "scale(1.1)",
          transform: "scale(1.1)",
          offset: 1
        }
      ],
      extraOptions: {
        fill: "forwards",
        easing: "ease"
      }
    },
    "brz-shrink": {
      animation: [
        {
          WebkitTransform: "scale(0.9)",
          transform: "scale(0.9)",
          offset: 1
        }
      ],
      extraOptions: {
        fill: "forwards",
        easing: "ease"
      }
    },
    "brz-pulse": {
      animation: [
        {
          WebkitTransform: "scale(1.1)",
          transform: "scale(1.1)",
          offset: 0.25
        },
        {
          WebkitTransform: "scale(0.9)",
          transform: "scale(0.9)",
          offset: 0.75
        }
      ],
      reversibleAnimation: false,
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-pulse-grow": {
      animation: [
        {
          WebkitTransform: "scale(1)",
          transform: "scale(1)",
          offset: 0
        },
        {
          WebkitTransform: "scale(1.1)",
          transform: "scale(1.1)",
          offset: 0.5
        },
        {
          WebkitTransform: "scale(1)",
          transform: "scale(1)",
          offset: 1
        }
      ],
      reversibleAnimation: false,
      extraOptions: { iterations: Infinity, easing: "ease" }
    },
    "brz-pulse-shrink": {
      animation: [
        {
          WebkitTransform: "scale(0.9)",
          transform: "scale(0.9)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-push": {
      animation: [
        {
          WebkitTransform: "scale(0.8)",
          transform: "scale(0.8)",
          offset: 0.5
        },
        {
          WebkitTransform: "scale(1)",
          transform: "scale(1)",
          offset: 1
        }
      ],
      extraOptions: { easing: "ease" },
      reversibleAnimation: false
    },
    "brz-pop": {
      animation: [
        {
          WebkitTransform: "scale(1.2)",
          transform: "scale(1.2)",
          offset: 0.5
        }
      ],
      extraOptions: { easing: "ease" },
      reversibleAnimation: false
    },
    "brz-bounce-in": {
      animation: [
        {
          WebkitAnimationTimingFunction:
            "cubic-bezier(0.47, 2.02, 0.31, -0.36)",
          offset: 0
        },
        {
          WebkitTransform: "scale(1.2)",
          transform: "scale(1.2)",
          offset: 1
        }
      ],
      extraOptions: {
        fill: "forwards",
        easing: "cubic-bezier(0.47, 2.02, 0.31, -0.36)"
      }
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
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-grow-rotate": {
      animation: [
        {
          WebkitTransform: "scale(1.1) rotate(4deg)",
          transform: "scale(1.1) rotate(4deg)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
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
      animation: {
        multiAnimation: [
          {
            keyframes: [
              {
                WebkitTransform: "translateY(-8px)",
                transform: "translateY(-8px)",
                offset: 1
              }
            ],
            extraOptions: { fill: "forwards", duration: 200 }
          },
          {
            keyframes: [
              {
                WebkitTransform: "translateY(-8px)",
                transform: "translateY(-8px)",
                offset: 0
              },
              {
                WebkitTransform: "translateY(-4px)",
                transform: "translateY(-4px)",
                offset: 0.5
              },
              {
                WebkitTransform: "translateY(-8px)",
                transform: "translateY(-8px)",
                offset: 1
              }
            ],
            extraOptions: {
              iterations: Infinity
            }
          }
        ],
        endAnimation: {
          keyframes: [
            {
              WebkitTransform: "translateY(-8px)",
              transform: "translateY(-8px)",
              offset: 0
            },
            {
              WebkitTransform: "translateY(0)",
              transform: "translateY(0)",
              offset: 1
            }
          ],
          extraOptions: {
            easing: "ease-in-out",
            duration: 200,
            fill: "forwards",
            iterations: 1
          }
        }
      }
    },
    "brz-hang": {
      animation: {
        multiAnimation: [
          {
            keyframes: [
              {
                WebkitTransform: "translateY(8px)",
                transform: "translateY(8px)",
                offset: 1
              }
            ],
            extraOptions: { fill: "forwards", duration: 200 }
          },
          {
            keyframes: [
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
            extraOptions: {
              iterations: Infinity
            }
          }
        ],
        endAnimation: {
          keyframes: [
            {
              WebkitTransform: "translateY(8px)",
              transform: "translateY(8px)",
              offset: 0
            },
            {
              WebkitTransform: "translateY(0)",
              transform: "translateY(0)",
              offset: 1
            }
          ],
          extraOptions: {
            easing: "ease-in-out",
            duration: 200,
            fill: "forwards",
            iterations: 1
          }
        }
      }
    },
    "brz-skew": {
      animation: [
        {
          WebkitTransform: "skew(-10deg)",
          transform: "skew(-10deg)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-skew-forward": {
      animation: [
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 0
        },
        {
          WebkitTransform: "skew(-10deg)",
          transform: "skew(-10deg)",
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-skew-backward": {
      animation: [
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 0
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-wobble-vertical": {
      animation: [
        {
          WebkitTransform: "translateY(8px)",
          transform: "translateY(8px)",
          offset: 0.16649999999999998
        },
        {
          WebkitTransform: "translateY(-6px)",
          transform: "translateY(-6px)",
          offset: 0.33299999999999996
        },
        {
          WebkitTransform: "translateY(4px)",
          transform: "translateY(4px)",
          offset: 0.49950000000000006
        },
        {
          WebkitTransform: "translateY(-2px)",
          transform: "translateY(-2px)",
          offset: 0.6659999999999999
        },
        {
          WebkitTransform: "translateY(1px)",
          transform: "translateY(1px)",
          offset: 0.8325
        },
        {
          WebkitTransform: "translateY(0)",
          transform: "translateY(0)",
          offset: 1
        }
      ],
      reversibleAnimation: false,
      extraOptions: { easing: "ease" }
    },
    "brz-wobble-horizontal": {
      animation: [
        {
          WebkitTransform: "translateX(8px)",
          transform: "translateX(8px)",
          offset: 0.16649999999999998
        },
        {
          WebkitTransform: "translateX(-6px)",
          transform: "translateX(-6px)",
          offset: 0.33299999999999996
        },
        {
          WebkitTransform: "translateX(4px)",
          transform: "translateX(4px)",
          offset: 0.49950000000000006
        },
        {
          WebkitTransform: "translateX(-2px)",
          transform: "translateX(-2px)",
          offset: 0.6659999999999999
        },
        {
          WebkitTransform: "translateX(1px)",
          transform: "translateX(1px)",
          offset: 0.8325
        },
        {
          WebkitTransform: "translateX(0)",
          transform: "translateX(0)",
          offset: 1
        }
      ],
      extraOptions: { easing: "ease" },
      reversibleAnimation: false
    },
    "brz-wobble-to-bottom-right": {
      animation: [
        {
          WebkitTransform: "translate(8px, 8px)",
          transform: "translate(8px, 8px)",
          offset: 0.16649999999999998
        },
        {
          WebkitTransform: "translate(-6px, -6px)",
          transform: "translate(-6px, -6px)",
          offset: 0.33299999999999996
        },
        {
          WebkitTransform: "translate(4px, 4px)",
          transform: "translate(4px, 4px)",
          offset: 0.49950000000000006
        },
        {
          WebkitTransform: "translate(-2px, -2px)",
          transform: "translate(-2px, -2px)",
          offset: 0.6659999999999999
        },
        {
          WebkitTransform: "translate(1px, 1px)",
          transform: "translate(1px, 1px)",
          offset: 0.8325
        },
        {
          WebkitTransform: "translate(0, 0)",
          transform: "translate(0, 0)",
          offset: 1
        }
      ],
      extraOptions: { easing: "ease" },
      reversibleAnimation: false
    },
    "brz-wobble-to-top-right": {
      animation: [
        {
          WebkitTransform: "translate(8px, -8px)",
          transform: "translate(8px, -8px)",
          offset: 0.16649999999999998
        },
        {
          WebkitTransform: "translate(-6px, 6px)",
          transform: "translate(-6px, 6px)",
          offset: 0.33299999999999996
        },
        {
          WebkitTransform: "translate(4px, -4px)",
          transform: "translate(4px, -4px)",
          offset: 0.49950000000000006
        },
        {
          WebkitTransform: "translate(-2px, 2px)",
          transform: "translate(-2px, 2px)",
          offset: 0.6659999999999999
        },
        {
          WebkitTransform: "translate(1px, -1px)",
          transform: "translate(1px, -1px)",
          offset: 0.8325
        },
        {
          WebkitTransform: "translate(0, 0)",
          transform: "translate(0, 0)",
          offset: 1
        }
      ],
      extraOptions: { easing: "ease" },
      reversibleAnimation: false
    },
    "brz-wobble-top": {
      animation: [
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 0
        },
        {
          WebkitTransform: "skew(-12deg)",
          transform: "skew(-12deg)",
          offset: 0.16649999999999998
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          offset: 0.33299999999999996
        },
        {
          WebkitTransform: "skew(-6deg)",
          transform: "skew(-6deg)",
          offset: 0.49950000000000006
        },
        {
          WebkitTransform: "skew(4deg)",
          transform: "skew(4deg)",
          offset: 0.6659999999999999
        },
        {
          WebkitTransform: "skew(-2deg)",
          transform: "skew(-2deg)",
          offset: 0.8325
        },
        {
          WebkitTransformOrigin: "0 100%",
          transformOrigin: "0 100%",
          offset: 1
        },
        {
          WebkitTransform: "skew(0)",
          transform: "skew(0)",
          offset: 1
        }
      ],
      extraOptions: { easing: "ease" },
      reversibleAnimation: false
    },
    "brz-wobble-bottom": {
      animation: [
        {
          WebkitTransformOrigin: "100% 0",
          transformOrigin: "100% 0",
          offset: 0
        },
        {
          WebkitTransform: "skew(-12deg)",
          transform: "skew(-12deg)",
          offset: 0.16649999999999998
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          offset: 0.33299999999999996
        },
        {
          WebkitTransform: "skew(-6deg)",
          transform: "skew(-6deg)",
          offset: 0.49950000000000006
        },
        {
          WebkitTransform: "skew(4deg)",
          transform: "skew(4deg)",
          offset: 0.6659999999999999
        },
        {
          WebkitTransform: "skew(-2deg)",
          transform: "skew(-2deg)",
          offset: 0.8325
        },
        {
          WebkitTransformOrigin: "100% 0",
          transformOrigin: "100% 0",
          offset: 1
        },
        {
          WebkitTransform: "skew(0)",
          transform: "skew(0)",
          offset: 1
        }
      ],
      reversibleAnimation: false,
      extraOptions: { easing: "ease" }
    },
    "brz-wobble-skew": {
      animation: [
        {
          WebkitTransform: "skew(-12deg)",
          transform: "skew(-12deg)",
          offset: 0.16649999999999998
        },
        {
          WebkitTransform: "skew(10deg)",
          transform: "skew(10deg)",
          offset: 0.33299999999999996
        },
        {
          WebkitTransform: "skew(-6deg)",
          transform: "skew(-6deg)",
          offset: 0.49950000000000006
        },
        {
          WebkitTransform: "skew(4deg)",
          transform: "skew(4deg)",
          offset: 0.6659999999999999
        },
        {
          WebkitTransform: "skew(-2deg)",
          transform: "skew(-2deg)",
          offset: 0.8325
        },
        {
          WebkitTransform: "skew(0)",
          transform: "skew(0)",
          offset: 1
        }
      ],
      reversibleAnimation: false,
      extraOptions: { easing: "ease" }
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
      reversibleAnimation: false,
      extraOptions: { iterations: Infinity, easing: "ease" }
    },
    "brz-buzz-out": {
      animation: [
        {
          WebkitTransform: "translateX(3px) rotate(2deg)",
          transform: "translateX(3px) rotate(2deg)",
          offset: 0.1
        },
        {
          WebkitTransform: "translateX(-3px) rotate(-2deg)",
          transform: "translateX(-3px) rotate(-2deg)",
          offset: 0.2
        },
        {
          WebkitTransform: "translateX(3px) rotate(2deg)",
          transform: "translateX(3px) rotate(2deg)",
          offset: 0.3
        },
        {
          WebkitTransform: "translateX(-3px) rotate(-2deg)",
          transform: "translateX(-3px) rotate(-2deg)",
          offset: 0.4
        },
        {
          WebkitTransform: "translateX(2px) rotate(1deg)",
          transform: "translateX(2px) rotate(1deg)",
          offset: 0.5
        },
        {
          WebkitTransform: "translateX(-2px) rotate(-1deg)",
          transform: "translateX(-2px) rotate(-1deg)",
          offset: 0.6
        },
        {
          WebkitTransform: "translateX(2px) rotate(1deg)",
          transform: "translateX(2px) rotate(1deg)",
          offset: 0.7
        },
        {
          WebkitTransform: "translateX(-2px) rotate(-1deg)",
          transform: "translateX(-2px) rotate(-1deg)",
          offset: 0.8
        },
        {
          WebkitTransform: "translateX(1px) rotate(0)",
          transform: "translateX(1px) rotate(0)",
          offset: 0.9
        },
        {
          WebkitTransform: "translateX(-1px) rotate(0)",
          transform: "translateX(-1px) rotate(0)",
          offset: 1
        }
      ],
      reversibleAnimation: false,
      extraOptions: { easing: "ease" }
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
      extraOptions: { fill: "forwards", easing: "ease" }
    },
    "brz-backward": {
      animation: [
        {
          WebkitTransform: "translateX(-8px)",
          transform: "translateX(-8px)",
          offset: 1
        }
      ],
      extraOptions: { fill: "forwards", easing: "ease" }
    }
  };

  return animations[keyframe];
}
