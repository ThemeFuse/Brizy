import classnames from "classnames";
import React, { useState } from "react";
import { merge } from "timm";
import _ from "underscore";
import ClickOutside from "visual/component/ClickOutside";
import ContextMenu from "visual/component/ContextMenu";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import Portal from "visual/component/Portal";
import { PromptThirdParty } from "visual/component/Prompts/PromptThirdParty";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { wInMMenu } from "visual/config/columns";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Config from "visual/global/Config";
import UIEvents from "visual/global/UIEvents";
import { pageSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { applyFilter } from "visual/utils/filters";
import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { encodeToString } from "visual/utils/string";
import { styleElementMMenu, styleElementMenuMode } from "visual/utils/style2";
import { Wrapper } from "../tools/Wrapper";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import * as sidebarClose from "./sidebarClose";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { styleMenu, styleMenuContainer, styleMMenu } from "./styles";
import * as toolbarClose from "./toolbarClose";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { itemsToSymbols, normalizeMenuItems, symbolsToItems } from "./utils";
import { isClonedSlide } from "./utils.common";
import { MenuPreviewMock } from "./controls/MenuPreviewMock";
import { NavContainer } from "./controls/NavContainer";
import { makePlaceholder } from "visual/utils/dynamicContent";

const IS_PRO = Config.get("pro");

export default class Menu extends EditorComponent {
  static get componentId() {
    return "Menu";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  static defaultProps = {
    extendParentToolbar: _.noop,
    meta: {}
  };

  nodeRef = React.createRef();

  mMenu = null;

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

  getDeviceMode() {
    return getStore().getState().ui.deviceMode;
  }

  hasMMenu() {
    const v = this.getValue();

    if (IS_PREVIEW) {
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
    const menusConfig = Config.get("menuData");

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
            <span className="brz-mm-close">
              <ThemeIcon name="close-popup" type="editor" />
            </span>
          </Toolbar>
        )}
      </li>
    );
  }

  renderMenuForEdit(v, vs, vd, id) {
    const { className: _className, items, menuSelected } = v;
    const hasMMenu = this.hasMMenu() && !!id;
    const styleClassName = hasMMenu
      ? css(
          `${this.getComponentId()}-mmenu`,
          `${this.getId()}-mmenu`,
          styleMMenu(v, vs, vd)
        )
      : css(
          `${this.getComponentId()}-menu`,
          `${this.getId()}-menu`,
          styleMenu(v, vs, vd)
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
      <NavContainer {...props}>
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
      ? css(
          `${this.getComponentId()}-mmenu`,
          `${this.getId()}-mmenu`,
          styleMMenu(v, vs, vd)
        )
      : css(
          `${this.getComponentId()}-menu`,
          `${this.getId()}-menu`,
          styleMenu(v, vs, vd)
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

  renderMMenu(v, vs, vd) {
    const { menuSelected, mMenuPosition } = v;

    return (
      <>
        <Portal
          key={`${menuSelected}-${mMenuPosition}`}
          node={document.body}
          className="brz-ed-mmenu-portal"
        >
          <div className="brz-ed-mmenu-portal__menu brz-d-none">
            {this.renderMenuForEdit(v, vs, vd, this.getId())}
          </div>
        </Portal>

        <div className="brz-mm-menu__icon" onClick={this.openMMenu}>
          <ThemeIcon name="menu-3" type="editor" />
        </div>
      </>
    );
  }

  renderErrors(v) {
    const menusConfig = Config.get("menuData");
    let errMsg;

    if (menusConfig.length === 0) {
      const dashboardNavMenu = Config.get("urls").dashboardNavMenu;

      if (TARGET === "WP") {
        errMsg = (
          <>
            <a
              className="brz-a"
              href={dashboardNavMenu}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Create a menu")}
            </a>
            {t("in your WordPress admin")}
          </>
        );
      } else {
        errMsg = (
          <CloudCreateMenuButton>{t("Create a menu")}</CloudCreateMenuButton>
        );
      }
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
      css(
        `${this.getComponentId()}-menu-container`,
        `${this.getId()}-menu-container`,
        styleMenuContainer(v, vs, vd)
      )
    );

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.closeMMenu}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            <Wrapper
              {...this.makeWrapperProps({
                className,
                ref: this.nodeRef
              })}
            >
              {this.hasMMenu()
                ? this.renderMMenu(v, vs, vd)
                : this.renderMenuForEdit(v, vs, vd)}
            </Wrapper>
          </ContextMenu>
        </CustomCSS>
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
      customCSS
    } = v;

    const isSlider = this.props.meta?.section?.isSlider;
    const closingIcon = encodeToString({
      desktop: closeDrawerIcon,
      tablet: tabletCloseDrawerIcon || closeDrawerIcon,
      mobile: mobileCloseDrawerIcon || closeDrawerIcon
    });
    const id = this.getId();
    const htmlId = `${id}-${makePlaceholder({ content: "{{ random_id }}", attr: { key: "menu" } })}`;
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
      css(
        `${this.getComponentId()}-menu-container`,
        `${id}-menu-container`,
        styleMenuContainer(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={id} css={customCSS}>
        <div className={className} {...mMenuProps}>
          {this.renderMenuForView(v, vs, vd)}
          {hasMMenu && (
            <>
              <div className="brz-mm-menu__icon">
                <ThemeIcon name="menu-3" type="editor" />
              </div>
              {IS_PRO && this.renderMenuForView(v, vs, vd, htmlId)}
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

function CloudCreateMenuButton({ children }) {
  if (IS_PREVIEW) {
    return null;
  }

  const [opened, setOpened] = useState(false);
  const siteUrl = Config.get("urls").site;
  const projectId = Config.get("project").id;
  const pageId = pageSelector(getStore().getState()).id;
  let iframeSrc = `${siteUrl}/projects/${projectId}/settings?page_id=${pageId}`;

  return (
    <>
      <a
        className="brz-a"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setOpened(true);
        }}
      >
        {children}
      </a>
      <PromptThirdParty
        iframeSrc={iframeSrc}
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </>
  );
}
