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
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { styleBg, styleContainer, styleContainerWrap } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import {
  styleElementSectionContainerType,
  styleSizeContainerSize
} from "visual/utils/style2";
import { getContainerW } from "visual/utils/meta";

class SectionHeaderItem extends EditorComponent {
  static get componentId() {
    return "SectionHeaderItem";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  mounted = false;

  collapsibleToolbarRef = React.createRef();

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

  handleToolbarEscape = () => {
    this.collapsibleToolbarRef.current.open();
  };

  handlePaddingResizerChange = patch => this.patchValue(patch);

  getMeta(v) {
    const { meta } = this.props;
    const containerType = styleElementSectionContainerType({ v });
    const size = styleSizeContainerSize({ v, device: "desktop" });
    const tabletSize = styleSizeContainerSize({ v, device: "tablet" });
    const mobileSize = styleSizeContainerSize({ v, device: "mobile" });
    const desktopW = getContainerW({
      v,
      w: containerType === "fullWidth" ? wInFullPage : wInBoxedPage,
      width: size,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: wInTabletPage,
      width: tabletSize,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: wInMobilePage,
      width: mobileSize,
      device: "mobile"
    });

    return {
      ...meta,
      desktopW,
      tabletW,
      mobileW
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
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
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
              <ToolbarExtend onEscape={this.handleToolbarEscape}>
                {this.renderItems(v, vs, vd)}
              </ToolbarExtend>
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
