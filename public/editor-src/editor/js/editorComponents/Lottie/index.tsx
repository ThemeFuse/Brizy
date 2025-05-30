import { DotLottieEditor, LottieEditor, LottieView } from "@brizy/component";
import {
  RendererType,
  TriggerType
} from "@brizy/component/src/Flex/Lottie/types";
import classnames from "classnames";
import React from "react";
import { omit } from "timm";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import Link from "visual/component/Link";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import { Block } from "visual/types/Block";
import { customFileUrl } from "visual/utils/customFile";
import { t } from "visual/utils/i18n";
import { getLinkData } from "visual/utils/models/link";
import { handleLinkChange } from "visual/utils/patch/Link";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
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

class Lottie extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  state = {
    animation: null,
    previousLink: null
  };

  static get componentId(): ElementTypes.Lottie {
    return ElementTypes.Lottie;
  }

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

  renderPopups(): React.JSX.Element {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(this.getReduxState());
          const globalBlockId = itemData.value._id;
          const blockData = globalBlocks[globalBlockId];

          if (blockData) {
            popupId = blockData.value.popupId;
          }

          newMeta = {
            ...newMeta,
            globalBlockId
          };
        }

        return {
          blockId,
          meta: newMeta,
          ...(isEditor(this.props.renderContext) && {
            instanceKey: `${this.getId()}_${popupId}`
          })
        };
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }

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
