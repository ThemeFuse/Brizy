import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import PaddingResizer from "visual/component/PaddingResizer";
import { Roles } from "visual/component/Roles";
import SectionHeaderItemItems from "./items";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { CollapsibleToolbar } from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import * as toolbarConfig from "./toolbar";
import { styleBg, styleContainer, styleContainerWrap } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

class SectionHeaderItem extends EditorComponent {
  static get componentId() {
    return "SectionHeaderItem";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  shouldMetaUpdate(nextProps) {
    const {
      meta: {
        section: { showOnDesktop, showOnMobile, showOnTablet }
      }
    } = this.props;
    const {
      meta: {
        section: {
          showOnDesktop: newShowOnDesktop,
          showOnMobile: newShowOnMobile,
          showOnTablet: newShowOnTablet
        }
      }
    } = nextProps;
    const { deviceMode } = getStore().getState().ui;

    return (
      (deviceMode === "desktop" && showOnDesktop !== newShowOnDesktop) ||
      (deviceMode === "mobile" && showOnMobile !== newShowOnMobile) ||
      (deviceMode === "tablet" && showOnTablet !== newShowOnTablet)
    );
  }

  shouldComponentUpdate(nextProps) {
    return this.shouldMetaUpdate(nextProps) || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabOverlay"
    });
  };

  handlePaddingResizerChange = patch => this.patchValue(patch);

  getMeta(v) {
    const { meta } = this.props;
    const {
      containerSize,
      containerType,
      borderWidthType,
      borderWidth,
      borderLeftWidth,
      borderRightWidth
    } = v;

    const borderWidthW =
      borderWidthType === "grouped"
        ? Number(borderWidth) * 2
        : Number(borderLeftWidth) + Number(borderRightWidth);

    const desktopW =
      containerType === "fullWidth"
        ? wInFullPage - borderWidthW
        : Math.round(
            (wInBoxedPage - borderWidthW) * (containerSize / 100) * 10
          ) / 10;

    const tabletW = wInTabletPage - borderWidthW;
    const mobileW = wInMobilePage - borderWidthW;

    return {
      ...meta,
      mobileW,
      tabletW,
      desktopW
    };
  }

  getSectionClassName(v) {
    const { className } = v;

    return classnames("brz-section__menu-item", className);
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig)}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        badge={Boolean(globalBlockId)}
        onClose={this.handleToolbarClose}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameBg = classnames(
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleBg(v, vs, vd)
      )
    );
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName,
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      )
    );
    const classNameContainerWrap = classnames(
      "brz-container__wrap",
      css(
        `${this.constructor.componentId}-containerWrap`,
        `${this.getId()}-containerWrap`,
        styleContainerWrap(v, vs, vd)
      )
    );

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: classNameContainer,
      meta
    });

    return (
      <Background className={classNameBg} value={v} meta={meta}>
        <PaddingResizer value={v} onChange={this.handlePaddingResizerChange}>
          <div className={classNameContainerWrap}>
            <SectionHeaderItemItems {...itemsProps} />
          </div>
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={this.getSectionClassName(v)}>
          <Roles
            allow={["admin"]}
            fallbackRender={() => this.renderItems(v, vs, vd)}
          >
            <ContainerBorder showBorder={false} activateOnContentClick={false}>
              {this.renderToolbar()}
              {this.renderItems(v, vs, vd)}
            </ContainerBorder>
          </Roles>
        </div>
      </CustomCSS>
    );
  }

  renderForView(v, vs, vd) {
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={this.getSectionClassName(v)}>
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }
}

export default SectionHeaderItem;
