import React, { Fragment } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import SortableElement from "visual/component/Sortable/SortableElement";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import FloatingButton from "visual/component/FloatingButton";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import Animation from "visual/component/Animation";
import { Roles } from "visual/component/Roles";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { globalBlocksSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import ColumnResizer from "./components/ColumnResizer";
import Link from "visual/component/Link";
import { percentageToPixels } from "visual/utils/meta";
import { minWinColumn } from "visual/config/columns";
import Items from "./Items";
import {
  bgStyleClassName,
  bgStyleCSSVars,
  styleClassName,
  styleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

class Column extends EditorComponent {
  static get componentId() {
    return "Column";
  }

  static defaultProps = {
    meta: {},
    popoverData: [],
    onResize: _.noop,
    onResizeEnd: _.noop
  };

  static defaultValue = defaultValue;

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    const { meta, tabletReversed, mobileReversed } = this.props;
    const reversed =
      nextProps.mobileReversed !== mobileReversed ||
      nextProps.tabletReversed !== tabletReversed;

    return (
      meta.posts || meta.inCarousel || reversed || this.optionalSCU(nextProps)
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarOpen = () => {
    if (this.containerBorder) {
      this.containerBorder.setActive(true);
    }
    if (this.floatingButton) {
      this.floatingButton.setActive(true);
    }
  };

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    if (this.containerBorder) {
      this.containerBorder.setActive(false);
    }
    if (this.floatingButton) {
      this.floatingButton.setActive(false);
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabOverlay"
    });
  };

  handleToolbarEnter = () => {
    if (this.containerBorder) {
      this.containerBorder.setParentsHover(true);
    }
  };

  handleToolbarLeave = () => {
    if (this.containerBorder) {
      this.containerBorder.setParentsHover(false);
    }
  };

  getMeta(v) {
    const { meta } = this.props;
    const {
      width: columnWidth,
      mobileWidth: mobileColumnWidth,

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

      // Border
      borderWidthType,
      borderWidth,
      borderLeftWidth,
      borderRightWidth,

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
      mobileMarginRightSuffix
    } = v;

    const tabletColumnWidth = tabletSyncOnChange(v, "width");

    const wInMobileCol = meta.mobileW * (mobileColumnWidth / 100);
    const wInTabletCol = meta.tabletW * (tabletColumnWidth / 100);
    const wInDesktopCol = meta.desktopW * (columnWidth / 100);

    const marginW =
      marginType === "grouped"
        ? percentageToPixels(margin * 2, marginSuffix, wInDesktopCol)
        : percentageToPixels(marginLeft, marginLeftSuffix, wInDesktopCol) +
          percentageToPixels(marginRight, marginRightSuffix, wInDesktopCol);
    const paddingW =
      paddingType === "grouped"
        ? percentageToPixels(padding * 2, paddingSuffix, wInDesktopCol)
        : percentageToPixels(paddingLeft, paddingLeftSuffix, wInDesktopCol) +
          percentageToPixels(paddingRight, paddingRightSuffix, wInDesktopCol);
    const borderWidthW =
      borderWidthType === "grouped"
        ? Number(borderWidth) * 2
        : Number(borderLeftWidth) + Number(borderRightWidth);

    // Tablet
    const tabletPaddingW =
      tabletPaddingType === "grouped"
        ? percentageToPixels(
            tabletPadding * 2,
            tabletPaddingSuffix,
            wInTabletCol
          )
        : percentageToPixels(
            tabletPaddingLeft,
            tabletPaddingLeftSuffix,
            wInTabletCol
          ) +
          percentageToPixels(
            tabletPaddingRight,
            tabletPaddingRightSuffix,
            wInTabletCol
          );
    const tabletMarginW =
      tabletMarginType === "grouped"
        ? percentageToPixels(tabletMargin * 2, tabletMarginSuffix, wInTabletCol)
        : percentageToPixels(
            tabletMarginLeft,
            tabletMarginLeftSuffix,
            wInTabletCol
          ) +
          percentageToPixels(
            tabletMarginRight,
            tabletMarginRightSuffix,
            wInTabletCol
          );

    // Mobile
    const mobilePaddingW =
      mobilePaddingType === "grouped"
        ? percentageToPixels(
            mobilePadding * 2,
            mobilePaddingSuffix,
            wInMobileCol
          )
        : percentageToPixels(
            mobilePaddingLeft,
            mobilePaddingLeftSuffix,
            wInMobileCol
          ) +
          percentageToPixels(
            mobilePaddingRight,
            mobilePaddingRightSuffix,
            wInMobileCol
          );
    const mobileMarginW =
      mobileMarginType === "grouped"
        ? percentageToPixels(mobileMargin * 2, mobileMarginSuffix, wInMobileCol)
        : percentageToPixels(
            mobileMarginLeft,
            mobileMarginLeftSuffix,
            wInMobileCol
          ) +
          percentageToPixels(
            mobileMarginRight,
            mobileMarginRightSuffix,
            wInMobileCol
          );

    const externalSpacing = marginW + paddingW + borderWidthW;
    const externalTabletSpacing = tabletMarginW + tabletPaddingW + borderWidthW;
    const externalMobileSpacing = mobileMarginW + mobilePaddingW + borderWidthW;

    let mobileW = Math.round((wInMobileCol - externalMobileSpacing) * 10) / 10;
    const tabletW =
      Math.round((wInTabletCol - externalTabletSpacing) * 10) / 10;
    const desktopW = Math.round((wInDesktopCol - externalSpacing) * 10) / 10;

    if (IS_PREVIEW && desktopW >= minWinColumn) {
      mobileW = Math.round((minWinColumn - externalMobileSpacing) * 10) / 10;
    }

    return _.extend({}, meta, {
      column: {
        width: columnWidth,
        tabletWidth: tabletColumnWidth,
        mobileWidth: mobileColumnWidth
      },
      mobileW,
      tabletW,
      desktopW
    });
  }

  isInnerRow() {
    const { meta } = this.props;

    return meta.row && meta.row.isInner;
  }

  renderToolbar(v) {
    const { inGrid } = this.props.meta;
    const isInnerRow = this.isInnerRow();

    return (
      <div className="brz-ed-column__toolbar">
        <Toolbar
          {...this.makeToolbarPropsFromConfig(toolbarConfig)}
          onOpen={this.handleToolbarOpen}
          onClose={this.handleToolbarClose}
          onMouseEnter={this.handleToolbarEnter}
          onMouseLeave={this.handleToolbarLeave}
        >
          <SortableHandle>
            <div>
              <FloatingButton
                ref={el => {
                  this.floatingButton = el;
                }}
                reactToClick={false}
                color={isInnerRow && inGrid ? "red" : "blue"}
              />
            </div>
          </SortableHandle>
        </Toolbar>
      </div>
    );
  }

  renderResizer(position) {
    const {
      meta: { row, inGrid },
      popoverData,
      onResize,
      onResizeEnd
    } = this.props;

    if (!inGrid) {
      return null;
    }

    const { isFirst } = row.item;
    const isInnerRow = this.isInnerRow();

    if (isFirst && position === "left") {
      return null;
    }

    return (
      <ColumnResizer
        popoverData={popoverData}
        position={position}
        color={isInnerRow && inGrid ? "red" : "blue"}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
    );
  }

  renderContent(v) {
    const { bgImageSrc, bgColorOpacity } = v;

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      containerClassName: "brz-column__items",
      meta: this.getMeta(v)
    });

    const bgProps = {
      className: bgStyleClassName(v, this.props),
      imageSrc: bgImageSrc,
      colorOpacity: bgColorOpacity,
      tabletImageSrc: tabletSyncOnChange(v, "bgImageSrc"),
      tabletColorOpacity: tabletSyncOnChange(v, "bgColorOpacity"),
      mobileImageSrc: mobileSyncOnChange(v, "bgImageSrc"),
      mobileColorOpacity: mobileSyncOnChange(v, "bgColorOpacity")
    };

    return (
      <Background {...bgProps}>
        <Items {...itemsProps} />
      </Background>
    );
  }

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          itemData = globalBlocksSelector(getStore().getState())[
            itemData.value.globalBlockId
          ];
          isGlobal = true;
        }

        const {
          blockId,
          value: { popupId }
        } = itemData;

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : isGlobal
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v) {
    const {
      animationName,
      animationDuration,
      animationDelay,
      items,
      linkType,
      linkPopup,
      popups
    } = v;
    const {
      meta: { inGrid },
      path
    } = this.props;
    const isInnerRow = this.isInnerRow();
    const styles = {
      ...bgStyleCSSVars(v, this.props),
      ...styleCSSVars(v, this.props)
    };

    const borderClassName = classnames("brz-ed-border__column", {
      "brz-ed-border__column--empty": items.length === 0
    });

    return (
      <Fragment>
        <SortableElement type="column" useHandle={true}>
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Animation
              className={styleClassName(v, this.props)}
              style={styles}
              name={animationName !== "none" && animationName}
              duration={animationDuration}
              delay={animationDelay}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderContent(v)}
              >
                <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
                  <ContainerBorder
                    ref={input => {
                      this.containerBorder = input;
                    }}
                    className={borderClassName}
                    borderColor={isInnerRow && inGrid ? "red" : "blue"}
                    borderStyle="solid"
                    reactToClick={false}
                    path={path}
                  >
                    {this.renderResizer("left")}
                    {this.renderResizer("right")}
                    {this.renderToolbar(v)}
                    {this.renderContent(v)}
                  </ContainerBorder>
                </ContextMenu>
              </Roles>
            </Animation>
          </CustomCSS>
        </SortableElement>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </Fragment>
    );
  }

  renderForView(v) {
    const {
      animationName,
      animationDuration,
      animationDelay,
      linkExternalType,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkPopup,
      popups
    } = v;

    const linkHrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup
    };

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Animation
            className={styleClassName(v, this.props)}
            name={animationName !== "none" && animationName}
            duration={animationDuration}
            delay={animationDelay}
          >
            {this.renderContent(v)}
            {linkHrefs[linkType] !== "" && (
              <Link
                className="brz-container-link"
                type={linkType}
                href={linkHrefs[linkType]}
                target={linkExternalBlank}
                rel={linkExternalRel}
              />
            )}
          </Animation>
        </CustomCSS>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </Fragment>
    );
  }
}

export default Column;
