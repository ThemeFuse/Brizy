import classNames from "classnames";
import React, { Fragment } from "react";
import Animation from "visual/component/Animation";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Link from "visual/component/Link";
import { Roles } from "visual/component/Roles";
import { ScrollMotion } from "visual/component/ScrollMotions";
import { makeOptionValueToMotion } from "visual/component/ScrollMotions/utils";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import Toolbar, { ToolbarExtend } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import Config from "visual/global/Config";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { getContainerW } from "visual/utils/meta";
import { isPopup } from "visual/utils/models";
import { getCSSId } from "visual/utils/models/cssId";
import { getLinkData } from "visual/utils/models/link";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { makeOptionValueToAnimation } from "visual/utils/options/utils/makeValueToOptions";
import { handleLinkChange } from "visual/utils/patch/Link";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import * as Str from "visual/utils/string/specs";
import Items from "./Items";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { styleAnimation, styleContainer, styleRow } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./toolbarExtend";
import { omit } from "timm";

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

  patchValue(patch, meta) {
    const link = handleLinkChange(patch);
    super.patchValue({ ...patch, ...link }, meta);
  }

  handleValueChange(value, meta) {
    const inPopup = Boolean(this.props.meta.sectionPopup);
    const inPopup2 = Boolean(this.props.meta.sectionPopup2);

    if (
      value.items.length === 0 &&
      (!inPopup || !inPopup2 || !isPopup(Config.getAll()))
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

    const dvv = (key, device) => defaultValueValue({ v, key, device });

    const size = dvv("size", DESKTOP);
    const tabletSize = dvv("size", TABLET);
    const mobileSize = dvv("size", MOBILE);

    const pixelSuffix = dvv("sizeSuffix", DESKTOP) === "px";
    const tabletPixelSuffix = dvv("sizeSuffix", TABLET) === "px";
    const mobilePixelSuffix = dvv("sizeSuffix", MOBILE) === "px";

    const _w = pixelSuffix ? size : meta.desktopW;
    const _tabletW = tabletPixelSuffix ? tabletSize : meta.tabletW;
    const _mobileW = mobilePixelSuffix ? mobileSize : meta.mobileW;

    const _width = pixelSuffix ? 100 : size;
    const _tabletWidth = tabletPixelSuffix ? 100 : tabletSize;
    const _mobileWidth = mobilePixelSuffix ? 100 : mobileSize;

    const _wNoSpacing = pixelSuffix ? size : meta.desktopWNoSpacing;
    const _tabletWNoSpacing = tabletPixelSuffix
      ? tabletSize
      : meta.tabletWNoSpacing;
    const _mobileWNoSpacing = mobilePixelSuffix
      ? mobileSize
      : meta.mobileWNoSpacing;

    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW({
      v,
      w: _w,
      wNoSpacing: _wNoSpacing,
      width: _width,
      device: "desktop"
    });
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW({
      v,
      w: _tabletW,
      wNoSpacing: _tabletWNoSpacing,
      width: _tabletWidth,
      device: "tablet"
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW({
      v,
      w: _mobileW,
      wNoSpacing: _mobileWNoSpacing,
      width: _mobileWidth,
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

  dvv = (key) => {
    const v = this.getValue();
    const device = deviceModeSelector(this.getReduxState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = this.dvv("animationName");
    const animationDuration = this.dvv("animationDuration");
    const animationDelay = this.dvv("animationDelay");
    const animationInfiniteAnimation = this.dvv("animationInfiniteAnimation");

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

    return classNames(
      css(
        `${this.getComponentId()}-animation-${slug}`,
        `${this.getId()}-animation-${slug}`,
        styleAnimation(v, vs, vd)
      )
    );
  };

  renderToolbar = (ContainerBorderButton) => {
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

  getHoverData = (v) => {
    const hoverName = Str.read(this.dvv("hoverName")) ?? "none";
    const options = makeOptionValueToAnimation(v);

    return {
      hoverName,
      options: getHoverAnimationOptions(options, hoverName),
      animationId: this.getId(),
      isHidden: hoverName === "none"
    };
  };

  renderContent(v, vs, vd) {
    const { className, mobileReverseColumns, tabletReverseColumns } = v;
    const classNameContainer = classNames(
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
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData) => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const globalBlockId = itemData.value._id;
          const blockData = globalBlocks[globalBlockId];

          newMeta = {
            ...newMeta,
            globalBlockId
          };
          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          meta: newMeta,
          ...(IS_EDITOR && {
            instanceKey: `${this.getId()}_${popupId}`
          })
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
      cssClass,
      customAttributes
    } = v;
    const id = getCSSId(v);
    const classNameRowContainer = classNames(
      "brz-row__container",
      className,
      css(
        `${this.constructor.componentId}-row`,
        `${this.getId()}-row`,
        styleRow(v, vs, vd)
      ),
      cssClass || customClassName
    );

    const animationClassName = this.getAnimationClassName(v, vs, vd);

    if (showToolbar === "off") {
      return (
        <SortableElement type="row" useHandle={true}>
          {(sortableElementAttr) => (
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
    const { options, hoverName, isHidden, animationId } = this.getHoverData(v);
    const content = (
      <ScrollMotion
        className="brz-row__scroll-motion"
        options={makeOptionValueToMotion(v)}
      >
        <HoverAnimation
          animationId={animationId}
          cssKeyframe={hoverName}
          options={options}
          target={"parent"}
          isHidden={isHidden}
        >
          {this.renderContent(v, vs, vd)}
        </HoverAnimation>
      </ScrollMotion>
    );

    return (
      <Fragment>
        <SortableElement type="row" useHandle={true}>
          {(sortableElementAttr) => (
            <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
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
                        ...(id && { id }),
                        className: classNameRowContainer
                      }}
                      animationClass={animationClassName}
                    >
                      <Roles allow={["admin"]} fallbackRender={() => content}>
                        <ToolbarExtend onEscape={this.handleToolbarEscape}>
                          {content}
                        </ToolbarExtend>
                        {ContainerBorderButton}
                        {ContainerBorderBorder}
                      </Roles>
                    </Animation>
                  </CustomCSS>
                )}
              </ContainerBorder>
            </ContextMenu>
          )}
        </SortableElement>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </Fragment>
    );
  }

  renderForView(v, vs, vd) {
    const { className, tagName, customClassName, cssClass, customAttributes } =
      v;
    const linkData = getLinkData(v);
    const id = getCSSId(v);
    const { sectionPopup, sectionPopup2 } = this.props.meta;
    const classNameRowContainer = classNames(
      "brz-row__container",
      className,
      css(
        `${this.constructor.componentId}-row`,
        `${this.getId()}-row`,
        styleRow(v, vs, vd)
      ),
      cssClass || customClassName
    );

    const animationClassName = this.getAnimationClassName(v, vs, vd);
    const { options, hoverName, isHidden, animationId } = this.getHoverData(v);

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Animation
            iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
            component={tagName}
            componentProps={{
              ...parseCustomAttributes(customAttributes),
              ...(id && { id }),
              className: classNameRowContainer
            }}
            animationClass={animationClassName}
          >
            <ScrollMotion
              className="brz-row__scroll-motion"
              options={makeOptionValueToMotion(v)}
            >
              <HoverAnimation
                animationId={animationId}
                cssKeyframe={hoverName}
                options={options}
                target={"parent"}
                isHidden={isHidden}
              >
                {this.renderContent(v, vs, vd)}
              </HoverAnimation>
            </ScrollMotion>
            {linkData.href && (
              <Link
                className="brz-link-container"
                type={linkData.type}
                href={linkData.href}
                target={linkData.target}
                rel={linkData.rel}
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
