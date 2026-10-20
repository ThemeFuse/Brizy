import classnames from "classnames";
import { type ReactElement, type RefObject, useRef } from "react";
import { useStore } from "react-redux";
import { isWp } from "visual/global/Config";
import { useConfig } from "visual/providers/ConfigProvider";
import { isEditor, type RenderType } from "visual/providers/RenderProvider";
import type { ReduxAction } from "visual/redux/actions2.js";
import { deviceModeSelector } from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types.js";
import { destroyParallax, initParallax } from "../lib/parallax";
import { useLayoutEffect } from "../utils";

const destroy = (node: HTMLElement): void => {
  if (node.parentElement) {
    destroyParallax(node.parentElement);
  }
};

const init = (
  node: HTMLElement,
  wheelIgnoreClass: string[] | undefined
): void => {
  if (node.parentElement) {
    initParallax(node.parentElement, {
      // WARNING: intentionally not `brz-bg-image-parallax`. React drops that class from the DOM
      // before this effect runs, so the editor has to look for the one that is always there.
      bgClass: "brz-bg-image",
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
        destroy(imageRef.current);
      }
    },
    []
  );

  useLayoutEffect(() => {
    const wheelIgnoreClass = isWP ? ["media-modal"] : undefined;
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if (imageRef.current && showParallax) {
        init(imageRef.current, wheelIgnoreClass);
      }
    } else {
      if (imageRef.current) {
        if (showParallax) {
          init(imageRef.current, wheelIgnoreClass);
        } else {
          destroy(imageRef.current);
        }
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
