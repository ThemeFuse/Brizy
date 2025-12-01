import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import { Manager, Popper, Reference } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import { DraggableOverlay } from "visual/component/DraggableOverlay";
import Link from "visual/component/Link";
import Portal from "visual/component/Portal";
import { SortableZIndex } from "visual/component/Sortable/SortableZIndex";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { isPro } from "visual/utils/env";
import { getBlockData } from "visual/utils/models";
import { attachRef } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import {
  styleElementMegaMenuPlacement,
  styleElementMegaMenuWidth,
  styleElementMegaMenuWidthSuffix
} from "visual/utils/style2";
import { getParentMegaMenuUid } from "../utils.common";
import { IconContainer } from "./controls/Icon";
import { MegaMenuContainer } from "./controls/MegaMenu";
import defaultValue from "./defaultValue.json";
import MenuItemItems from "./items";
import { calculateMeta } from "./meta";
import sidebarConfigFn from "./sidebar";
import { styleClassName, styleMegaMenu, styleMmMenuClassName } from "./styles";
import toolbarConfigFn from "./toolbar";
import toolbarExtendFn from "./toolbarExtend";

let openedMegaMenu = null;

class MenuItem extends EditorComponent {
  static defaultProps = {
    defaultValue: {},
    level: 0,
    mMenu: false,
    menuSelected: undefined,
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
  megaMenuRef = React.createRef();
  isPro = isPro(this.getGlobalConfig());

  static get componentId() {
    return ElementTypes.MenuItem;
  }

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

  insideMegaMenu = (target) => {
    const node = this.megaMenuRef.current;

    if (this.state.isOpen && node) {
      // first level
      const inFirstLevel = node.contains(target);

      if (inFirstLevel) {
        return true;
      }

      // deep level
      const v = this.getValue2().v;

      // Inside Popup
      const popupId = target.closest(".brz-popup2")?.id;
      if (popupId) {
        return getBlockData(v, popupId) !== null;
      }

      const parentMegaMenuId = getParentMegaMenuUid(target);

      // Mega Menu inside Mega Menu
      if (parentMegaMenuId) {
        const navItemSelector = `[data-menu-item-id=${parentMegaMenuId}]`;

        // Mega menu in mega menu
        if (node.querySelector(navItemSelector)) {
          return true;
        }

        // Mega Menu inside popup inside MegaMenu
        const popupId = document
          .querySelector(navItemSelector)
          .closest(".brz-popup2")?.id;

        if (popupId) {
          return getBlockData(v, popupId) !== null;
        }
      }
    }

    return false;
  };

  renderIcon(v) {
    const { iconName, iconType, iconFilename, id } = v;
    const hasIcon = iconName && iconType;
    const { mMenu } = this.props;

    return hasIcon ? (
      <IconContainer
        itemId={id}
        wrapInPlaceholder={isView(this.props.renderContext) && this.isPro}
        iconName={iconName}
        iconType={iconType}
        iconFilename={iconFilename}
        mMenu={mMenu}
      />
    ) : null;
  }

  renderLink(v, vs, vd, content, ref) {
    const { target, classes, attrTitle } = v;
    let type = "";
    let href = "";

    let props = {
      href,
      type,
      target: target === "_blank" ? "on" : "off",
      className: classes,
      attr: {
        title: attrTitle
      },
      onDragStart(e) {
        e.preventDefault();
        return false;
      },
      draggable: "false"
    };

    return (
      <Link {...props} ref={ref}>
        {content}
      </Link>
    );
  }

  renderMegaMenu(v, vs, vd) {
    if (!this.isPro) {
      return null;
    }

    return isEditor(this.props.renderContext)
      ? this.renderMegaMenuForEdit(v, vs, vd)
      : this.renderMegaMenuForView(v, vs, vd);
  }

  renderMegaMenuForEdit(v, vs, vd) {
    const { mMenu, level, getParent, mods, meta } = this.props;
    const device = this.getDeviceMode();
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
      this.css(
        this.getComponentId(),
        this.getId(),
        styleMegaMenu({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
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
      "brz",
      "brz-mega-menu__portal",
      "brz-mega-menu__portal--opened",
      `brz-mega-menu__portal--${device}`,
      { "brz-mega-menu__portal-inPopup": meta.sectionPopup2 },
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
            <SortableZIndex zIndex={2} renderContext={this.props.renderContext}>
              <div
                className={portalClassName}
                ref={(el) => {
                  attachRef(el, this.megaMenuRef);
                  attachRef(el, ref);
                }}
                style={{
                  ...style,
                  maxWidth,
                  width: "100%"
                }}
                data-mega-menu-uid={this.getId()}
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
    const { mMenu, level, mods, meta } = this.props;
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
      "brz brz-mega-menu__portal",
      { "brz-mega-menu__portal-inPopup": meta.sectionPopup2 },
      this.css(
        this.getComponentId(),
        this.getId(),
        styleMegaMenu({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
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

  renderDropDown(v) {
    if (!this.isPro) {
      return null;
    }

    const { level, toolbarExtend, mMenu, meta, menuSelected, mods } =
      this.props;
    const itemProps = this.makeSubcomponentProps({
      toolbarExtend,
      level,
      mMenu,
      meta,
      mods,
      menuSelected,
      itemId: v.id,
      bindWithKey: "items",
      megaMenu: false
    });

    return <MenuItemItems {...itemProps} />;
  }

  renderSimpleForEdit(v, vs, vd, content) {
    const { level, mMenu, mods } = this.props;
    const className = styleClassName(v, this.state, this.props.renderContext);
    const device = this.getDeviceMode();
    const mode = getModeByDevice(mods, device);
    const toolbarConfig = toolbarConfigFn(level, mMenu);
    const sidebarConfig = sidebarConfigFn(level, mMenu);
    const clickOutsideExceptions = [
      ".brz-ed-sidebar",
      ".brz-ed-toolbar",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-fixed",
      ".brz-portal-forms__select",
      ".brz-mm-menu_opened",
      ".brz-ed-eyeDropper",
      this.insideMegaMenu,
      ".react-contexify",
      ".brz-context-menu__root",
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
          {({ ref }) => (
            <li className={className} onClick={this.handleClick} ref={ref}>
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarConfig,
                  sidebarConfig
                )}
              >
                {({ ref }) => this.renderLink(v, vs, vd, content, ref)}
              </Toolbar>
              {v.megaMenu === "off"
                ? this.renderDropDown(v, vs, vd)
                : this.renderMegaMenu(v, vs, vd)}
            </li>
          )}
        </ClickOutside>
      );
    }

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleClickOutside}
      >
        {({ ref }) => (
          <Manager>
            <Reference>
              {() => (
                <li
                  data-menu-item-id={this.getId()}
                  ref={(el) => {
                    attachRef(el, ref);
                    attachRef(el, this.menuItem);
                  }}
                  className={className}
                  onClick={this.handleClick}
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarConfig,
                      sidebarConfig
                    )}
                  >
                    {({ ref }) => this.renderLink(v, vs, vd, content, ref)}
                  </Toolbar>
                  {v.megaMenu === "off" && this.renderDropDown(v, vs, vd)}
                </li>
              )}
            </Reference>
            {v.megaMenu === "on" && this.renderMegaMenu(v, vs, vd)}
          </Manager>
        )}
      </ClickOutside>
    );
  }

  renderMMenuForEdit(v, vs, vd, content) {
    const { level, mMenu } = this.props;
    const toolbarConfig = toolbarConfigFn(level, mMenu);
    const sidebarConfig = sidebarConfigFn(level, mMenu);

    const isDropDown = v.megaMenu === "off";

    return (
      <li
        ref={this.menuItem}
        className={styleMmMenuClassName(
          v,
          this.menuItem.current,
          this.props.renderContext
        )}
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          {({ ref }) => this.renderLink(v, vs, vd, content, ref)}
        </Toolbar>
        {isDropDown ? (
          <div>{this.renderDropDown(v, vs, vd)}</div>
        ) : (
          <div>{this.renderMegaMenu(v, vs, vd)}</div>
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
      ? this.renderMMenuForEdit(v, vs, vd, content)
      : this.renderSimpleForEdit(v, vs, vd, content);
  }

  renderForView(v, vs, vd) {
    const { megaMenu, id } = v;
    const item =
      megaMenu === "on" ? (
        <MegaMenuContainer itemId={id} wrapInPlaceholder={this.isPro}>
          {this.renderMegaMenu(v, vs, vd)}
        </MegaMenuContainer>
      ) : (
        this.renderDropDown(v, vs, vd)
      );

    return (
      <>
        {this.renderIcon(v)}
        {item}
      </>
    );
  }
}

export default MenuItem;

const getModeByDevice = (mods, device) => mods[device];

export const getOpenedMegaMenu = () => openedMegaMenu;
