import React from "react";
import classnames from "classnames";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Items from "./items";
import Background from "visual/component/Background";
import PaddingResizer from "visual/component/PaddingResizer";
import ContainerBorder from "visual/component/ContainerBorder";
import { Roles } from "visual/component/Roles";
import { ConditionsComponent } from "visual/component/ConditionsComponent";
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style, styleContainer } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import {
  styleElementSectionContainerType,
  styleSizeContainerSize
} from "visual/utils/style2";
import { getContainerW } from "visual/utils/meta";

class SectionItem extends EditorComponent {
  static get componentId() {
    return "SectionItem";
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

  shouldUpdateBecauseOfParent(nextProps) {
    return (
      this.props.meta.section.isSlider ||
      !_.isEqual(this.props.rerender, nextProps.rerender)
    );
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.optionalSCU(nextProps) || this.shouldUpdateBecauseOfParent(nextProps)
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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
    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW({
      v,
      w: containerType === "fullWidth" ? meta.desktopFullW : meta.desktopBoxedW,
      wNoSpacing:
        containerType === "fullWidth"
          ? meta.desktopFullWNoSpacing
          : meta.desktopBoxedWNoSpacing,
      width: size,
      device: "desktop"
    });
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW({
      v,
      w: meta.tabletW,
      wNoSpacing: meta.tabletWNoSpacing,
      width: tabletSize,
      device: "tablet"
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW({
      v,
      w: meta.mobileW,
      wNoSpacing: meta.mobileWNoSpacing,
      width: mobileSize,
      device: "mobile"
    });

    return {
      ...meta,
      mobileW,
      mobileWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      desktopW,
      desktopWNoSpacing
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        badge={
          globalBlockId
            ? child => (
                <ConditionsComponent value={globalBlockId}>
                  {child}
                </ConditionsComponent>
              )
            : null
        }
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName,
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: classNameContainer,
      meta
    });

    return (
      <Background value={v} meta={meta}>
        <PaddingResizer value={v} onChange={this.handlePaddingResizerChange}>
          <Items {...itemsProps} />
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    const { className, containerType, customCSS } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      `brz-section--${containerType}`,
      className,
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, this.props)
      )
    );

    return (
      <ContainerBorder type="section__item" activateOnContentClick={false}>
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <div
              {...containerBorderAttr}
              ref={containerBorderRef}
              className={classNameSectionContent}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v, vs, vd)}
              >
                {this.renderToolbar()}
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v, vs, vd)}
                </ToolbarExtend>
              </Roles>
            </div>
          </CustomCSS>
        )}
      </ContainerBorder>
    );
  }

  renderForView(v, vs, vd) {
    const { className, containerType, customCSS } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      `brz-section--${containerType}`,
      className,
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, this.props)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={classNameSectionContent}>
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }
}

export default SectionItem;
