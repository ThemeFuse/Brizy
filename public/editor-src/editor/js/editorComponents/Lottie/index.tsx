import { DotLottieEditor } from "@brizy/component/src/Flex/Lottie/DotLottieEditor";
import { LottieEditor } from "@brizy/component/src/Flex/Lottie/LottieEditor";
import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { blocksDataSelector } from "visual/redux/selectors";
import { customFileUrl } from "visual/utils/customFile";
import { t } from "visual/utils/i18n";
import { handleLinkChange } from "visual/utils/patch/Link";
import { Wrapper } from "../tools/Wrapper";
import { BaseLottie } from "./Base";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Meta, State, Value } from "./type";
import {
  getBoxResizerParams,
  getDirection,
  getRendererType,
  isLottieFile
} from "./utils";

class Lottie extends BaseLottie {
  componentDidMount(): void {
    const { animationFile, animationLink } = this.getValue();
    const config = this.getGlobalConfig();
    const initialLink = animationFile
      ? customFileUrl(animationFile, config)
      : animationLink;

    if (initialLink) {
      this.getAnimation(initialLink);
    }
  }

  componentDidUpdate(
    _: Readonly<Record<string, unknown>>,
    prevState: Readonly<State>
  ): void {
    const { animationFile, animationLink } = this.getValue();
    const config = this.getGlobalConfig();

    const currentLink = animationFile
      ? customFileUrl(animationFile, config)
      : animationLink;

    if (currentLink && currentLink !== prevState.previousLink) {
      this.getAnimation(currentLink);
    }
  }

  fetchAnimation = (link: string): void => {
    fetch(link)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            animation: result,
            previousLink: link
          });
        },
        () => {
          ToastNotification.error(t("Your link is not correct"));
        }
      );
  };

  getAnimation = (
    link = "https://assets6.lottiefiles.com/private_files/lf30_1KyL2Q.json"
  ): void => {
    if (isLottieFile(link)) {
      this.setState({
        animation: link,
        previousLink: link
      });
    } else {
      this.fetchAnimation(link);
    }
  };

  patchValue(patch: Patch, meta = {}): void {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

  handleValueChange(newValue: Value, meta: Meta): void {
    super.handleValueChange(newValue, meta);
    const { animationFile, animationLink } = meta.patch || {};

    if (animationFile === undefined && animationLink === undefined) {
      return;
    }
    const config = this.getGlobalConfig();
    const animationPatch =
      customFileUrl(animationFile, config) || animationLink;

    if (animationPatch) {
      this.getAnimation(animationPatch);
    } else {
      const { animationFile, animationLink } = this.getValue();
      const animationValue =
        animationLink || customFileUrl(animationFile, config);

      if (animationValue) {
        this.getAnimation(animationValue);
      }
    }
  }

  handleResizerChange = (patch: Patch): void => this.patchValue(patch);

  renderForEdit(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const { speed, loop, autoplay, direction, renderer, trigger, lazyload } = v;
    const { animation } = this.state;

    const { points, restrictions } = getBoxResizerParams();

    const isLoop = loop === "on";
    const isLazyload = lazyload === "on";
    const isAutoplay = trigger === TriggerType.OnLoad && autoplay === "on";
    const animationData = animation ?? "";
    const rendererType = getRendererType(renderer) ?? RendererType.SVG;
    const _direction = getDirection(direction) ?? 1;

    const lottieReactConfig = {
      isLoop,
      isAutoplay,
      animationData,
      speed,
      direction: _direction,
      renderer: rendererType,
      trigger,
      lazyload: isLazyload
    };

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

    const LottieComponent = isLottieFile(animationData)
      ? DotLottieEditor
      : LottieEditor;

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          {({ ref }) => (
            <Wrapper {...this.makeWrapperProps({ className, ref })}>
              <BoxResizer
                points={points}
                meta={this.props.meta}
                value={v}
                onChange={this.handleResizerChange}
                restrictions={restrictions}
              >
                <LottieComponent
                  {...lottieReactConfig}
                  key={`renderer-${renderer}`}
                />
              </BoxResizer>
            </Wrapper>
          )}
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </>
    );
  }
}

export default Lottie;
