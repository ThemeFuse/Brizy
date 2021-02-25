import React, { ReactElement, RefObject, useRef } from "react";
import classnames from "classnames";
import jQuery from "jquery";
import { getStore } from "visual/redux/store";
import { IS_WP } from "visual/utils/env";
import { useLayoutEffect } from "../utils";

import "../lib/jquery.parallax.js";

const destroyParallax = (node: HTMLElement): void => {
  if (node.parentElement) {
    jQuery(node.parentElement).parallax("destroy");
  }
};

const initParallax = (node: HTMLElement): void => {
  if (node.parentElement) {
    jQuery(node.parentElement).parallax({
      bgClass: "brz-bg-image", // WARNING: intentionally not `brz-bg-image-parallax`
      wheelIgnoreClass: [
        "brz-ed-container-plus",
        "brz-ed-container-whiteout-show",
        "brz-content-show",
        ...(IS_WP ? ["media-modal"] : [])
      ]
    });
  }
};

type Props = {
  showParallax?: boolean;
  children: (d: {
    innerRef?: RefObject<HTMLElement>;
    attr: {
      className?: string;
    };
  }) => ReactElement;
};

const Image: React.FC<Props> = ({ showParallax, children }) => {
  const currentDeviceMode = getStore().getState().ui.deviceMode;
  showParallax = showParallax && currentDeviceMode === "desktop";

  const className = classnames("brz-bg-image", {
    "brz-bg-image-parallax": showParallax
  });

  const imageRef = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);

  useLayoutEffect(
    () => (): void => {
      if (imageRef.current) {
        destroyParallax(imageRef.current);
      }
    },
    []
  );

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if (imageRef.current && showParallax) {
        initParallax(imageRef.current);
      }
    } else {
      if (imageRef.current) {
        showParallax
          ? initParallax(imageRef.current)
          : destroyParallax(imageRef.current);
      }
    }
  });

  return children({
    innerRef: imageRef,
    attr: {
      className
    }
  });
};

export default Image;
