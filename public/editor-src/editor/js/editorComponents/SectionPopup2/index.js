import classnames from "classnames";
import React from "react";
import ReactDOM from "react-dom";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import { ContextMenuDisabled } from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import { Roles } from "visual/component/Roles";
import { currentUserRole } from "visual/component/Roles";
import { SortableZIndex } from "visual/component/Sortable/SortableZIndex";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar, {
  CollapsibleToolbar,
  ToolbarExtend
} from "visual/component/Toolbar";
import {
  wInFullPage,
  wInMobilePage,
  wInTabletPage
} from "visual/config/columns";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { SectionPopup2Instances as Instances } from "visual/editorComponents/SectionPopup2/instances";
import { isPopup } from "visual/providers/EditorModeProvider";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { t } from "visual/utils/i18n";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import { getContainerW } from "visual/utils/meta";
import { defaultValueValue } from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import { mRead } from "visual/utils/string/specs";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarCloseConfig from "./sidebarClose";
import * as sidebarExtendConfig from "./sidebarExtend";
import { style, styleInner } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarCloseConfig from "./toolbarClose";
import * as toolbarExtendConfig from "./toolbarExtend";

/**
 * @deprecated use import {SectionPopup2Instances} from "visual/editorComponents/SectionPopup2/instances"
 * @type {*|Map|Map|"default"}
 */
export const SectionPopup2Instances = Instances;

class SectionPopup2 extends EditorComponent {
  static defaultProps = {
    meta: {},
    onOpen: () => {},
    onClose: () => {}
  };
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  // from Global to normal
  static tmpGlobal = null;

  // this is a used as a hack to reopen the
  // popup after it is unmounted when switching
  collapsibleToolbarRef = React.createRef();

  constructor(...args) {
    super(...args);

    this.instanceKey = this.props.instanceKey || this.getId();

    if (isEditor(this.props.renderContext)) {
      const isOpened =
        this.props.isOpened || SectionPopup2.tmpGlobal === this.getId();

      this.state = { isOpened };

      isOpened && document.documentElement.classList.add("brz-ow-hidden");
      SectionPopup2.tmpGlobal = null;

      this.popupsContainer = document.getElementById("brz-popups");
      this.el = document.createElement("div");
    }
  }

  static get componentId() {
    return "SectionPopup2";
  }

  componentDidMount() {
    if (this.popupsContainer) {
      this.popupsContainer.appendChild(this.el);
    }

    Instances.set(this.instanceKey, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.isOpened !== nextState.isOpened;
    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    if (this.popupsContainer) {
      this.popupsContainer.removeChild(this.el);
      this.popupsContainer = null;
      this.el = null;
    }

    document.documentElement.classList.remove("brz-ow-hidden");
    Instances.delete(this.instanceKey);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(
      newValue,
      Object.assign(meta, {
        SectionPopup2: {
          dbId: this.getDBValue()._id,
          domId: this.getId()
        }
      })
    );
  }

  handleDropClick = () => {
    this.close();
  };

  handleToolbarEscape = () => {
    this.collapsibleToolbarRef.current.open();
  };

  getMeta(v) {
    const { meta } = this.props;
    const dvv = (key, device) => defaultValueValue({ v, device, key });
    const widthSuffix = dvv("widthSuffix", DESKTOP);
    const tabletWidthSuffix = dvv("widthSuffix", TABLET);
    const mobileWidthSuffix = dvv("widthSuffix", MOBILE);
    const width = dvv("width", DESKTOP);
    const tabletWidth = dvv("width", TABLET);
    const mobileWidth = dvv("width", MOBILE);

    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW({
      v,
      w: widthSuffix === "px" ? width : wInFullPage,
      wNoSpacing: widthSuffix === "px" ? width : wInFullPage,
      width: widthSuffix === "px" ? 100 : width,
      device: "desktop"
    });
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW({
      v,
      w: tabletWidthSuffix === "px" ? tabletWidth : wInTabletPage,
      wNoSpacing: tabletWidthSuffix === "px" ? tabletWidth : wInTabletPage,
      width: tabletWidthSuffix === "px" ? 100 : tabletWidth,
      device: "tablet"
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW({
      v,
      w: mobileWidthSuffix === "px" ? mobileWidth : wInMobilePage,
      wNoSpacing: mobileWidthSuffix === "px" ? mobileWidth : wInMobilePage,
      width: mobileWidthSuffix === "px" ? 100 : mobileWidth,
      device: "mobile"
    });

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing,
      sectionPopup2: true,
      popupId: this.getPopupId()
    };
  }

  getPopupId() {
    const { popupId } = this.getValue();
    const id = this.getId();

    const uidPlaceholder = makePlaceholder({
      content: "{{ random_id }}",
      attr: {
        key: id
      }
    });

    return popupId || `${id}_${uidPlaceholder}`;
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig, {
          allowExtend: false,
          allowExtendFromThirdParty: true
        })}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        global={!!globalBlockId}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const {
      containerClassName,
      showCloseButtonAfter,
      closeCustomClassName,
      closeCustomAttributes,
      closeCustomCSS,
      closeCustomID,
      cssID
    } = v;
    const _closeCustomID = mRead(closeCustomID) || undefined;
    const className = classnames(
      "brz-popup2__close",
      isView(this.props.renderContext) && showCloseButtonAfter && "brz-hidden",
      closeCustomClassName
    );
    const innerClassName = classnames(
      "brz-popup2__inner",
      "brz-d-xs-flex",
      "brz-flex-xs-wrap",
      this.css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        styleInner({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const classNameContainer = classnames("brz-container", containerClassName);

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig,
          { allowExtend: false }
        ),
        meta
      }
    });

    const props = {
      ...parseCustomAttributes(closeCustomAttributes),
      id: cssID ?? _closeCustomID,
      className: className
    };

    return (
      <Background value={v} meta={meta}>
        <div className={innerClassName}>
          <SortableZIndex zIndex={1} renderContext={this.props.renderContext}>
            <div className="brz-container__wrap">
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarCloseConfig,
                  sidebarCloseConfig,
                  { allowExtend: false }
                )}
              >
                {({ ref: toolbarRef }) => (
                  <CustomCSS
                    selectorName={`${this.getId()}--close`}
                    css={closeCustomCSS}
                  >
                    {({ ref: cssRef }) => (
                      <div
                        {...props}
                        ref={(el) => attachRefs(el, [toolbarRef, cssRef])}
                      >
                        <ThemeIcon name="close-popup" type="editor" />
                      </div>
                    )}
                  </CustomCSS>
                )}
              </Toolbar>

              <div className={classNameContainer}>
                <ContextMenuDisabled>
                  <EditorArrayComponent {...itemsProps} />
                </ContextMenuDisabled>
              </div>
            </div>
          </SortableZIndex>
        </div>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    if (!this.state.isOpened) {
      return null;
    }

    const { className: _className, blockId, meta = {} } = this.props;
    const {
      className,
      customClassName,
      customAttributes,
      columnsHeightStyle,
      customCSS
    } = v;
    const id = this.getId();
    const isGlobal = isPopup(this.props.editorMode);
    const inMegaMenu = meta.megaMenu;
    const classNamePopup = classnames(
      "brz-popup2",
      "brz-popup2__editor",
      `brz-popup2__${columnsHeightStyle}`,
      "brz-popup2--fixed",
      {
        "brz-popup2--opened": this.state.isOpened,
        "brz-popup2--inMegaMenu": inMegaMenu
      },
      className,
      _className,
      customClassName,
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    let content = (
      <ContainerBorder
        type="popup2"
        hiddenInResponsive={true}
        activateOnContentClick={false}
      >
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={id} css={customCSS}>
            {({ ref: cssRef }) => (
              <div
                id={id}
                className={classNamePopup}
                {...makeDataAttr({ name: "block-id", value: blockId })}
                ref={(el) => attachRefs(el, [containerBorderRef, cssRef])}
                {...parseCustomAttributes(customAttributes)}
                {...containerBorderAttr}
              >
                {!isGlobal && (
                  <button
                    className="brz-button brz-popup2__button-go-to-editor"
                    onClick={this.handleDropClick}
                  >
                    <EditorIcon
                      icon="nc-arrow-left"
                      className="brz-popup2__icon-go-to-editor"
                    />
                    {t("Go Back")}
                  </button>
                )}
                <Roles
                  currentRole={currentUserRole(this.getGlobalConfig())}
                  allow={["admin"]}
                  fallbackRender={() => this.renderItems(v, vs, vd)}
                >
                  {this.renderToolbar()}
                  <ToolbarExtend onEscape={this.handleToolbarEscape}>
                    {this.renderItems(v, vs, vd)}
                  </ToolbarExtend>
                </Roles>
              </div>
            )}
          </CustomCSS>
        )}
      </ContainerBorder>
    );

    if (!isGlobal) {
      content = (
        <HotKeys
          keyNames={["esc"]}
          id="key-helper-prompt-esc"
          onKeyUp={this.handleDropClick}
        >
          {content}
        </HotKeys>
      );
    }

    return ReactDOM.createPortal(content, this.el);
  }

  renderForView(v, vs, vd) {
    const {
      className,
      customClassName,
      customAttributes,
      columnsHeightStyle,
      scrollPage,
      clickOutsideToClose,
      showCloseButtonAfter,
      customCSS,
      popupId: _popupId
    } = v;
    const { className: _className, meta = {} } = this.props;
    const config = this.getGlobalConfig();
    const inMegaMenu = meta.megaMenu;
    const popupSettings = config.ui?.popupSettings ?? {};
    const scrollPageBehind = popupSettings.scrollPageBehind;
    const clickOutside = popupSettings.clickOutsideToClose;

    let attr = {};
    if (scrollPage === "on" && scrollPageBehind === true) {
      attr[makeAttr("scroll_page")] = "true";
    }
    if (clickOutsideToClose === "on" && clickOutside === true) {
      attr[makeAttr("click_outside_to_close")] = "true";
    }
    if (showCloseButtonAfter) {
      attr[makeAttr("show-close-button-after")] = showCloseButtonAfter;
    }

    const classNamePopup = classnames(
      "brz brz-popup2",
      "brz-popup2__preview",
      `brz-popup2__${columnsHeightStyle}`,
      "brz-popup2--fixed",
      { "brz-popup2--inMegaMenu": inMegaMenu },
      className,
      _className,
      customClassName,
      this.css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const popupId = this.getPopupId();

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div
          className={classNamePopup}
          id={popupId}
          {...makeDataAttr({ name: "popup", value: popupId })}
          {...attr}
          {...parseCustomAttributes(customAttributes)}
          {...makeDataAttr({
            name: "once-id",
            value: _popupId || this.getId()
          })}
        >
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }

  open() {
    document.documentElement.classList.add("brz-ow-hidden");
    this.props.onOpen();
    this.setState({
      isOpened: true
    });
  }

  close() {
    document.documentElement.classList.remove("brz-ow-hidden");
    this.props.onClose();
    this.setState({
      isOpened: false
    });
  }
}

export default SectionPopup2;
