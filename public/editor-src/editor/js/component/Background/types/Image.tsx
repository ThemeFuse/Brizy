import classnames from "classnames";
import jQuery from "jquery";
import { ReactElement, RefObject, useRef } from "react";
import { useStore } from "react-redux";
import { isWp } from "visual/global/Config";
import { useConfig } from "visual/providers/ConfigProvider";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { ReduxAction } from "visual/redux/actions2.js";
import { deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types.js";
import "../lib/jquery.parallax.js";
import { useLayoutEffect } from "../utils";

const destroyParallax = (node: HTMLElement): void => {
  if (node.parentElement) {
    jQuery(node.parentElement).brzParallax("destroy");
  }
};

const initParallax = (node: HTMLElement, wheelIgnoreClass?: string[]): void => {
  if (node.parentElement) {
    jQuery(node.parentElement).brzParallax({
      bgClass: "brz-bg-image", // WARNING: intentionally not `brz-bg-image-parallax`
      wheelIgnoreClass: [
        "brz-ed-container-plus",
        "brz-ed-container-whiteout-show",
        "brz-content-show",
        ...(wheelIgnoreClass ?? [])
      ]
    });
  }
};

type Props = {
  renderContext: RenderType;
  showParallax?: boolean;
  children: (d: {
    innerRef?: RefObject<HTMLElement>;
    attr: {
      className?: string;
    };
  }) => ReactElement;
};

const Image = ({
  showParallax,
  children,
  renderContext
}: Props): ReactElement => {
  const store = useStore<ReduxState, ReduxAction>();

  // Using the direct Store because when the builder changes the deviceMode,
  // all components can't be re-rendered
  const currentDeviceMode = deviceModeSelector(store.getState());
  showParallax = showParallax && currentDeviceMode === "desktop";
  const className = classnames("brz-bg-image", {
    "brz-bg-image-parallax": showParallax,
    "brz-bg-image-parallax--init": showParallax && isEditor(renderContext)
  });

  const config = useConfig();
  const isWP = isWp(config);

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
    const wheelIgnoreClass = isWP ? ["media-modal"] : undefined;
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if (imageRef.current && showParallax) {
        initParallax(imageRef.current, wheelIgnoreClass);
      }
    } else {
      if (imageRef.current) {
        showParallax
          ? initParallax(imageRef.current, wheelIgnoreClass)
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
