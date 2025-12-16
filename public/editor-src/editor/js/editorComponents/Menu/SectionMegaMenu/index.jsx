import classnames from "classnames";
import { isEqual } from "es-toolkit";
import { mPipe, pass } from "fp-utilities";
import React from "react";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import { CustomTag } from "visual/component/CustomTag";
import { Roles } from "visual/component/Roles";
import Toolbar, { ToolbarExtend } from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getContainerW } from "visual/utils/meta";
import { getCSSId } from "visual/utils/models/cssId";
import { attachRefs } from "visual/utils/react";
import { DESKTOP, TABLET } from "visual/utils/responsiveMode";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import { currentUserRole } from "../../../component/Roles";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import SectionMegaMenuItems from "./items";
import * as sidebarConfig from "./sidebar";
import { styleContainer, styleSection } from "./styles";
import * as toolbarConfig from "./toolbar";

const getModelId = mPipe(getCSSId, pass(NoEmptyString.is));

class SectionMegaMenu extends EditorComponent {
  static defaultProps = {
    meta: {},
    rerender: {}
  };
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  mounted = false;
  toolbarRef = React.createRef();

  static get componentId() {
    return ElementTypes.SectionMegaMenu;
  }

  componentDidMount() {
    this.mounted = true;
  }

  shouldUpdateBecauseOfParent(nextProps) {
    return !isEqual(this.props.rerender, nextProps.rerender);
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
      megaMenu: true,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    };
  }

  renderToolbar = (ContainerBorderButton) => {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.toolbarRef}
      >
        {({ ref }) => (
          <ContainerBorderButton
            className="brz-ed-border__button--row"
            containerRef={ref}
          />
        )}
      </Toolbar>
    );
  };

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const className = classnames(
      "brz-container",
      v.containerClassName,
      this.css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        styleContainer({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
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
    const { className, customClassName, cssClass, customAttributes } = v;
    const classNameSection = classnames(
      "brz-mega-menu",
      className,
      cssClass || customClassName,
      this.css(
        `${this.getComponentId()}-section`,
        `${this.getId()}-section`,
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
        {({ ref: contextMenuRef }) => (
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
                {({ ref: cssRef }) => (
                  <div
                    ref={(el) => {
                      attachRefs(el, [
                        containerBorderRef,
                        cssRef,
                        contextMenuRef
                      ]);
                    }}
                    id={this.getId()}
                    className={classNameSection}
                    data-block-id={this.props.blockId}
                    {...parseCustomAttributes(customAttributes)}
                    {...containerBorderAttr}
                  >
                    <Roles
                      currentRole={currentUserRole(this.getGlobalConfig())}
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
                )}
              </CustomCSS>
            )}
          </ContainerBorder>
        )}
      </ContextMenu>
    );
  }

  renderForView(v, vs, vd) {
    const {
      className,
      tagName,
      customClassName,
      cssClass,
      customAttributes,
      customCSS
    } = v;
    const classNameSection = classnames(
      "brz-mega-menu",
      className,
      cssClass || customClassName,
      this.css(
        `${this.getComponentId()}-section`,
        `${this.getId()}-section`,
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const id = getModelId(v) ?? this.getId();
    const htmlId = `${id}_${makePlaceholder({ content: "{{ random_id }}" })}`;

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <CustomTag
          id={htmlId}
          tagName={tagName}
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
