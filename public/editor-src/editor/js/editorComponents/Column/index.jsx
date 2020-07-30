import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { validateKeyByProperty } from "visual/utils/onChange";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import Animation from "visual/component/Animation";
import { Roles } from "visual/component/Roles";
import Toolbar, { ToolbarExtend } from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { blocksDataSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import ColumnResizer from "./components/ColumnResizer";
import Link from "visual/component/Link";
import { getContainerW } from "visual/utils/meta";
import Items from "./Items";
import { styleBg, styleColumn, styleAnimation } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { styleSizeWidth } from "visual/utils/style2";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

class Column extends EditorComponent {
  static get componentId() {
    return "Column";
  }

  static defaultProps = {
    meta: {},
    popoverData: [],
    onResizeStart: _.noop,
    onResize: _.noop,
    onResizeEnd: _.noop
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  containerBorderRef = React.createRef();

  toolbarRef = React.createRef();

  shouldComponentUpdate(nextProps) {
    const { meta, tabletReversed, mobileReversed } = this.props;
    const reversed =
      nextProps.mobileReversed !== mobileReversed ||
      nextProps.tabletReversed !== tabletReversed;

    return (
      meta.posts || meta.inCarousel || reversed || this.optionalSCU(nextProps)
    );
  }

  handleResizeStart = position => {
    if (this.containerBorderRef.current) {
      this.containerBorderRef.current.setActive(true);
    }

    this.props.onResizeStart(position);
  };

  handleResize = (deltaX, position) => {
    this.props.onResize(deltaX, position);
  };

  handleResizeEnd = position => {
    if (this.containerBorderRef.current) {
      this.containerBorderRef.current.setActive(false);
    }

    this.props.onResizeEnd(position);
  };

  handleToolbarEscape = () => {
    this.toolbarRef.current.show();
  };

  getMeta(v) {
    const { verticalAlign, tabletVerticalAlign, mobileVerticalAlign } = v;
    const { meta } = this.props;
    const width = styleSizeWidth({ v, device: "desktop" });
    const tabletWidth = styleSizeWidth({ v, device: "tablet" });
    const mobileWidth = styleSizeWidth({ v, device: "mobile" });
    const desktopW = getContainerW({
      v,
      width,
      w: meta.desktopW,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: meta.tabletW,
      width: tabletWidth,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: meta.mobileW,
      width: mobileWidth,
      device: "mobile"
    });

    return _.extend({}, meta, {
      column: {
        width,
        verticalAlign,
        tabletVerticalAlign,
        mobileVerticalAlign,
        tabletWidth,
        mobileWidth
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

  renderResizer(position) {
    const {
      meta: { row, inGrid },
      popoverData
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
        onResizeStart={this.handleResizeStart}
        onResize={this.handleResize}
        onResizeEnd={this.handleResizeEnd}
      />
    );
  }

  renderContent(v, vs, vd) {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      containerClassName: "brz-column__items",
      meta: this.getMeta(v)
    });
    const classNameBg = classnames(
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleBg(v, vs, vd)
      )
    );

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
          itemData = blocksDataSelector(getStore().getState())[
            itemData.value._id
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
      items,
      linkType,
      linkPopup,
      popups,
      customID,
      customClassName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes
    } = v;
    const {
      meta: { inGrid, posts }
    } = this.props;
    const isInnerRow = this.isInnerRow();

    const classNameColumn = classnames(
      "brz-columns",
      { "brz-columns__posts": IS_EDITOR && posts },
      { "brz-columns--empty": IS_EDITOR && items.length === 0 },
      css(
        `${this.constructor.componentId}-column`,
        `${this.getId()}-column`,
        styleColumn(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation
    );

    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    return (
      <>
        <SortableElement type="column" useHandle={true}>
          {sortableElementAtts => (
            <CustomCSS selectorName={this.getId()} css={v.customCSS}>
              <Animation
                component={"div"}
                animationClass={animationClassName}
                componentProps={{
                  ...parseCustomAttributes(customAttributes),
                  ...sortableElementAtts,
                  id: cssIDPopulation === "" ? customID : cssIDPopulation,
                  className: classNameColumn
                }}
              >
                <Roles
                  allow={["admin"]}
                  fallbackRender={() => this.renderContent(v, vs, vd)}
                >
                  <ContextMenu
                    {...this.makeContextMenuProps(contextMenuConfig)}
                  >
                    <ContainerBorder
                      ref={this.containerBorderRef}
                      color={isInnerRow && inGrid ? "red" : "blue"}
                      borderStyle="solid"
                      activateOnContentClick={false}
                      showButton={true}
                      buttonPosition="topRight"
                      renderButtonWrapper={this.renderToolbar}
                    >
                      {this.renderResizer("left")}
                      {this.renderResizer("right")}
                      <ToolbarExtend onEscape={this.handleToolbarEscape}>
                        {this.renderContent(v, vs, vd)}
                      </ToolbarExtend>
                    </ContainerBorder>
                  </ContextMenu>
                </Roles>
              </Animation>
            </CustomCSS>
          )}
        </SortableElement>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </>
    );
  }

  renderForView(v, vs, vd) {
    const {
      tagName,
      linkExternalType,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkPopup,
      linkUpload,
      popups,
      customID,
      customClassName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes
    } = v;

    const linkHrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    const classNameColumn = classnames(
      "brz-columns",
      css(
        `${this.constructor.componentId}-column`,
        `${this.getId()}-column`,
        styleColumn(v, vs, vd)
      ),
      cssClassPopulation === "" ? customClassName : cssClassPopulation
    );

    const animationClassName = classnames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.constructor.componentId}-wrapper-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: cssIDPopulation === "" ? customID : cssIDPopulation,
      className: classNameColumn
    };

    return (
      <>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Animation
            component={tagName}
            componentProps={props}
            animationClass={animationClassName}
          >
            {this.renderContent(v, vs, vd)}
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
      </>
    );
  }
}

export default Column;
