import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import SortableElement from "visual/component-new/Sortable/SortableElement";
import SortableHandle from "visual/component-new/Sortable/SortableHandle";
import ContainerBorder from "visual/component-new/ContainerBorder";
import FloatingButton from "visual/component-new/FloatingButton";
import Animation from "visual/component-new/Animation";
import { Roles, currentUserRole } from "visual/component-new/Roles";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./extendToolbar";
import ContextMenu from "visual/component-new/ContextMenu";
import contextMenuConfig from "./contextMenu";
import { percentageToPixels } from "visual/utils/meta";
import {
  styleClassName,
  containerStyleClassName,
  containerStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

class Wrapper extends EditorComponent {
  static get componentId() {
    return "Wrapper";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleContainerBorderRef = el => {
    this.containerBorder = el;
  };

  handleFloatingButtonRef = el => {
    this.floatingButton = el;
  };

  handleExtendParentToolbar = childToolbarExtend => {
    this.childToolbarExtend = childToolbarExtend;
  };

  handleToolbarOpen = () => {
    this.containerBorder.setActive(true);
    this.floatingButton.setActive(true);
  };

  handleToolbarClose = () => {
    this.containerBorder.setActive(false);
    this.floatingButton.setActive(false);
  };

  handleToolbarEnter = () => {
    this.containerBorder.setParentsHover(true);
  };

  handleToolbarLeave = () => {
    this.containerBorder.setParentsHover(false);
  };

  getMeta(v) {
    const { meta } = this.props;
    const {
      // Margin
      marginType,
      margin,
      marginSuffix,
      marginLeft,
      marginLeftSuffix,
      marginRight,
      marginRightSuffix,

      // Padding
      paddingType,
      padding,
      paddingSuffix,
      paddingLeft,
      paddingLeftSuffix,
      paddingRight,
      paddingRightSuffix,

      // Align
      horizontalAlign,

      // Mobile Padding
      mobilePadding,
      mobilePaddingType,
      mobilePaddingSuffix,
      mobilePaddingLeft,
      mobilePaddingLeftSuffix,
      mobilePaddingRight,
      mobilePaddingRightSuffix,

      // Mobile margin
      mobileMargin,
      mobileMarginType,
      mobileMarginSuffix,
      mobileMarginLeft,
      mobileMarginLeftSuffix,
      mobileMarginRight,
      mobileMarginRightSuffix,

      // Mobile align
      mobileHorizontalAlign
    } = v;

    const marginW =
      marginType === "grouped"
        ? percentageToPixels(margin * 2, marginSuffix, meta.desktopW)
        : percentageToPixels(marginLeft, marginLeftSuffix, meta.desktopW) +
          percentageToPixels(marginRight, marginRightSuffix, meta.desktopW);
    const paddingW =
      paddingType === "grouped"
        ? percentageToPixels(padding * 2, paddingSuffix, meta.desktopW)
        : percentageToPixels(paddingLeft, paddingLeftSuffix, meta.desktopW) +
          percentageToPixels(paddingRight, paddingRightSuffix, meta.desktopW);

    const mobilePaddingW =
      mobilePaddingType === "grouped"
        ? percentageToPixels(
            mobilePadding * 2,
            mobilePaddingSuffix,
            meta.mobileW
          )
        : percentageToPixels(
            mobilePaddingLeft,
            mobilePaddingLeftSuffix,
            meta.mobileW
          ) +
          percentageToPixels(
            mobilePaddingRight,
            mobilePaddingRightSuffix,
            meta.mobileW
          );
    const mobileMarginW =
      mobileMarginType === "grouped"
        ? percentageToPixels(mobileMargin * 2, mobileMarginSuffix, meta.mobileW)
        : percentageToPixels(
            mobileMarginLeft,
            mobileMarginLeftSuffix,
            meta.mobileW
          ) +
          percentageToPixels(
            mobileMarginRight,
            mobileMarginRightSuffix,
            meta.mobileW
          );

    const externalSpacing = marginW + paddingW;
    const externalMobileSpacing = mobileMarginW + mobilePaddingW;
    const mobileW =
      Math.round((meta.mobileW - externalMobileSpacing) * 10) / 10;
    const desktopW = Math.round((meta.desktopW - externalSpacing) * 10) / 10;

    return {
      ...meta,
      mobileW,
      desktopW,
      horizontalAlign,
      mobileHorizontalAlign
    };
  }

  renderToolbar(v) {
    if (v.showToolbar === "off") {
      return;
    }

    return (
      <div className="brz-ed-wrapper__toolbar">
        <Toolbar
          {...this.makeToolbarPropsFromConfig(toolbarConfig)}
          onOpen={this.handleToolbarOpen}
          onClose={this.handleToolbarClose}
          onMouseEnter={this.handleToolbarEnter}
          onMouseLeave={this.handleToolbarLeave}
        >
          <SortableHandle>
            <div
              onMouseEnter={this.handleButtonEnter}
              onMouseLeave={this.handleButtonLeave}
            >
              <FloatingButton
                reactToClick={false}
                ref={this.handleFloatingButtonRef}
              />
            </div>
          </SortableHandle>
        </Toolbar>
      </div>
    );
  }

  renderContent(v) {
    const { showToolbar } = v;
    const toolbarExtendFilter =
      showToolbar === "on" || currentUserRole() !== "admin"
        ? toolbarExtendItems =>
            toolbarExtendItems.filter(
              item => item.id !== "duplicate" && item.id !== "remove"
            )
        : null;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.getMeta(v),
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig, {
          allowExtend: true,
          extendFilter: toolbarExtendFilter
        }),
        onToolbarEnter: this.handleToolbarEnter,
        onToolbarLeave: this.handleToolbarLeave,
        extendParentToolbar: this.handleExtendParentToolbar
      }
    });

    const componentId =
      v.items[0].type === "Posts" || v.items[0].type === "Carousel"
        ? "Row"
        : v.items[0].type;
    return (
      <ContextMenu
        {...this.makeContextMenuProps(contextMenuConfig, { componentId })}
      >
        <div className={containerStyleClassName(v)}>
          <EditorArrayComponent {...itemsProps} />
        </div>
      </ContextMenu>
    );
  }

  renderForEdit(v) {
    const { animationName, animationDuration, animationDelay } = v;

    return (
      <SortableElement type="shortcode">
        <Animation
          className={styleClassName(v)}
          style={containerStyleCSSVars(v)}
          name={animationName !== "none" && animationName}
          duration={animationDuration}
          delay={animationDelay}
        >
          <ContainerBorder
            ref={this.handleContainerBorderRef}
            className="brz-ed-border__wrapper"
            borderStyle="dotted"
            activeBorderStyle="dotted"
            clickOutsideExceptions={[
              ".brz-ed-sidebar__right",
              "#brz-toolbar-portal",
              ".brz-ed-tooltip__content-portal"
            ]}
            path={this.props.path}
          >
            <Roles
              allow={["admin"]}
              fallbackRender={() => this.renderContent(v)}
            >
              {this.renderToolbar(v)}
              {this.renderContent(v)}
            </Roles>
          </ContainerBorder>
        </Animation>
      </SortableElement>
    );
  }

  renderForView(v) {
    const { animationName, animationDuration, animationDelay } = v;

    return (
      <Animation
        className={styleClassName(v)}
        name={animationName !== "none" && animationName}
        duration={animationDuration}
        delay={animationDelay}
      >
        {this.renderContent(v)}
      </Animation>
    );
  }
}

export default Wrapper;
