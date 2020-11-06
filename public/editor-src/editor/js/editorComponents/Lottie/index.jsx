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
    const v = this.getValue();
    this.getAnimation(v.animationLink);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(newValue, meta);

    if (meta.patch.animationLink) {
      this.getAnimation(meta.patch.animationLink);
    }
  }

  handleResizerChange = patch => this.patchValue(patch);

  static defaultValue = defaultValue;

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          itemData = blocksDataSelector(getStore().getState())[
            itemData.value._id
          ];
          isGlobal = true;
        }

        const {
          blockId,
          value: { popupId }
        } = itemData;

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : isGlobal
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const { speed, loop, autoplay, direction, linkType, linkPopup, popups } = v;

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
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
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
      animationLink,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkExternalType,
      linkPopup,
      linkUpload,
      popups
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

    return (
      <>
        <Wrapper {...this.makeWrapperProps({ className })}>
          <div
            className="brz-lottie-anim"
            data-animate-name={animationLink}
            data-anim-speed={speed}
            data-anim-loop={loop}
            data-anim-autoplay={autoplay}
            data-anim-direction={direction}
          />
          {hrefs[linkType] !== "" && (
            <Link
              type={linkType}
              href={hrefs[linkType]}
              target={linkExternalBlank}
              rel={linkExternalRel}
              className="brz-link-container"
            />
          )}
        </Wrapper>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </>
    );
  }
}

export default Lottie;
