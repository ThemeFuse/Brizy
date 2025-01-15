import classnames from "classnames";
import React from "react";
import _ from "underscore";
import Animation from "visual/component/Animation";
import ContainerBorder from "visual/component/ContainerBorder";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import { makeOptionValueToMotion } from "visual/component/ScrollMotions/utils";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Draggable } from "visual/editorComponents/tools/Draggable";
import { getContainerSizes } from "visual/editorComponents/tools/Draggable/utils";
import { getWrapperContainerW } from "visual/utils/meta";
import { getCSSId } from "visual/utils/models/cssId";
import {
  defaultValueKey,
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import * as Position from "visual/utils/position/element";
import { attachRef } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import Toolbar from "../../component/Toolbar";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarConfig from "./sidebar";
import { style, styleAnimation, styleContainer } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./toolbarExtend";

export default class Cloneable extends EditorComponent {
  static get componentId() {
    return "Cloneable";
  }

  static defaultProps = {
    className: "",
    customID: "",
    showBorder: true,
    meta: {}
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  containerBorder = React.createRef();

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleValueChange(value, meta) {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      super.handleValueChange(value, meta);
    }
  }

  handleDraggable = ({ x, y }) => {
    const v = this.getValue();
    const state = State.mRead(v.tabsState);
    const device = this.getDeviceMode();

    const dvk = (key, value) => ({
      [defaultValueKey({ key, device, state })]: value
    });

    this.patchValue(
      Position.setHOffset(dvk, x, Position.setVOffset(dvk, y, {}))
    );
  };

  handleSortableStart = () => {
    if (this.containerBorder.current) {
      this.containerBorder.current.setActive(true);
    }
  };

  handleSortableEnd = () => {
    if (this.containerBorder.current) {
      this.containerBorder.current.setActive(false);
    }
  };

  dvv = (key) => {
    const v = this.getValue();
    const device = this.getDeviceMode();
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getMeta(v) {
    const { horizontalAlign, tabletHorizontalAlign, mobileHorizontalAlign } = v;
    const { meta } = this.props;
    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getWrapperContainerW(
      {
        v,
        w: meta.desktopW,
        wNoSpacing: meta.desktopWNoSpacing,
        device: DESKTOP
      }
    );
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getWrapperContainerW({
      v,
      w: meta.tabletW,
      wNoSpacing: meta.tabletWNoSpacing,
      device: TABLET
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getWrapperContainerW({
      v,
      w: meta.mobileW,
      wNoSpacing: meta.mobileWNoSpacing,
      device: MOBILE
    });

    return _.extend({}, meta, {
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing,
      horizontalAlign,
      tabletHorizontalAlign,
      mobileHorizontalAlign,
      inCloneable: true,
      cloneableAnimationId: this.getId()
    });
  }

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = this.dvv("animationName");
    const animationDuration = this.dvv("animationDuration");
    const animationDelay = this.dvv("animationDelay");
    const animationInfiniteAnimation = this.dvv("animationInfiniteAnimation");

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

    return this.css(
      `${this.getComponentId()}-animation-${slug}`,
      `${this.getId()}-animation-${slug}`,
      styleAnimation({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        renderContext: this.renderContext
      })
    );
  };

  renderContent(v, vs, vd) {
    const { className, customCSS } = v;

    const classNameContainer = classnames(
      "brz-d-xs-flex brz-flex-xs-wrap",
      this.css(
        `${this.getComponentId()}-container`,
        `${this.getId()}-container`,
        styleContainer({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      ),
      className
    );

    const { minItems, maxItems, blockType } = v;
    const store = this.getReduxStore();
    const motion = makeOptionValueToMotion({ v, store });
    const itemsProps = this.makeSubcomponentProps({
      blockType,
      minItems,
      maxItems,
      motion,
      bindWithKey: "items",
      containerClassName: classNameContainer,
      itemClassName: "brz-wrapper-clone__item",
      meta: this.getMeta(v),
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        undefined,
        {
          allowSidebarExtendFromThirdParty: false
        }
      ),
      onSortableStart: this.handleSortableStart,
      onSortableEnd: this.handleSortableEnd
    });

    return (
      <CustomCSS selector={this.getId()} css={customCSS}>
        <Items {...itemsProps} />
      </CustomCSS>
    );
  }

  containerSize = () => {
    const v = this.getValue();
    const device = this.getDeviceMode();
    const meta = this.getMeta(v);
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    return getContainerSizes(v, device, meta, innerWidth, innerHeight);
  };

  renderForEdit(v, vs, vd) {
    const { showBorder, propsClassName } = this.props;
    const { customClassName, cssClass, customAttributes } = v;
    const id = getCSSId(v);

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    const className = classnames(
      "brz-wrapper-clone",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      ),
      cssClass || customClassName,
      propsClassName
    );

    const isRelative = Position.getPosition(this.dvv) === "relative";

    if (showBorder) {
      return (
        <SortableElement type="shortcode">
          {(extraAttr) => {
            return (
              <Draggable
                active={!isRelative}
                onChange={this.handleDraggable}
                hAlign={Position.getHAlign(this.dvv) ?? "left"}
                vAlign={Position.getVAlign(this.dvv) ?? "top"}
                xSuffix={Position.getHUnit(this.dvv) ?? "px"}
                ySuffix={Position.getVUnit(this.dvv) ?? "px"}
                getValue={() => ({
                  x: Position.getHOffset(this.dvv) ?? 0,
                  y: Position.getVOffset(this.dvv) ?? 0
                })}
                getContainerSizes={this.containerSize}
              >
                {(ref, draggableClassName) => {
                  return (
                    <ContextMenu
                      {...this.makeContextMenuProps(contextMenuConfig)}
                    >
                      <ContainerBorder
                        ref={this.containerBorder}
                        type="wrapper__clone"
                        color="grey"
                        borderStyle="dotted"
                        renderButtonWrapper={this.renderToolbar}
                      >
                        {({
                          ref: containerBorderRef,
                          attr: containerBorderAttr,
                          button: ContainerBorderButton,
                          border: ContainerBorderBorder
                        }) => (
                          <Animation
                            ref={(v) => {
                              attachRef(v, containerBorderRef);
                              attachRef(v, ref || null);
                            }}
                            component={"div"}
                            componentProps={{
                              ...parseCustomAttributes(customAttributes),
                              ...containerBorderAttr,
                              ...(id && { id }),
                              ...extraAttr,
                              className: classnames(
                                className,
                                draggableClassName
                              )
                            }}
                            animationId={this.getId()}
                            animationClass={animationClassName}
                          >
                            {this.renderContent(v, vs, vd)}
                            {ContainerBorderButton}
                            {ContainerBorderBorder}
                          </Animation>
                        )}
                      </ContainerBorder>
                    </ContextMenu>
                  );
                }}
              </Draggable>
            );
          }}
        </SortableElement>
      );
    }

    return (
      <Draggable
        active={!isRelative}
        onChange={this.handleDraggable}
        hAlign={Position.getHAlign(this.dvv) ?? "left"}
        vAlign={Position.getVAlign(this.dvv) ?? "top"}
        xSuffix={Position.getHUnit(this.dvv) ?? "px"}
        ySuffix={Position.getVUnit(this.dvv) ?? "px"}
        getValue={() => ({
          x: Position.getHOffset(this.dvv) ?? 0,
          y: Position.getVOffset(this.dvv) ?? 0
        })}
      >
        {(ref, draggableClassName) => {
          return (
            <Animation
              ref={ref}
              component={"div"}
              componentProps={{
                ...parseCustomAttributes(customAttributes),
                ...(id && { id }),
                className: classnames(className, draggableClassName)
              }}
              animationId={this.getId()}
              animationClass={animationClassName}
            >
              {showBorder ? (
                <ContainerBorder
                  ref={this.containerBorder}
                  color="grey"
                  borderStyle="dotted"
                >
                  {this.renderContent(v, vs, vd)}
                </ContainerBorder>
              ) : (
                this.renderContent(v, vs, vd)
              )}
            </Animation>
          );
        }}
      </Draggable>
    );
  }

  renderForView(v, vs, vd) {
    const { customClassName, cssClass, customAttributes } = v;
    const {
      propsClassName,
      meta: { sectionPopup, sectionPopup2 }
    } = this.props;
    const id = getCSSId(v);

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    const className = classnames(
      "brz-wrapper-clone",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      ),
      cssClass || customClassName,
      propsClassName
    );

    return (
      <Animation
        iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
        component={"div"}
        componentProps={{
          ...parseCustomAttributes(customAttributes),
          ...(id && { id }),
          className
        }}
        animationId={this.getId()}
        animationClass={animationClassName}
      >
        {this.renderContent(v, vs, vd)}
      </Animation>
    );
  }

  renderToolbar = (Button) => (
    <Toolbar
      {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
    >
      <SortableHandle renderContext={this.renderContext}>
        <Button />
      </SortableHandle>
    </Toolbar>
  );
}
