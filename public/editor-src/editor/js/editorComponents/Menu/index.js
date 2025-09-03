import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
import { merge } from "timm";
import ClickOutside from "visual/component/ClickOutside";
import ContextMenu from "visual/component/ContextMenu";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import Portal from "visual/component/Portal";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { wInMMenu } from "visual/config/columns";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { HamburgerIcon } from "visual/editorComponents/Menu/controls/HamburgerIcon";
import UIEvents from "visual/global/UIEvents";
import { isView } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { isPro } from "visual/utils/env";
import { applyFilter } from "visual/utils/filters";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { encodeToString } from "visual/utils/string";
import { styleElementMMenu, styleElementMenuMode } from "visual/utils/style2";
import { Wrapper } from "../tools/Wrapper";
import contextMenuConfig from "./contextMenu";
import { MenuPreviewMock } from "./controls/MenuPreviewMock";
import { NavContainer } from "./controls/NavContainer";
import defaultValue from "./defaultValue.json";
import * as sidebarClose from "./sidebarClose";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { styleMMenu, styleMenu, styleMenuContainer } from "./styles";
import * as toolbarClose from "./toolbarClose";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { itemsToSymbols, normalizeMenuItems, symbolsToItems } from "./utils";
import { isClonedSlide } from "./utils.common";

export default class Menu extends EditorComponent {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  static defaultProps = {
    extendParentToolbar: noop,
    meta: {}
  };
  nodeRef = React.createRef();
  mMenu = null;
  isPro = isPro(this.getGlobalConfig());

  static get componentId() {
    return "Menu";
  }

  getMeta(v) {
    const { meta } = this.props;
    const mMenu = styleElementMMenu({ v, device: DESKTOP });
    const tabletMMenu = styleElementMMenu({ v, device: TABLET });
    const mobileMMenu = styleElementMMenu({ v, device: MOBILE });
    const desktopW = mMenu === "on" ? wInMMenu : meta.desktopW;
    const desktopWNoSpacing =
      mMenu === "on" ? wInMMenu : meta.desktopWNoSpacing;
    const tabletW = tabletMMenu === "on" ? wInMMenu : meta.tabletW;
    const tabletWNoSpacing =
      tabletMMenu === "on" ? wInMMenu : meta.tabletWNoSpacing;
    const mobileW = mobileMMenu === "on" ? wInMMenu : meta.mobileW;
    const mobileWNoSpacing =
      mobileMMenu === "on" ? wInMMenu : meta.mobileWNoSpacing;

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

  hasMMenu() {
    const v = this.getValue();
    if (isView(this.props.renderContext)) {
      const mMenu = styleElementMMenu({ v, device: DESKTOP });
      const tabletMMenu = styleElementMMenu({ v, device: TABLET });
      const mobileMMenu = styleElementMMenu({ v, device: MOBILE });

      return mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on";
    }

    const device = this.getDeviceMode();
    return styleElementMMenu({ v, device }) === "on";
  }

  componentDidMount() {
    UIEvents.on("deviceMode.change", this.handleChange);

    const parentToolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true
      }
    );
    this.props.extendParentToolbar(parentToolbarExtend);

    if (this.hasMMenu()) {
      this.initMMenu();
    }
  }

  componentWillUpdate({ dbValue }) {
    const { mMenuPosition, menuSelected } = this.getValue();

    if (
      (dbValue.menuSelected && dbValue.menuSelected !== menuSelected) ||
      (dbValue.mMenuPosition && dbValue.mMenuPosition !== mMenuPosition)
    ) {
      this.destroyMMenu();
    }
  }

  componentDidUpdate() {
    if (this.hasMMenu()) {
      this.initMMenu();
    } else {
      this.destroyMMenu();
    }
  }

  componentWillUnmount() {
    if (this.hasMMenu()) {
      this.destroyMMenu();
    }
    UIEvents.off("deviceMode.change", this.handleChange);
  }

  handleChange = () => {
    this.forceUpdate();
  };

  getNode = () => {
    return this.nodeRef.current;
  };

  getDefaultValue() {
    return {
      ...super.getDefaultValue(),
      symbols: {}
    };
  }

  getDBValue() {
    const menusConfig = this.getGlobalConfig().menuData;

    if (menusConfig.length === 0) {
      return { ...this.props.dbValue, items: [] };
    }

    const { menuSelected: dbMenuSelected = null, symbols = {} } =
      this.props.dbValue || {};
    const menuSelected = dbMenuSelected || menusConfig[0].id;
    const menuConfig = menusConfig.find((menu) => menu.id === menuSelected);

    if (!menuConfig || menuConfig.items.length === 0) {
      return { ...this.props.dbValue, items: [] };
    }

    if (this.menuItemsCache === undefined) {
      this.menuItemsCache = {};
    }
    if (this.menuItemsCache[menuSelected] === undefined) {
      this.menuItemsCache[menuSelected] = normalizeMenuItems(menuConfig.items);
    }

    return {
      ...this.props.dbValue,
      menuSelected,
      items: symbolsToItems(this.menuItemsCache[menuSelected], symbols)
    };
  }

  handleValueChange(newValue, meta) {
    const { items } = newValue;
    let { ...finalValue } = newValue;

    if (meta.patch.items) {
      finalValue.symbols = {
        ...newValue.symbols,
        ...itemsToSymbols(items)
      };
    }

    const device = this.getDeviceMode();
    const dvk = (key) => defaultValueKey({ key, device, state: "normal" });
    const dvv = (key) => defaultValueValue({ key, device, v: newValue });

    const mMenuPositionTitle = dvk("mMenuPosition");
    const mMenuPositionValue = dvv(mMenuPositionTitle);

    if (meta.patch[mMenuPositionTitle]) {
      const patch = {
        ...finalValue,
        mMenuPosition: mMenuPositionValue
      };

      finalValue = merge(finalValue, patch);
    }

    super.handleValueChange(finalValue, meta);
  }

  handleTextChange = (mMenuTitle) => {
    this.patchValue({ mMenuTitle });
  };

  renderMMenuTitle(v) {
    const { mMenuTitle, stickyTitle, mMenuPosition } = v;
    const device = this.getDeviceMode();
    const isCloseDrawerIcon =
      defaultValueValue({ key: "closeDrawerIcon", device, v }) === "on";
    const className = classnames(
      "brz-mm-navbar",
      [`brz-mm-navbar-${mMenuPosition}`],
      {
        "brz-mm-navbar-sticky": stickyTitle === "on"
      }
    );

    return (
      <li className={className}>
        <a className="brz-a brz-mm-navbar__title">
          <TextEditor value={mMenuTitle} onChange={this.handleTextChange} />
        </a>
        {isCloseDrawerIcon && (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarClose, sidebarClose, {
              allowExtend: false
            })}
          >
            {({ ref }) => (
              <span className="brz-mm-close" ref={ref}>
                <ThemeIcon name="close-popup" type="editor" />
              </span>
            )}
          </Toolbar>
        )}
      </li>
    );
  }

  renderMenuForEdit({ v, vs, vd, id, ref }) {
    const { className: _className, items, menuSelected } = v;
    const hasMMenu = this.hasMMenu() && !!id;
    const styleClassName = hasMMenu
      ? this.css(
          `${this.getComponentId()}-mmenu`,
          `${this.getId()}-mmenu`,
          styleMMenu({
            v,
            vs,
            vd,
            store: this.getReduxStore(),
            contexts: this.getContexts()
          })
        )
      : this.css(
          `${this.getComponentId()}-menu`,
          `${this.getId()}-menu`,
          styleMenu({
            v,
            vs,
            vd,
            store: this.getReduxStore(),
            contexts: this.getContexts()
          })
        );

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        menuSelected,
        mMenu: hasMMenu,
        meta: this.getMeta(v),
        mods: {
          [DESKTOP]: styleElementMenuMode({ v, device: DESKTOP }),
          [TABLET]: styleElementMenuMode({ v, device: TABLET }),
          [MOBILE]: styleElementMenuMode({ v, device: MOBILE })
        },
        getParent: this.getNode,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtend,
          sidebarExtend,
          { allowExtend: false }
        )
      }
    });
    const className = classnames(
      "brz-menu",
      "brz-menu__editor",
      {
        "brz-menu__mmenu": hasMMenu,
        "brz-menu--has-dropdown":
          hasMMenu && items.some(({ value: { items } }) => items.length)
      },
      _className,
      styleClassName,
      hasMMenu && this.getMMenuClassNames()
    );

    const props = {
      className,
      ...(id && { id })
    };

    return (
      <NavContainer {...props} ref={ref}>
        <ul className="brz-menu__ul">
          {hasMMenu && this.renderMMenuTitle(v)}
          <EditorArrayComponent {...itemsProps} />
        </ul>
      </NavContainer>
    );
  }

  renderMenuForView(v, vs, vd, id) {
    const { className: _className, items, menuSelected } = v;
    const hasMMenu = this.hasMMenu() && !!id;
    const styleClassName = hasMMenu
      ? this.css(
          `${this.getComponentId()}-mmenu`,
          `${this.getId()}-mmenu`,
          styleMMenu({
            v,
            vs,
            vd,
            store: this.getReduxStore(),
            contexts: this.getContexts()
          })
        )
      : this.css(
          `${this.getComponentId()}-menu`,
          `${this.getId()}-menu`,
          styleMenu({
            v,
            vs,
            vd,
            store: this.getReduxStore(),
            contexts: this.getContexts()
          })
        );
    const mods = {
      [DESKTOP]: styleElementMenuMode({ v, device: DESKTOP }),
      [TABLET]: styleElementMenuMode({ v, device: TABLET }),
      [MOBILE]: styleElementMenuMode({ v, device: MOBILE })
    };
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        menuSelected,
        mods,
        mMenu: hasMMenu,
        meta: this.getMeta(v),
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtend,
          sidebarExtend,
          { allowExtend: false }
        )
      }
    });
    const className = classnames(
      "brz-menu__preview",
      {
        "brz-menu__mmenu": hasMMenu,
        "brz-menu--has-dropdown":
          hasMMenu && items.some(({ value: { items } }) => items.length)
      },
      _className,
      styleClassName,
      hasMMenu && this.getMMenuClassNames()
    );
    const attr = {
      "data-mods": encodeToString(mods)
    };

    const props = {
      className,
      attr,
      wrapInPlaceholder: true,
      ...(id && { id })
    };

    return (
      <NavContainer {...props}>
        <EditorArrayComponent {...itemsProps} />
        <MenuPreviewMock menuId={menuSelected} />
      </NavContainer>
    );
  }

  renderMMenu({ v, vs, vd, ref }) {
    const {
      menuSelected,
      mMenuPosition,
      mMenuAnimation,
      mMenuSize,
      tabletMMenuSize,
      mobileMMenuSize
    } = v;

    return (
      <>
        <Portal
          key={`${menuSelected}-${mMenuPosition}`}
          node={document.body}
          className="brz-ed-mmenu-portal"
        >
          <div className="brz-ed-mmenu-portal__menu brz-d-none" ref={ref}>
            {this.renderMenuForEdit({ v, vs, vd, id: this.getId() })}
          </div>
        </Portal>
        <HamburgerIcon
          onOpen={this.openMMenu}
          animation={mMenuAnimation}
          size={mMenuSize}
          mobileSize={mobileMMenuSize}
          tabletSize={tabletMMenuSize}
        />
      </>
    );
  }

  renderErrors(v) {
    const config = this.getGlobalConfig();
    const { menuData: menusConfig, elements } = config;
    let errMsg;
    const _isView = isView(this.props.renderContext);

    if (menusConfig.length === 0) {
      const { menu } = elements ?? {};
      const { onOpen, createMenuLabel = t("Create a menu") } = menu ?? {};

      errMsg = !_isView && (
        <span className="brz-a" onClick={onOpen}>
          {createMenuLabel}
        </span>
      );
    }

    if (!errMsg) {
      const selectedMenu = menusConfig.find(
        (menu) => menu.id === v.menuSelected
      );

      if (!selectedMenu) {
        errMsg = t("Select a menu from the element options");
      }
    }

    return errMsg && <div className="brz-menu__error">{errMsg}</div>;
  }

  renderForEdit(v, vs, vd) {
    const errors = this.renderErrors(v);

    if (errors) {
      return errors;
    }

    const clickOutsideExceptions = [
      ".brz-ed-toolbar",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-sidebar__right",
      ".brz-menu",
      ".brz-menu__container",
      ".brz-ed-fixed",
      ".media-modal",
      ".brz-ed-eyeDropper"
    ];
    const className = classnames(
      "brz-menu__container",
      this.css(
        `${this.getComponentId()}-menu-container`,
        `${this.getId()}-menu-container`,
        styleMenuContainer({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.closeMMenu}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
                {({ ref: contextMenuRef }) => {
                  const ref = (el) => {
                    attachRefs(el, [
                      toolbarRef,
                      cssRef,
                      this.nodeRef,
                      contextMenuRef
                    ]);
                  };

                  return (
                    <Wrapper
                      {...this.makeWrapperProps({
                        className
                      })}
                    >
                      {this.hasMMenu()
                        ? this.renderMMenu({ v, vs, vd, ref })
                        : this.renderMenuForEdit({ v, vs, vd, ref })}
                    </Wrapper>
                  );
                }}
              </ContextMenu>
            )}
          </CustomCSS>
        )}
      </ClickOutside>
    );
  }

  renderForView(v, vs, vd) {
    const errors = this.renderErrors(v);

    if (errors) {
      return null;
    }

    const {
      mMenuTitle,
      mMenuPosition,
      stickyTitle,
      closeDrawerIcon,
      mobileCloseDrawerIcon,
      tabletCloseDrawerIcon,
      customCSS,
      mMenuAnimation,
      mMenuSize,
      tabletMMenuSize,
      mobileMMenuSize
    } = v;

    const isSlider = this.props.meta?.section?.isSlider;
    const closingIcon = encodeToString({
      desktop: closeDrawerIcon,
      tablet: tabletCloseDrawerIcon || closeDrawerIcon,
      mobile: mobileCloseDrawerIcon || closeDrawerIcon
    });
    const id = this.getId();
    const htmlId = `${id}_${makePlaceholder({ content: "{{ random_id }}", attr: { key: "menu" } })}`;
    const hasMMenu = this.hasMMenu();
    const mMenuProps = hasMMenu
      ? {
          "data-mmenu-id": `#${htmlId}`,
          "data-mmenu-position": `position-${mMenuPosition}`,
          "data-mmenu-title": mMenuTitle,
          "data-mmenu-stickytitle": stickyTitle,
          "data-mmenu-isslider": isSlider,
          "data-mmenu-closingicon": closingIcon
        }
      : {};

    const className = classnames(
      "brz-menu__container",
      this.css(
        `${this.getComponentId()}-menu-container`,
        `${id}-menu-container`,
        styleMenuContainer({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <CustomCSS selectorName={id} css={customCSS}>
        <div className={className} {...mMenuProps}>
          {this.renderMenuForView(v, vs, vd)}
          {hasMMenu && (
            <>
              <HamburgerIcon
                animation={mMenuAnimation}
                size={mMenuSize}
                mobileSize={mobileMMenuSize}
                tabletSize={tabletMMenuSize}
              />
              {this.isPro && this.renderMenuForView(v, vs, vd, htmlId)}
            </>
          )}
        </div>
      </CustomCSS>
    );
  }

  // MMenu plugin
  getMMenu() {
    return applyFilter("getLibs", {}).MMenu;
  }

  initMMenu() {
    const MMenu = this.getMMenu();
    const { items = [], mMenuPosition, stickyTitle } = this.getValue();
    const isSlider = this.props.meta?.section?.isSlider;

    if (isSlider && isClonedSlide(this.getNode())) return;

    if (this.mMenu || !MMenu || items.length === 0) {
      return;
    }

    const options = {
      navbar: {
        add: false,
        sticky: stickyTitle === "on"
      },
      extensions: [
        "theme-dark",
        "pagedim-black",
        "border-full",
        "position-front",
        `position-${mMenuPosition}`
      ],
      slidingSubmenus: false
    };
    const config = {
      offCanvas: {
        menu: {
          insertSelector: "#brz-ed-root"
        },
        page: {
          wrapIfNeeded: false,
          selector: "#brz-ed-root"
        }
      }
    };

    this.mMenu = new MMenu(`#${this.getId()}`, options, config);
  }

  destroyMMenu() {
    if (this.mMenu) {
      this.mMenu.node.menu.remove();
      this.mMenu = null;
    }
  }

  openMMenu = () => {
    const MMenu = this.getMMenu();

    if (!this.mMenu && MMenu) {
      this.initMMenu();
    }

    const menuAPI = this.mMenu?.API;

    if (menuAPI) {
      menuAPI.open();
    }
  };

  closeMMenu = () => {
    const menuAPI = this.mMenu?.API;

    if (menuAPI) {
      menuAPI.close();
      UIEvents.emit("mMenu:close");
    }
  };

  getMMenuClassNames() {
    if (!this.mMenu?.node) {
      return "";
    }

    // cssStyle generate new classNames
    // when MMenu initialized he added the plugin classNames
    // we need to add the plugin classNames back
    let classNames = [];
    const currentClassList = this.mMenu.node.menu.classList;

    currentClassList.forEach((className) => {
      if (/brz-mm-menu/.test(className)) {
        classNames.push(className);
      }
    });

    return classNames;
  }
}
