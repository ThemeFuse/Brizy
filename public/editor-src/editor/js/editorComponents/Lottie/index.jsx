import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
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

const resizerPoints = ["centerLeft", "centerRight"];

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

  renderPopups(v) {
    const { popups, linkType, linkPopup } = v;

    if (popups.length > 0 && linkType !== "popup" && linkPopup !== "") {
      return null;
    }

    const normalizePopups = popups.reduce((acc, popup) => {
      let itemData = popup;

      if (itemData.type === "GlobalBlock") {
        // TODO: some kind of error handling
        itemData = blocksDataSelector(getStore().getState())[
          itemData.value._id
        ];
      }

      return itemData ? [...acc, itemData] : acc;
    }, []);

    if (normalizePopups.length === 0) {
      return null;
    }

    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const blockData = blocksDataSelector(getStore().getState())[
            itemData.value._id
          ];

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
    const { speed, loop, autoplay, direction } = v;

    const { animation } = this.state;

    const lottieReactConfig = {
      animationData: animation,
      speed,
      direction,
      loop: loop === "on",
      autoplay: autoplay === "on"
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
              <LottieControl {...lottieReactConfig} key={`lottie-${loop}`} />
            </BoxResizer>
          </Wrapper>
        </Toolbar>
        {this.renderPopups(v)}
      </>
    );
  }

  renderForView(v, vs, vd) {
    const {
      speed,
      loop,
      autoplay,
      direction,
      animationLink,
      animationFile,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkExternalType,
      linkPopup,
      linkUpload
    } = v;

    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    const className = classnames(
      "brz-lottie",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const _animationLink = animationFile
      ? customFileUrl(animationFile)
      : animationLink;

    const animDom = (
      <div
        className="brz-lottie-anim"
        data-animate-name={_animationLink}
        data-anim-speed={speed}
        data-anim-loop={loop}
        data-anim-autoplay={autoplay}
        data-anim-direction={direction}
      />
    );

    return (
      <>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {hrefs[linkType] ? (
            <Link
              href={hrefs[linkType]}
              type={linkType}
              target={linkExternalBlank}
              rel={linkExternalRel}
            >
              {animDom}
            </Link>
          ) : (
            animDom
          )}
        </Wrapper>
        {this.renderPopups(v)}
      </>
    );
  }
}

export default Lottie;
