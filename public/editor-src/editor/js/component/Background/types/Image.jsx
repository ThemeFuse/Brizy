import React, { useRef } from "react";
import classnames from "classnames";
import jQuery from "jquery";
import { getStore } from "visual/redux/store";
import { IS_WP } from "visual/utils/models";
import { useLayoutEffect } from "../utils";

import "../lib/jquery.parallax.js";

const destroyParallax = node => {
  jQuery(node).removeClass("brz-bg-image-parallax");
  jQuery(node.parentElement).parallax("destroy");
};

const initParallax = node => {
  jQuery(node).addClass("brz-bg-image-parallax");
  jQuery(node.parentElement).parallax({
    bgClass: "brz-bg-image", // WARNING: intentionally not `brz-bg-image-parallax`
    wheelIgnoreClass: [
      "brz-ed-container-plus",
      "brz-ed-container-whiteout-show",
      "brz-content-show",
      ...(IS_WP ? ["media-modal"] : [])
    ]
  });
};

export default function Image({ showParallax }) {
  const currentDeviceMode = getStore().getState().ui.deviceMode;
  showParallax = showParallax && currentDeviceMode === "desktop";

  const className = classnames("brz-bg-image", {
    "brz-bg-image-parallax": showParallax
  });

  const imageRef = useRef();
  const isInitialMount = useRef(true);

  useLayoutEffect(
    () => () => {
      destroyParallax(imageRef.current);
    },
    []
  );

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      showParallax && initParallax(imageRef.current);
    } else {
      showParallax
        ? initParallax(imageRef.current)
        : destroyParallax(imageRef.current);
    }
  });

  return <div ref={imageRef} className={className} />;
}
