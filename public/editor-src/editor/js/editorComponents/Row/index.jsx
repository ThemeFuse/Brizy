import React, { Fragment } from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import SortableElement from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import ContainerBorder from "visual/component/ContainerBorder";
import Background from "visual/component/Background";
import Animation from "visual/component/Animation";
import { Roles } from "visual/component/Roles";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { globalBlocksSelector } from "visual/redux/selectors";
import Config from "visual/global/Config";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./extendToolbar";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import Link from "visual/component/Link";
import { percentageToPixels } from "visual/utils/meta";
import Items from "./Items";
import { css } from "visual/utils/cssStyle";
import { styleRow, styleBg, styleContainer } from "./styles";
import defaultValue from "./defaultValue.json";

const { isGlobalPopup: IS_GLOBAL_POPUP } = Config.get("wp") || {};

class Row extends EditorComponent {
  static get componentId() {
    return "Row";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  mounted = false;
  containerBorder = React.createRef();

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleValueChange(value, meta) {
    const inPopup = Boolean(this.props.meta.sectionPopup);
    const inPopup2 = Boolean(this.props.meta.sectionPopup2);

    if (
      value.items.length === 0 &&
      (!inPopup || !inPopup2 || !IS_GLOBAL_POPUP)
    ) {
      this.selfDestruct();
    } else {
      super.handleValueChange(value, meta);
    }
  }

  getMeta(v) {
    const { meta } = this.props;
    const {
      size,

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

      // Mobile Padding
      mobilePadding,
      mobilePaddingType,
      mobilePaddingSuffix,
      mobilePaddingLeft,
      mobilePaddingLeftSuffix,
      mobilePaddingRight,
      mobilePaddingRightSuffix,

      items
    } = v;

    const containerWidth = meta.desktopW * (size / 100);
    const paddingW =
      paddingType === "grouped"
        ? percentageToPixels(padding * 2, paddingSuffix, containerWidth)
        : percentageToPixels(paddingLeft, paddingLeftSuffix, containerWidth) +
          percentageToPixels(paddingRight, paddingRightSuffix, containerWidth);
    const borderWidthW =
      borderWidthType === "grouped"
        ? Number(borderWidth) * 2
        : Number(borderLeftWidth) + Number(borderRightWidth);

    // Tablet Padding
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

    // Mobile Padding
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

    const externalSpacing = paddingW + borderWidthW;
    const externalTabletSpacing = tabletPaddingW + borderWidthW;
    const externalMobileSpacing = mobilePaddingW + borderWidthW;

    const desktopW = Math.round((containerWidth - externalSpacing) * 10) / 10;
    const tabletW =
      Math.round((meta.tabletW - externalTabletSpacing) * 10) / 10;
    const mobileW =
      Math.round((meta.mobileW - externalMobileSpacing) * 10) / 10;

    return Object.assign({}, meta, {
      row: {
        isInner: this.isInnerRow(),
        itemsLength: items.length
      },
      inGrid: true,
      mobileW,
      tabletW,
      desktopW
    });
  }

  isInnerRow() {
    const { meta } = this.props;

    return meta.row !== undefined;
  }

  renderToolbar = ContainerBorderButton => {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <SortableHandle>
          <ContainerBorderButton className="brz-ed-border__button--row" />
        </SortableHandle>
      </Toolbar>
    );
  };

  renderContent(v, vs, vd) {
    const {
      customClassName,
      className,
      mobileReverseColumns,
      tabletReverseColumns
    } = v;

    const classNameBg = classnames(
      "brz-flex-xs-wrap",
      "brz-row__bg",
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleBg(v, vs, vd)
      )
    );

    const classNameContainer = classnames(
      "brz-row",
      { "brz-row--inner": this.isInnerRow() },
      className,
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      )
    );

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      containerClassName: classNameContainer,
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtendConfig, {
        filterExtendName: `${this.constructor.componentId}_child`,
        allowExtend: false
      }),
      meta: this.getMeta(v),
      tabletReversed: tabletReverseColumns,
      mobileReversed: mobileReverseColumns
    });

    return (
      <Background className={classNameBg} value={v} meta={this.getMeta(v)}>
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

  renderForEdit(v, vs, vd) {
    const {
      className,
      customID,
      customClassName,
      showToolbar,
      animationName,
      animationDuration,
      animationDelay,
      linkType,
      linkPopup,
      popups
    } = v;

    const classNameRowContainer = classnames(
      "brz-row__container",
      className,
      customClassName,
      css(
        `${this.constructor.componentId}-row`,
        `${this.getId()}-row`,
        styleRow(v, vs, vd)
      )
    );

    if (showToolbar === "off") {
      return (
        <SortableElement type="row" useHandle={true}>
          <Animation
            className={classNameRowContainer}
            name={animationName !== "none" && animationName}
            duration={animationDuration}
            delay={animationDelay}
          >
            {this.renderContent(v, vs, vd)}
          </Animation>
        </SortableElement>
      );
    }

    return (
      <Fragment>
        <SortableElement type="row" useHandle={true}>
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Animation
              className={classNameRowContainer}
              customID={customID}
              name={animationName !== "none" && animationName}
              duration={animationDuration}
              delay={animationDelay}
            >
              <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
                <Roles
                  allow={["admin"]}
                  fallbackRender={() => this.renderContent(v, vs, vd)}
                >
                  <ContainerBorder
                    ref={this.containerBorder}
                    color="grey"
                    activeBorderStyle="dotted"
                    activateOnContentClick={false}
                    showButton={true}
                    buttonPosition="topLeft"
                    renderButtonWrapper={this.renderToolbar}
                  >
                    {this.renderContent(v, vs, vd)}
                  </ContainerBorder>
                </Roles>
              </ContextMenu>
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

  renderForView(v, vs, vd) {
    const {
      className,
      animationName,
      animationDuration,
      animationDelay,
      linkExternalType,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkPopup,
      linkUpload,
      popups,
      customClassName,
      customID
    } = v;

    const linkHrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    const classNameRowContainer = classnames(
      "brz-row__container",
      className,
      customClassName,
      css(
        `${this.constructor.componentId}-row`,
        `${this.getId()}-row`,
        styleRow(v, vs, vd)
      )
    );

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Animation
            className={classNameRowContainer}
            customID={customID}
            name={animationName !== "none" && animationName}
            duration={animationDuration}
            delay={animationDelay}
          >
            {this.renderContent(v, vs, vd)}
            {linkHrefs[linkType] !== "" && (
              <Link
                className="brz-link-container"
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

export default Row;
