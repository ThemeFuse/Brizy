import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import ContainerBorder from "visual/component/ContainerBorder";
import Animation from "visual/component/Animation";
import { Draggable } from "visual/editorComponents/tools/Draggable";
import { getWrapperContainerW } from "visual/utils/meta";
import * as Str from "visual/utils/string/specs";
import Items from "./items";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import {
  defaultValueKey,
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import * as State from "visual/utils/stateMode";
import * as Position from "visual/utils/position/element";
import { styleContainer, styleItem, style, styleAnimation } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { attachRef } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";

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
    const device = deviceModeSelector(getStore().getState());

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
      inCloneable: true
    });
  }

  renderContent(v, vs, vd) {
    const { className, itemClassName } = v;

    const classNameContainer = classnames(
      "brz-d-xs-flex brz-flex-xs-wrap",
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      ),
      className
    );

    const classNameItem = classnames(
      "brz-wrapper-clone__item",
      css(
        `${this.constructor.componentId}-item`,
        `${this.getId()}-item`,
        styleItem(v, vs, vd)
      ),
      itemClassName
    );

    const { minItems, maxItems, blockType } = v;
    const itemsProps = this.makeSubcomponentProps({
      blockType,
      minItems,
      maxItems,
      bindWithKey: "items",
      containerClassName: classNameContainer,
      itemClassName: classNameItem,
      meta: this.getMeta(v),
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig
      ),
      onSortableStart: this.handleSortableStart,
      onSortableEnd: this.handleSortableEnd
    });

    return <Items {...itemsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const { showBorder, propsClassName } = this.props;
    const { customClassName, cssClassPopulation, customAttributes } = v;
    const customID = Str.mRead(v.customID) || undefined;
    const cssIDPopulation = Str.mRead(v.cssIDPopulation) || undefined;

    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    const className = classnames(
      "brz-wrapper-clone",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      propsClassName
    );

    const dvv = key => {
      const state = State.mRead(v.tabsState);
      const device = deviceModeSelector(getStore().getState());

      return defaultValueValue({ v, key, device, state });
    };
    const isRelative = Position.getPosition(dvv) === "relative";

    if (showBorder) {
      return (
        <Draggable
          active={!isRelative}
          onChange={this.handleDraggable}
          hAlign={Position.getHAlign(dvv) ?? "left"}
          vAlign={Position.getVAlign(dvv) ?? "top"}
          xSuffix={Position.getHUnit(dvv) ?? "px"}
          ySuffix={Position.getVUnit(dvv) ?? "px"}
          getValue={() => ({
            x: Position.getHOffset(dvv) ?? 0,
            y: Position.getVOffset(dvv) ?? 0
          })}
        >
          {(ref, draggableClassName) => {
            return (
              <ContainerBorder
                ref={this.containerBorder}
                type="wrapper__clone"
                color="grey"
                borderStyle="dotted"
              >
                {({
                  ref: containerBorderRef,
                  attr: containerBorderAttr,
                  border: ContainerBorderBorder
                }) => (
                  <Animation
                    ref={v => {
                      attachRef(v, containerBorderRef);
                      attachRef(v, ref || null);
                    }}
                    component={"div"}
                    componentProps={{
                      ...parseCustomAttributes(customAttributes),
                      ...containerBorderAttr,
                      id: cssIDPopulation === "" ? customID : cssIDPopulation,
                      className: classnames(className, draggableClassName)
                    }}
                    animationClass={animationClassName}
                  >
                    {this.renderContent(v, vs, vd)}
                    {ContainerBorderBorder}
                  </Animation>
                )}
              </ContainerBorder>
            );
          }}
        </Draggable>
      );
    }

    return (
      <Draggable
        active={!isRelative}
        onChange={this.handleDraggable}
        hAlign={Position.getHAlign(dvv) ?? "left"}
        vAlign={Position.getVAlign(dvv) ?? "top"}
        xSuffix={Position.getHUnit(dvv) ?? "px"}
        ySuffix={Position.getVUnit(dvv) ?? "px"}
        getValue={() => ({
          x: Position.getHOffset(dvv) ?? 0,
          y: Position.getVOffset(dvv) ?? 0
        })}
      >
        {(ref, draggableClassName) => {
          return (
            <Animation
              ref={ref}
              component={"div"}
              componentProps={{
                ...parseCustomAttributes(customAttributes),
                id: cssIDPopulation ?? customID,
                className: classnames(className, draggableClassName)
              }}
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
    const { customClassName, cssClassPopulation, customAttributes } = v;
    const customID = Str.mRead(v.customID) || undefined;
    const cssIDPopulation = Str.mRead(v.cssIDPopulation) || undefined;
    const {
      propsClassName,
      meta: { sectionPopup, sectionPopup2 }
    } = this.props;

    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    const className = classnames(
      "brz-wrapper-clone",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      propsClassName
    );

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: cssIDPopulation ?? customID,
      className
    };

    return (
      <Animation
        iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
        component={"div"}
        componentProps={props}
        animationClass={animationClassName}
      >
        {this.renderContent(v, vs, vd)}
      </Animation>
    );
  }
}
