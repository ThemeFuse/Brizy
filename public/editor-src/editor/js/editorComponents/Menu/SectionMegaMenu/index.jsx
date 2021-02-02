import React from "react";
import classnames from "classnames";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import Toolbar, { ToolbarExtend } from "visual/component/Toolbar";
import { css } from "visual/utils/cssStyle";
import { getContainerW } from "visual/utils/meta";
import { DESKTOP, TABLET } from "visual/utils/responsiveMode";
import { Roles } from "visual/component/Roles";
import CustomCSS from "visual/component/CustomCSS";
import { CustomTag } from "visual/component/CustomTag";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import SectionMegaMenuItems from "./items";
import { styleSection, styleContainer } from "./styles";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

class SectionMegaMenu extends EditorComponent {
  static get componentId() {
    return "SectionMegaMenu";
  }

  static defaultProps = {
    meta: {},
    rerender: {}
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  mounted = false;

  toolbarRef = React.createRef();

  componentDidMount() {
    this.mounted = true;
  }

  shouldUpdateBecauseOfParent(nextProps) {
    return !_.isEqual(this.props.rerender, nextProps.rerender);
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
    this.toolbarRef.current.show();
  };

  getMeta(v) {
    const { meta } = this.props;
    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW({
      v,
      w: meta.desktopW,
      wNoSpacing: meta.desktopWNoSpacing,
      device: DESKTOP
    });
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW({
      v,
      w: meta.tabletW,
      wNoSpacing: meta.tabletWNoSpacing,
      device: TABLET
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW({
      v,
      w: meta.mobileW,
      wNoSpacing: meta.mobileWNoSpacing,
      device: TABLET
    });

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    };
  }

  renderToolbar = ContainerBorderButton => {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.toolbarRef}
      >
        <ContainerBorderButton className="brz-ed-border__button--row" />
      </Toolbar>
    );
  };

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const className = classnames(
      "brz-container",
      v.containerClassName,
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleContainer(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      className,
      meta,
      bindWithKey: "items"
    });

    return (
      <Background value={v} meta={meta}>
        <SectionMegaMenuItems {...itemsProps} />
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    const {
      className,
      customClassName,
      cssClassPopulation,
      customAttributes
    } = v;
    const classNameSection = classnames(
      "brz-mega-menu",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}-section`,
        `${this.getId()}-section`,
        styleSection(v, vs, vd)
      )
    );

    return (
      <ContainerBorder
        type="mega__menu"
        color="grey"
        activeBorderStyle="dotted"
        activateOnContentClick={false}
        buttonPosition="topLeft"
        renderButtonWrapper={this.renderToolbar}
      >
        {({
          ref: containerBorderRef,
          attr: containerBorderAttr,
          button: ContainerBorderButton,
          border: ContainerBorderBorder
        }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <div
              ref={containerBorderRef}
              id={this.getId()}
              className={classNameSection}
              data-block-id={this.props.blockId}
              {...parseCustomAttributes(customAttributes)}
              {...containerBorderAttr}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v, vs, vd)}
              >
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v, vs, vd)}
                </ToolbarExtend>
                {ContainerBorderButton}
                {ContainerBorderBorder}
              </Roles>
            </div>
          </CustomCSS>
        )}
      </ContainerBorder>
    );
  }

  renderForView(v, vs, vd) {
    const {
      className,
      tagName,
      customClassName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes,
      customCSS
    } = v;
    const classNameSection = classnames(
      "brz-mega-menu",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}-section`,
        `${this.getId()}-section`,
        styleSection(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <CustomTag
          tagName={tagName}
          id={cssIDPopulation === "" ? this.getId() : cssIDPopulation}
          className={classNameSection}
          data-uid={this.getId()}
          {...parseCustomAttributes(customAttributes)}
        >
          {this.renderItems(v, vs, vd)}
        </CustomTag>
      </CustomCSS>
    );
  }
}

export default SectionMegaMenu;
