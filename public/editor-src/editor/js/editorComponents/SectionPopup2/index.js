import classnames from "classnames";
import React from "react";
import ReactDOM from "react-dom";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import CustomCSS from "visual/component/CustomCSS";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import { Roles } from "visual/component/Roles";
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
import Config from "visual/global/Config";
import { triggersSelector } from "visual/redux/selectors";
import { css } from "visual/utils/cssStyle";
import { t } from "visual/utils/i18n";
import { getContainerW } from "visual/utils/meta";
import { isExternalPopup, isInternalPopup, isPopup } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
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
  static get componentId() {
    return "SectionPopup2";
  }

  static defaultProps = {
    meta: {},
    onOpen: () => {},
    onClose: () => {}
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  // this is a used as a hack to reopen the
  // popup after it is unmounted when switching
  // from Global to normal
  static tmpGlobal = null;

  collapsibleToolbarRef = React.createRef();

  constructor(...args) {
    super(...args);

    this.instanceKey = this.props.instanceKey || this.getId();

    if (IS_EDITOR) {
      const isOpened =
        this.props.isOpened || SectionPopup2.tmpGlobal === this.getId();

      this.state = { isOpened };

      isOpened && document.documentElement.classList.add("brz-ow-hidden");
      SectionPopup2.tmpGlobal = null;

      this.popupsContainer = document.getElementById("brz-popups");
      this.el = document.createElement("div");
    }
  }

  componentDidMount() {
    this.popupsContainer.appendChild(this.el);
    Instances.set(this.instanceKey, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.isOpened !== nextState.isOpened;
    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentWillUnmount() {
    this.popupsContainer.removeChild(this.el);
    this.popupsContainer = null;
    this.el = null;

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
      sectionPopup2: true
    };
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
    const { containerClassName, showCloseButtonAfter } = v;
    const className = classnames(
      "brz-popup2__close",
      IS_PREVIEW && showCloseButtonAfter && "brz-hidden"
    );
    const innerClassName = classnames(
      "brz-popup2__inner",
      "brz-d-xs-flex",
      "brz-flex-xs-wrap",
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        styleInner(v, vs, vd)
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

    return (
      <Background value={v} meta={meta}>
        <div className={innerClassName}>
          <SortableZIndex zIndex={1}>
            <div className="brz-container__wrap">
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarCloseConfig,
                  sidebarCloseConfig,
                  { allowExtend: false }
                )}
              >
                <div className={className}>
                  <ThemeIcon name="close-popup" type="editor" />
                </div>
              </Toolbar>

              <div className={classNameContainer}>
                <EditorArrayComponent {...itemsProps} />
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

    const {
      className,
      customClassName,
      customAttributes,
      columnsHeightStyle,
      customCSS
    } = v;
    const id = this.getId();
    const isGlobal = isPopup(Config.getAll());

    const classNamePopup = classnames(
      "brz-popup2",
      "brz-popup2__editor",
      `brz-popup2__${columnsHeightStyle}`,
      { "brz-popup2--opened": this.state.isOpened },
      className,
      customClassName,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
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
            <div
              id={id}
              className={classNamePopup}
              data-block-id={this.props.blockId}
              ref={containerBorderRef}
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
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v, vs, vd)}
              >
                {this.renderToolbar()}
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v, vs, vd)}
                </ToolbarExtend>
              </Roles>
            </div>
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
      customCSS
    } = v;
    const config = Config.getAll();
    const triggers = triggersSelector(this.getReduxState());
    const isGlobal = isPopup(config);
    const isInternal = isInternalPopup(config);
    const isExternal = isExternalPopup(config);

    let attr = {};
    if (isGlobal) {
      const encodeIdsList = [
        "scrolling",
        "showing",
        "devices",
        "referrer",
        "loggedIn",
        "currentUrl",
        "currentDate",
        "lastVisitDate",
        "timeFrom",
        "cookie",
        "os",
        "otherPopups",
        "specificPopup"
      ];
      const encodeData = (data) => encodeURIComponent(JSON.stringify(data));
      const decodeData = (data) => JSON.parse(decodeURIComponent(data));
      const convertString = (name) =>
        name.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);

      attr = triggers.reduce((acc, item) => {
        if (item.active) {
          const convertedKey = `data-${convertString(item.id)}`;
          if (encodeIdsList.includes(item.id)) {
            acc[convertedKey] = acc[convertedKey]
              ? encodeData([...decodeData(acc[convertedKey]), item.value])
              : encodeData([item.value]);
          } else {
            acc[convertedKey] = item.value;
          }
        }

        return acc;
      }, {});
    }

    if (scrollPage === "on") {
      attr["data-scroll_page"] = "true";
    }
    if (clickOutsideToClose === "on") {
      attr["data-click_outside_to_close"] = "true";
    }
    if (showCloseButtonAfter) {
      attr["data-show-close-button-after"] = showCloseButtonAfter;
    }

    const classNamePopup = classnames(
      "brz-popup2",
      "brz-popup2__preview",
      `brz-popup2__${columnsHeightStyle}`,
      {
        "brz-simple-popup": !isGlobal,
        "brz-conditions-popup": isGlobal,
        "brz-conditions-internal-popup": isInternal,
        "brz-conditions-external-popup": isExternal
      },
      className,
      customClassName,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div
          className={classNamePopup}
          id={this.instanceKey}
          data-brz-popup={this.instanceKey}
          {...attr}
          {...parseCustomAttributes(customAttributes)}
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
