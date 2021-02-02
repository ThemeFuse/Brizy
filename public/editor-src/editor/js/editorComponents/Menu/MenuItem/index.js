import React from "react";
import classnames from "classnames";
import { noop } from "underscore";
import { Manager, Reference, Popper } from "react-popper";
import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import SortableZIndex from "visual/component/Sortable/SortableZIndex";
import Portal from "visual/component/Portal";
import Toolbar from "visual/component/Toolbar";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import ClickOutside from "visual/component/ClickOutside";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { css } from "visual/utils/cssStyle";
import {
  styleElementMegaMenuWidth,
  styleElementMegaMenuWidthSuffix,
  styleElementMegaMenuPlacement
} from "visual/utils/style2";
import { getStore } from "visual/redux/store";
import MenuItemItems from "./items";
import toolbarConfigFn from "./toolbar";
import sidebarConfigFn from "./sidebar";
import toolbarExtendFn from "./toolbarExtend";
import { styleClassName, styleMmMenuClassName, styleMegaMenu } from "./styles";
import defaultValue from "./defaultValue.json";
import { calculateMeta } from "./meta";
import { DraggableOverlay } from "visual/component/DraggableOverlay";

const IS_PRO = Config.get("pro");
const MAX_LEVEL_RENDER = 2;
let openedMegaMenu = null;

class MenuItem extends EditorComponent {
  static get componentId() {
    return "MenuItem";
  }

  static defaultProps = {
    defaultValue: {},
    level: 0,
    mMenu: false,
    mods: {
      desktop: "vertical",
      tablet: "vertical",
      mobile: "vertical"
    },
    getParentWidth: noop
  };

  static defaultValue = defaultValue;

  state = {
    isOpen: false
  };

  menuItem = React.createRef();

  componentDidUpdate(nextProps) {
    if (
      this.props.defaultValue.megaMenu !== nextProps.defaultValue.megaMenu &&
      nextProps.defaultValue.megaMenu === "on"
    ) {
      this.open();
    }
  }

  getMeta(v) {
    const { meta, mods, mMenu } = this.props;
    const {
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    } = calculateMeta({
      v,
      meta,
      mods,
      isMMenu: Boolean(mMenu)
    });

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    };
  }

  getMegaMenuWidth(width, suffix, mode) {
    const doc = this.menuItem.current?.ownerDocument;

    if (!doc) {
      return `${width}${suffix}`;
    }

    const { clientWidth } = doc.body;
    const nodeRect = this.menuItem.current.getBoundingClientRect();
    const leftSpaces = nodeRect.left;
    const rightSpaces = clientWidth - nodeRect.right;
    let calcWidth;

    if (suffix === "%") {
      const parentNode = this.props.getParent();
      const parentWidth = parentNode?.getBoundingClientRect().width;

      calcWidth = parentWidth * (width / 100);
    } else if (suffix === "vw") {
      calcWidth = width >= 100 ? clientWidth : clientWidth * (width / 100);
    } else {
      calcWidth = width;
    }

    if (
      mode === "vertical" &&
      leftSpaces < calcWidth &&
      rightSpaces < calcWidth
    ) {
      const collision = 10; // collision megaMenu between body
      const leftSpacesCollision = leftSpaces - collision;
      const rightSpacesCollision = rightSpaces - collision;

      return `${Math.max(leftSpacesCollision, rightSpacesCollision)}px`;
    }

    return `${calcWidth}px`;
  }

  close = () => {
    this.setState({ isOpen: false });
    openedMegaMenu = null;
  };

  open = () => {
    const v = this.getValue();

    this.setState({ isOpen: true });

    if (v.megaMenu === "on") {
      openedMegaMenu = this;
    }
  };

  handleClick = () => {
    if (!this.state.isOpen) {
      this.open();
    }
  };

  handleClickOutside = () => {
    if (this.state.isOpen) {
      this.close();
    }
  };

  renderIcon(v) {
    const { iconName, iconType } = v;
    const { level, mMenu } = this.props;

    const className = classnames(
      { "brz-menu__item__icon": level === 0 && !mMenu },
      { "brz-menu__sub-item__icon": level >= 1 },
      { "brz-mm-menu__item__icon": mMenu }
    );

    return (
      <ThemeIcon
        key="icon"
        className={className}
        name={iconName}
        type={iconType}
      />
    );
  }

  renderLink(v, vs, vd, content) {
    const { url, target, classes, attrTitle } = v;

    const trimUrl = url.trim();

    let type = "";
    let href = "";

    if (trimUrl.charAt(0) === "#") {
      type = "anchor";
      href = url.replace("#", "");
    } else {
      type = "external";
      href = trimUrl;
    }

    let props = {
      href,
      type,
      target: target === "_blank" ? "on" : "off",
      className: classes,
      attr: {
        title: attrTitle
      }
    };

    if (IS_EDITOR) {
      props.onDragStart = e => {
        e.preventDefault();
        return false;
      };
      props.draggable = "false";
    }

    return <Link {...props}>{content}</Link>;
  }

  renderMegaMenu(v, vs, vd) {
    if (!IS_PRO) {
      return null;
    }

    return IS_EDITOR
      ? this.renderMegaMenuForEdit(v, vs, vd)
      : this.renderMegaMenuForView(v, vs, vd);
  }

  renderMegaMenuForEdit(v, vs, vd) {
    const { mMenu, level, getParent, mods } = this.props;
    const { deviceMode: device } = getStore().getState().ui;
    const mode = getModeByDevice(mods, device);
    const placement = styleElementMegaMenuPlacement({ v, device });
    const toolbarExtend = toolbarExtendFn(mode, Boolean(mMenu));
    const itemProps = this.makeSubcomponentProps({
      level,
      meta: this.getMeta(v),
      bindWithKey: "megaMenuItems",
      megaMenu: true,
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
        allowExtend: false
      }),
      itemProps: {
        rerender: { placement }
      }
    });

    // megaMenu without popper
    // mmenu opened with display: none | block
    if (mMenu) {
      return (
        <div className="brz-mega-menu__mmenu">
          <MenuItemItems {...itemProps} />
        </div>
      );
    }

    if (!this.state.isOpen) {
      return;
    }

    const className = classnames(
      css(this.constructor.componentId, this.getId(), styleMegaMenu(v, vs, vd))
    );

    // don't need Popper for mobile and vertical mode
    // we render it inside a menu item and opened the same as mmenu
    if (device === MOBILE && mode === "vertical") {
      const dropdownMegaMenu = classnames("brz-mega-menu__dropdown", className);

      return (
        <div className={dropdownMegaMenu}>
          <MenuItemItems {...itemProps} />
        </div>
      );
    }

    const parentNode = getParent();
    const portalClassName = classnames(
      "brz-mega-menu__portal",
      "brz-mega-menu__portal--opened",
      className
    );
    const width = styleElementMegaMenuWidth({ v, device });
    const widthSuffix = styleElementMegaMenuWidthSuffix({ v, device });
    const maxWidth = this.getMegaMenuWidth(width, widthSuffix, mode);
    const props =
      mode === "vertical"
        ? {
            placement: "left-start",
            referenceElement: parentNode.querySelector(".brz-menu__ul")
          }
        : {
            placement,
            referenceElement: parentNode
          };

    return (
      <Popper {...props}>
        {({ ref, style, placement }) => (
          <Portal node={document.body}>
            <SortableZIndex zindex={2}>
              <div
                className={portalClassName}
                ref={ref}
                style={{
                  ...style,
                  maxWidth,
                  width: "100%"
                }}
                data-popper-placement={placement}
              >
                <MenuItemItems {...itemProps} />
              </div>
            </SortableZIndex>
            <DraggableOverlay />
          </Portal>
        )}
      </Popper>
    );
  }

  renderMegaMenuForView(v, vs, vd) {
    const { mMenu, level, mods } = this.props;
    const itemProps = this.makeSubcomponentProps({
      level,
      meta: this.getMeta(v),
      bindWithKey: "megaMenuItems",
      megaMenu: true
    });

    if (mMenu) {
      return (
        <div className="brz-mega-menu__mmenu">
          <MenuItemItems {...itemProps} />
        </div>
      );
    }

    const className = classnames(
      "brz-mega-menu__portal",
      css(this.constructor.componentId, this.getId(), styleMegaMenu(v, vs, vd))
    );
    const dW = styleElementMegaMenuWidth({ v, device: DESKTOP });
    const dWS = styleElementMegaMenuWidthSuffix({ v, device: DESKTOP });
    const tW = styleElementMegaMenuWidth({ v, device: TABLET });
    const tWS = styleElementMegaMenuWidthSuffix({ v, device: TABLET });
    const mW = styleElementMegaMenuWidth({ v, device: MOBILE });
    const mWS = styleElementMegaMenuWidthSuffix({ v, device: MOBILE });
    const dPlacement = styleElementMegaMenuPlacement({ v, device: DESKTOP });
    const tPlacement = styleElementMegaMenuPlacement({ v, device: TABLET });
    const mPlacement = styleElementMegaMenuPlacement({ v, device: MOBILE });

    const settings = {
      mods,
      placement: {
        desktop: mods[DESKTOP] === "horizontal" ? dPlacement : "left-start",
        tablet: mods[TABLET] === "horizontal" ? tPlacement : "left-start",
        mobile: mods[MOBILE] === "horizontal" ? mPlacement : "left-start"
      },
      widths: {
        desktop: `${dW}${dWS}`,
        tablet: `${tW}${tWS}`,
        mobile: `${mW}${mWS}`
      }
    };

    return (
      <div
        className={className}
        data-settings={encodeURIComponent(JSON.stringify(settings))}
      >
        <MenuItemItems {...itemProps} />
      </div>
    );
  }

  renderDropDown() {
    if (!IS_PRO) {
      return null;
    }

    const { level, toolbarExtend, mMenu, meta } = this.props;
    const itemProps = this.makeSubcomponentProps({
      toolbarExtend,
      level,
      mMenu,
      meta,
      bindWithKey: "items",
      megaMenu: false
    });

    return <MenuItemItems {...itemProps} />;
  }

  renderSimple(v, vs, vd, content) {
    const { level, mMenu, mods } = this.props;
    const isMinimLevel = level < MAX_LEVEL_RENDER;
    const className = styleClassName(v, this.state, isMinimLevel);

    if (IS_PREVIEW) {
      return (
        <li className={className}>
          {this.renderLink(v, vs, vd, content)}
          {isMinimLevel &&
            (v.megaMenu === "off"
              ? this.renderDropDown(v, vs, vd)
              : this.renderMegaMenu(v, vs, vd))}
        </li>
      );
    }

    const { deviceMode: device } = getStore().getState().ui;
    const mode = getModeByDevice(mods, device);
    const toolbarConfig = toolbarConfigFn(level, mMenu);
    const sidebarConfig = sidebarConfigFn(level, mMenu);
    const clickOutsideExceptions = [
      ".brz-ed-sidebar",
      ".brz-ed-toolbar",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-fixed",
      ".brz-mega-menu",
      ".react-contexify",
      ...(TARGET === "WP"
        ? [
            ".media-modal", // class of the WP media modal
            ".media-modal-backdrop"
          ]
        : [])
    ];

    // don't need Popper for mobile and vertical mode
    if (device === MOBILE && mode === "vertical") {
      return (
        <ClickOutside
          exceptions={clickOutsideExceptions}
          onClickOutside={this.handleClickOutside}
        >
          <li className={className} onClick={this.handleClick}>
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarConfig,
                sidebarConfig
              )}
            >
              {this.renderLink(v, vs, vd, content)}
            </Toolbar>
            {isMinimLevel &&
              (v.megaMenu === "off"
                ? this.renderDropDown(v, vs, vd)
                : this.renderMegaMenu(v, vs, vd))}
          </li>
        </ClickOutside>
      );
    }

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleClickOutside}
      >
        <Manager>
          <Reference>
            {() => (
              <li
                ref={this.menuItem}
                className={className}
                onClick={this.handleClick}
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarConfig,
                    sidebarConfig
                  )}
                >
                  {this.renderLink(v, vs, vd, content)}
                </Toolbar>
                {isMinimLevel && v.megaMenu === "off" && this.renderDropDown()}
              </li>
            )}
          </Reference>
          {isMinimLevel &&
            v.megaMenu === "on" &&
            this.renderMegaMenu(v, vs, vd)}
        </Manager>
      </ClickOutside>
    );
  }

  renderMMenu(v, vs, vd, content) {
    const { level, mMenu } = this.props;
    const toolbarConfig = toolbarConfigFn(level, mMenu);
    const sidebarConfig = sidebarConfigFn(level, mMenu);
    const isMinimLevel = level < MAX_LEVEL_RENDER;
    const isDropDown = v.megaMenu === "off";

    if (IS_PREVIEW) {
      return (
        <li className={styleMmMenuClassName(v, isMinimLevel)}>
          {this.renderLink(v, vs, vd, content)}
          {isMinimLevel &&
            (isDropDown
              ? this.renderDropDown(v, vs, vd)
              : this.renderMegaMenu(v, vs, vd))}
        </li>
      );
    }

    return (
      <li
        ref={this.menuItem}
        className={styleMmMenuClassName(v, isMinimLevel, this.menuItem.current)}
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          {this.renderLink(v, vs, vd, content)}
        </Toolbar>
        {isMinimLevel && (
          <div>
            {isDropDown
              ? this.renderDropDown(v, vs, vd)
              : this.renderMegaMenu(v, vs, vd)}
          </div>
        )}
      </li>
    );
  }

  renderForEdit(v, vs, vd) {
    const { title, iconName, iconType } = v;
    const hasIcon = iconName && iconType;
    const content = (
      <>
        {hasIcon && this.renderIcon(v)}
        <span
          className="brz-span"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </>
    );

    return this.props.mMenu
      ? this.renderMMenu(v, vs, vd, content)
      : this.renderSimple(v, vs, vd, content);
  }
}

export default MenuItem;

const getModeByDevice = (mods, device) => mods[device];

export const getOpenedMegaMenu = () => openedMegaMenu;
