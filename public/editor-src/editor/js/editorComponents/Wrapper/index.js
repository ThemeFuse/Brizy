import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import SortableElement from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import ContainerBorder from "visual/component/ContainerBorder";
import Animation from "visual/component/Animation";
import { Roles, currentUserRole } from "visual/component/Roles";
import Toolbar, { ToolbarExtend } from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import { percentageToPixels } from "visual/utils/meta";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { styleContainer, styleWrapper } from "./styles";
import { css } from "visual/utils/cssStyle";

class Wrapper extends EditorComponent {
  static get componentId() {
    return "Wrapper";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  toolbarRef = React.createRef();

  handleExtendParentToolbar = childToolbarExtend => {
    this.childToolbarExtend = childToolbarExtend;
  };

  handleToolbarEscape = () => {
    this.toolbarRef.current.show();
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

      // Tablet Padding
      tabletPadding,
      tabletPaddingType,
      tabletPaddingSuffix,
      tabletPaddingLeft,
      tabletPaddingLeftSuffix,
      tabletPaddingRight,
      tabletPaddingRightSuffix,

      // Tablet margin
      tabletMargin,
      tabletMarginType,
      tabletMarginSuffix,
      tabletMarginLeft,
      tabletMarginLeftSuffix,
      tabletMarginRight,
      tabletMarginRightSuffix,

      // Tablet align
      tabletHorizontalAlign,

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

    // Tablet
    const tabletPaddingW =
      tabletPaddingType === "grouped"
        ? percentageToPixels(
            tabletPadding * 2,
            tabletPaddingSuffix,
            meta.tabletW
          )
        : percentageToPixels(
            tabletPaddingLeft,
            tabletPaddingLeftSuffix,
            meta.tabletW
          ) +
          percentageToPixels(
            tabletPaddingRight,
            tabletPaddingRightSuffix,
            meta.tabletW
          );
    const tabletMarginW =
      tabletMarginType === "grouped"
        ? percentageToPixels(tabletMargin * 2, tabletMarginSuffix, meta.tabletW)
        : percentageToPixels(
            tabletMarginLeft,
            tabletMarginLeftSuffix,
            meta.tabletW
          ) +
          percentageToPixels(
            tabletMarginRight,
            tabletMarginRightSuffix,
            meta.tabletW
          );

    // Mobile
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
    const externalTabletSpacing = tabletMarginW + tabletPaddingW;
    const externalMobileSpacing = mobileMarginW + mobilePaddingW;

    const mobileW =
      Math.round((meta.mobileW - externalMobileSpacing) * 10) / 10;
    const tabletW =
      Math.round((meta.tabletW - externalTabletSpacing) * 10) / 10;
    const desktopW = Math.round((meta.desktopW - externalSpacing) * 10) / 10;

    return {
      ...meta,
      mobileW,
      tabletW,
      desktopW,
      horizontalAlign,
      tabletHorizontalAlign,
      mobileHorizontalAlign
    };
  }

  renderToolbar = ContainerBorderButton => {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.toolbarRef}
      >
        <SortableHandle>
          <ContainerBorderButton />
        </SortableHandle>
      </Toolbar>
    );
  };

  renderContent(v, vs, vd) {
    const { showToolbar, className } = v;
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
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig,
          {
            allowExtendFromChild: false,
            parentItemsFilter: toolbarExtendFilter
          }
        ),
        extendParentToolbar: this.handleExtendParentToolbar
      }
    });

    const classNameContainer = classnames(
      "brz-d-xs-flex",
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      ),
      className
    );

    return (
      <div className={classNameContainer}>
        <EditorArrayComponent {...itemsProps} />
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const {
      animationName,
      animationDuration,
      animationDelay,
      customClassName,
      customID,
      cssIDPopulation,
      cssClassPopulation
    } = v;

    const componentId = v.items[0].type;

    const classNameWrapper = classnames(
      "brz-wrapper",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleWrapper(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation
    );

    return (
      <SortableElement type="shortcode">
        <Animation
          className={classNameWrapper}
          customID={cssIDPopulation === "" ? customID : cssIDPopulation}
          name={animationName !== "none" && animationName}
          duration={animationDuration}
          delay={animationDelay}
        >
          <ContextMenu
            {...{
              ...this.makeContextMenuProps(contextMenuConfig),
              componentId
            }}
          >
            <Roles
              allow={["admin"]}
              fallbackRender={() => this.renderContent(v, vs, vd)}
            >
              <ContainerBorder
                color="grey"
                borderStyle="dotted"
                showButton={v.showToolbar === "on"}
                buttonPosition="topRight"
                renderButtonWrapper={this.renderToolbar}
              >
                {v.showToolbar === "on" ? (
                  <ToolbarExtend onEscape={this.handleToolbarEscape}>
                    {this.renderContent(v, vs, vd)}
                  </ToolbarExtend>
                ) : (
                  this.renderContent(v, vs, vd)
                )}
              </ContainerBorder>
            </Roles>
          </ContextMenu>
        </Animation>
      </SortableElement>
    );
  }

  renderForView(v, vs, vd) {
    const {
      animationName,
      animationDuration,
      animationDelay,
      customClassName,
      customID,
      cssIDPopulation,
      cssClassPopulation
    } = v;

    const classNameWrapper = classnames(
      "brz-wrapper",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleWrapper(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation
    );

    return (
      <Animation
        className={classNameWrapper}
        customID={cssIDPopulation === "" ? customID : cssIDPopulation}
        name={animationName !== "none" && animationName}
        duration={animationDuration}
        delay={animationDelay}
      >
        {this.renderContent(v, vs, vd)}
      </Animation>
    );
  }
}

export default Wrapper;
