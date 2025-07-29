import { LottieView } from "@brizy/component/src/Flex/Lottie/LottieView";
import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import classnames from "classnames";
import React from "react";
import Link from "visual/component/Link";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { blocksDataSelector } from "visual/redux/selectors";
import { customFileUrl } from "visual/utils/customFile";
import { getLinkData } from "visual/utils/models/link";
import { Wrapper } from "../tools/Wrapper";
import { BaseLottie } from "./Base";
import { style } from "./styles";
import { Value } from "./type";
import { getRendererType, isLottieFile } from "./utils";

class Lottie extends BaseLottie {
  renderForView(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const {
      speed,
      loop,
      autoplay,
      direction,
      renderer,
      animationLink,
      animationFile,
      trigger,
      lazyload
    } = v;

    const className = classnames(
      "brz-lottie",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const config = this.getGlobalConfig();
    const _animationData = animationFile
      ? customFileUrl(animationFile, config)
      : animationLink;

    const linkData = getLinkData(v, config);
    const { href, type, target, rel, slide } = linkData;

    const isLoop = loop === "on";
    const isLazyload = lazyload === "on";
    const isAutoplay = trigger === TriggerType.OnLoad && autoplay === "on";
    const animationData = _animationData ?? "";
    const rendererType = getRendererType(renderer) ?? RendererType.SVG;

    const lottieViewProps = {
      animationData,
      speed,
      isLoop,
      isAutoplay,
      direction,
      renderer: rendererType,
      trigger,
      lazyload: isLazyload,
      isLottieFile: isLottieFile(animationData)
    };

    return (
      <>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {href ? (
            <Link
              href={href}
              type={type}
              target={target}
              rel={rel}
              slide={slide}
            >
              <LottieView {...lottieViewProps} />
            </Link>
          ) : (
            <LottieView {...lottieViewProps} />
          )}
        </Wrapper>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </>
    );
  }
}

export default Lottie;
