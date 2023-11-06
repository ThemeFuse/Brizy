import { LottieEditor, LottieView } from "@brizy/component";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import Link from "visual/component/Link";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { blocksDataSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { customFileUrl } from "visual/utils/customFile";
import { t } from "visual/utils/i18n";
import { handleLinkChange } from "visual/utils/patch/Link";
import { getLinkData } from "visual/utils/models/link";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

class Lottie extends EditorComponent {
  static get componentId() {
    return "Lottie";
  }
  static defaultValue = defaultValue;

  state = {
    animation: null
  };

  getAnimation = (
    link = "https://assets6.lottiefiles.com/private_files/lf30_1KyL2Q.json"
  ) => {
    fetch(link)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            animation: result
          });
        },
        () => {
          ToastNotification.error(t("Your link is not correct"));
        }
      );
  };

  componentDidMount() {
    const { animationFile, animationLink } = this.getValue();
    this.getAnimation(
      animationFile ? customFileUrl(animationFile) : animationLink
    );
  }

  patchValue(patch, meta = {}) {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(newValue, meta);
    const { animationFile, animationLink } = meta.patch || {};

    if (animationFile === undefined && animationLink === undefined) {
      return;
    }

    const animationPatch = customFileUrl(animationFile) || animationLink;

    if (animationPatch) {
      this.getAnimation(animationPatch);
    } else {
      const { animationFile, animationLink } = this.getValue();
      const animationValue = animationLink || customFileUrl(animationFile);
      this.getAnimation(animationValue);
    }
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData) => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const blockData = globalBlocks[itemData.value._id];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : itemData.type === "GlobalBlock"
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const { speed, loop, autoplay, direction, renderer } = v;

    const { animation } = this.state;

    const lottieReactConfig = {
      animationData: animation,
      speed,
      direction: Number(direction),
      isLoop: loop === "on",
      isAutoplay: autoplay === "on",
      renderer
    };

    const className = classnames(
      "brz-lottie",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const restrictions = {
      width: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      // Tablet
      tabletWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      // Mobile
      mobileWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      }
    };

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <Wrapper {...this.makeWrapperProps({ className })}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
              restrictions={restrictions}
            >
              <LottieEditor
                {...lottieReactConfig}
                key={`renderer-${renderer}`}
              />
            </BoxResizer>
          </Wrapper>
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </>
    );
  }

  renderForView(v, vs, vd) {
    const {
      speed,
      loop,
      autoplay,
      direction,
      renderer,
      animationLink,
      animationFile
    } = v;

    const linkData = getLinkData(v);

    const className = classnames(
      "brz-lottie",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const _animationData = animationFile
      ? customFileUrl(animationFile)
      : animationLink;

    return (
      <>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {linkData.href ? (
            <Link
              href={linkData.href}
              type={linkData.type}
              target={linkData.target}
              rel={linkData.rel}
              slide={linkData.slide}
            >
              <LottieView
                animationData={_animationData}
                speed={speed}
                isLoop={loop}
                isAutoplay={autoplay}
                direction={direction}
                renderer={renderer}
              />
            </Link>
          ) : (
            <LottieView
              animationData={_animationData}
              speed={speed}
              isLoop={loop}
              isAutoplay={autoplay}
              direction={direction}
              renderer={renderer}
            />
          )}
        </Wrapper>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </>
    );
  }
}

export default Lottie;
