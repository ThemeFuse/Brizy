import React, { Fragment } from "react";
import classnames from "classnames";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import ContainerBorder from "visual/component/ContainerBorder";
import Background from "visual/component/Background";
import Animation from "visual/component/Animation";
import { ScrollMotion } from "visual/component/ScrollMotions";
import { makeOptionValueToMotion } from "visual/component/ScrollMotions/utils";
import { Roles } from "visual/component/Roles";
import Toolbar, { ToolbarExtend } from "visual/component/Toolbar";
import { blocksDataSelector } from "visual/redux/selectors";
import * as Str from "visual/utils/string/specs";
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
import { styleRow, styleContainer, styleAnimation } from "./styles";
import defaultValue from "./defaultValue.json";
import { styleSizeSize } from "visual/utils/style2";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import classNames from "classnames";
import { getStore } from "visual/redux/store";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";

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
    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW({
      v,
      w: meta.desktopW,
      wNoSpacing: meta.desktopWNoSpacing,
      width: size,
      device: "desktop"
    });
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW({
      v,
      w: meta.tabletW,
      wNoSpacing: meta.tabletWNoSpacing,
      width: tabletSize,
      device: "tablet"
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW({
      v,
      w: meta.mobileW,
      wNoSpacing: meta.mobileWNoSpacing,
      width: mobileSize,
      device: "mobile"
    });

    return Object.assign({}, meta, {
      row: {
        isInner: this.isInnerRow(),
        itemsLength: v.items.length
      },
      inGrid: true,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    });
  }

  isInnerRow() {
    const { meta } = this.props;

    return meta.row !== undefined;
  }

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = defaultValueValue({ v, key: "animationName" });
    const animationDuration = defaultValueValue({
      v,
      key: "animationDuration"
    });
    const animationDelay = defaultValueValue({ v, key: "animationDelay" });
    const slug = `${animationName}-${animationDuration}-${animationDelay}`;

    return classNames(
      css(
        `${this.getComponentId()}-animation-${slug}`,
        `${this.getId()}-animation-${slug}`,
        styleAnimation(v, vs, vd)
      )
    );
  };

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
        { allowExtend: false }
      ),
      meta: this.getMeta(v),
      tabletReversed: tabletReverseColumns,
      mobileReversed: mobileReverseColumns
    });

    return (
      <Background value={v} meta={this.getMeta(v)}>
        <Items {...itemsProps} />
      </Background>
    );
  }

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const blockData = globalBlocks[itemData.value._id];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : itemData.type === "GlobalBlock"
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
      customClassName,
      showToolbar,
      cssClassPopulation,
      customAttributes
    } = v;
    const customID = Str.mRead(v.customID) || undefined;
    const cssIDPopulation = Str.mRead(v.cssIDPopulation) || undefined;
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

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    if (showToolbar === "off") {
      return (
        <SortableElement type="row" useHandle={true}>
          {sortableElementAttr => (
            <Animation
              component={"div"}
              componentProps={sortableElementAttr}
              className={classNameRowContainer}
              animationClass={animationClassName}
            >
              {this.renderContent(v, vs, vd)}
            </Animation>
          )}
        </SortableElement>
      );
    }

    const content = (
      <ScrollMotion options={makeOptionValueToMotion(v)}>
        {this.renderContent(v, vs, vd)}
      </ScrollMotion>
    );

    return (
      <Fragment>
        <SortableElement type="row" useHandle={true}>
          {sortableElementAttr => (
            <ContainerBorder
              type="row"
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
                  <Animation
                    ref={containerBorderRef}
                    component={"div"}
                    componentProps={{
                      ...parseCustomAttributes(customAttributes),
                      ...sortableElementAttr,
                      ...containerBorderAttr,
                      id: cssIDPopulation ?? customID,
                      className: classNameRowContainer
                    }}
                    animationClass={animationClassName}
                  >
                    <ContextMenu
                      {...this.makeContextMenuProps(contextMenuConfig)}
                    >
                      <Roles allow={["admin"]} fallbackRender={() => content}>
                        <ToolbarExtend onEscape={this.handleToolbarEscape}>
                          {content}
                        </ToolbarExtend>
                        {ContainerBorderButton}
                        {ContainerBorderBorder}
                      </Roles>
                    </ContextMenu>
                  </Animation>
                </CustomCSS>
              )}
            </ContainerBorder>
          )}
        </SortableElement>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
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
      customClassName,
      cssClassPopulation,
      customAttributes
    } = v;

    const { sectionPopup, sectionPopup2 } = this.props.meta;

    const linkHrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };
    const customID = Str.mRead(v.customID) || undefined;
    const cssIDPopulation = Str.mRead(v.cssIDPopulation) || undefined;
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

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Animation
            iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
            component={tagName}
            componentProps={{
              ...parseCustomAttributes(customAttributes),
              id: cssIDPopulation ?? customID,
              className: classNameRowContainer
            }}
            animationClass={animationClassName}
          >
            <ScrollMotion options={makeOptionValueToMotion(v)}>
              {this.renderContent(v, vs, vd)}
            </ScrollMotion>
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
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }
}

export default Row;
