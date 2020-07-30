import React from "react";
import classnames from "classnames";
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
import { styleSection, styleBg, styleContainerWrap } from "./styles";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

class SectionMegaMenu extends EditorComponent {
  static get componentId() {
    return "SectionMegaMenu";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  mounted = false;

  containerBorderRef = React.createRef();

  toolbarRef = React.createRef();

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarEscape = () => {
    this.toolbarRef.current.show();
  };

  getMeta(v) {
    const { meta } = this.props;
    const desktopW = getContainerW({
      v,
      w: meta.desktopW,
      device: DESKTOP
    });
    const tabletW = getContainerW({
      v,
      w: meta.tabletW,
      device: TABLET
    });
    const mobileW = getContainerW({
      v,
      w: meta.mobileW,
      device: TABLET
    });

    return {
      ...meta,
      desktopW,
      tabletW,
      mobileW
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
    const classNameBg = classnames(
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleBg(v, vs, vd)
      )
    );
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName
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
        <div className={classNameContainerWrap}>
          <SectionMegaMenuItems {...itemsProps} />
        </div>
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
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div
          id={this.getId()}
          className={classNameSection}
          data-block-id={this.props.blockId}
          {...parseCustomAttributes(customAttributes)}
        >
          <Roles
            allow={["admin"]}
            fallbackRender={() => this.renderItems(v, vs, vd)}
          >
            <ContainerBorder
              ref={this.containerBorderRef}
              color="grey"
              activeBorderStyle="dotted"
              activateOnContentClick={false}
              showButton={true}
              buttonPosition="topLeft"
              renderButtonWrapper={this.renderToolbar}
            >
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
