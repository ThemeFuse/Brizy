import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Toolbar from "visual/component/Toolbar";
import { blocksDataSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import LottieControl from "./Lottie";
import { ToastNotification } from "visual/component/Notifications";
import { t } from "visual/utils/i18n";
import { Wrapper } from "../tools/Wrapper";
import BoxResizer from "visual/component/BoxResizer";
import Link from "visual/component/Link";
import { customFileUrl } from "visual/utils/customFile";
import { pipe } from "visual/utils/fp";
import { isNullish } from "visual/utils/value";
import * as Num from "visual/utils/reader/number";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { getStore } from "visual/redux/store";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

const isNan = pipe(Num.read, isNullish);

class Lottie extends EditorComponent {
  static get componentId() {
    return "Lottie";
  }

  state = {
    animation: null
  };

  getAnimation = (
    link = "https://assets6.lottiefiles.com/private_files/lf30_1KyL2Q.json"
  ) => {
    fetch(link)
      .then(res => res.json())
      .then(
        result => {
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

  handleResizerChange = patch => this.patchValue(patch);

  static defaultValue = defaultValue;

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
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
      direction,
      loop: loop === "on",
      autoplay: autoplay === "on",
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
              <LottieControl
                {...lottieReactConfig}
                key={`lottie-${loop} renderer-${renderer}`}
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
      animationFile,
      linkType,
      linkAnchor,
      linkToSlide,
      linkExternalBlank,
      linkExternalRel,
      linkExternalType,
      linkPopup,
      linkUpload
    } = v;

    const hrefs = {
      anchor: linkAnchor,
      story: !isNan(linkToSlide) ? `slide-${linkToSlide}` : "",
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    const className = classnames(
      "brz-lottie",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const classNameLottie = classnames("brz-lottie-anim", {
      "brz-lottie__canvas": renderer === "canvas"
    });

    const _animationLink = animationFile
      ? customFileUrl(animationFile)
      : animationLink;

    const animDom = (
      <div
        className={classNameLottie}
        data-animate-name={_animationLink}
        data-anim-speed={speed}
        data-anim-loop={loop}
        data-anim-autoplay={autoplay}
        data-anim-direction={direction}
        data-render-type={renderer}
      />
    );
    const slideAnchor =
      linkType !== "story" || !isNan(linkToSlide)
        ? {}
        : { "data-brz-link-story": linkToSlide };

    return (
      <>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {hrefs[linkType] ? (
            <Link
              href={hrefs[linkType]}
              type={linkType}
              target={linkExternalBlank}
              rel={linkExternalRel}
              slide={slideAnchor}
            >
              {animDom}
            </Link>
          ) : (
            animDom
          )}
        </Wrapper>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </>
    );
  }
}

export default Lottie;
