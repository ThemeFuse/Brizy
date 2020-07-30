import React, { Fragment } from "react";
import classnames from "classnames";
import { validateKeyByProperty } from "visual/utils/onChange";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import ContainerBorder from "visual/component/ContainerBorder";
import Background from "visual/component/Background";
import Animation from "visual/component/Animation";
import { Roles } from "visual/component/Roles";
import Toolbar, { ToolbarExtend } from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { blocksDataSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import * as toolbarExtendConfig from "./toolbarExtend";
import ContextMenu from "visual/component/ContextMenu";
import contextMenuConfig from "./contextMenu";
import Link from "visual/component/Link";
import { getContainerW } from "visual/utils/meta";
import Items from "./Items";
import { css } from "visual/utils/cssStyle";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import { styleRow, styleBg, styleContainer, styleAnimation } from "./styles";
import defaultValue from "./defaultValue.json";
import { styleSizeSize } from "visual/utils/style2";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

class Row extends EditorComponent {
  static get componentId() {
    return "Row";
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

  handleToolbarEscape = () => {
    this.toolbarRef.current.show();
  };

  getMeta(v) {
    const { meta } = this.props;
    const size = styleSizeSize({ v, device: "desktop" });
    const tabletSize = styleSizeSize({ v, device: "tablet" });
    const mobileSize = styleSizeSize({ v, device: "mobile" });
    const desktopW = getContainerW({
      v,
      w: meta.desktopW,
      width: size,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: meta.tabletW,
      width: tabletSize,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: meta.mobileW,
      width: mobileSize,
      device: "mobile"
    });

    return Object.assign({}, meta, {
      row: {
        isInner: this.isInnerRow(),
        itemsLength: v.items.length
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
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.toolbarRef}
      >
        <SortableHandle>
          <ContainerBorderButton className="brz-ed-border__button--row" />
        </SortableHandle>
      </Toolbar>
    );
  };

  renderContent(v, vs, vd) {
    const { className, mobileReverseColumns, tabletReverseColumns } = v;

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
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        null,
        {
          allowExtend: false
        }
      ),
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
      className,
      customID,
      customClassName,
      showToolbar,
      linkType,
      linkPopup,
      popups,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameRowContainer = classnames(
      "brz-row__container",
      className,
      css(
        `${this.constructor.componentId}-row`,
        `${this.getId()}-row`,
        styleRow(v, vs, vd)
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

    if (showToolbar === "off") {
      return (
        <SortableElement type="row" useHandle={true}>
          {sortableElementAtts => (
            <Animation
              component={"div"}
              componentProps={sortableElementAtts}
              className={classNameRowContainer}
              animationClass={animationClassName}
            >
              {this.renderContent(v, vs, vd)}
            </Animation>
          )}
        </SortableElement>
      );
    }

    return (
      <Fragment>
        <SortableElement type="row" useHandle={true}>
          {sortableElementAtts => (
            <CustomCSS selectorName={this.getId()} css={v.customCSS}>
              <Animation
                component={"div"}
                componentProps={{
                  ...parseCustomAttributes(customAttributes),
                  ...sortableElementAtts,
                  id: cssIDPopulation === "" ? customID : cssIDPopulation,
                  className: classNameRowContainer
                }}
                animationClass={animationClassName}
              >
                <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
                  <Roles
                    allow={["admin"]}
                    fallbackRender={() => this.renderContent(v, vs, vd)}
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
                        {this.renderContent(v, vs, vd)}
                      </ToolbarExtend>
                    </ContainerBorder>
                  </Roles>
                </ContextMenu>
              </Animation>
            </CustomCSS>
          )}
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
      tagName,
      linkExternalType,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkPopup,
      linkUpload,
      popups,
      customClassName,
      customID,
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

    const classNameRowContainer = classnames(
      "brz-row__container",
      className,
      css(
        `${this.constructor.componentId}-row`,
        `${this.getId()}-row`,
        styleRow(v, vs, vd)
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
      className: classNameRowContainer
    };

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Animation
            component={tagName}
            componentProps={props}
            animationClass={animationClassName}
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
