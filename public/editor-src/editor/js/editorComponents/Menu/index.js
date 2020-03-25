import React, { useState } from "react";
import _ from "underscore";
import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import ThemeIcon from "visual/component/ThemeIcon";
import Portal from "visual/component/Portal";
import { setIds } from "visual/utils/models";
import TextEditor from "visual/editorComponents/Text/Editor";
import ClickOutside from "visual/component/ClickOutside";
import { PromptThirdParty } from "visual/component/Prompts/PromptThirdParty";
import { getStore } from "visual/redux/store";
import { pageSelector } from "visual/redux/selectors";
import { applyFilter } from "visual/utils/filters";
import defaultValue from "./defaultValue.json";
import * as toolbarExtend from "./toolbarExtend";
import * as sidebarExtend from "./sidebarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import {
  styleClassName,
  styleCSSVars,
  styleMenuClassName,
  styleMenuCSSVars
} from "./styles";
import { t } from "visual/utils/i18n";

export default class Menu extends EditorComponent {
  static get componentId() {
    return "Menu";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: _.noop
  };

  mMenu = null;

  componentDidMount() {
    const parentToolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true
      }
    );
    this.props.extendParentToolbar(parentToolbarExtend);

    const { mMenu, tabletMMenu, mobileMMenu } = this.getValue();

    if (mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on") {
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
    const { mMenu, tabletMMenu, mobileMMenu } = this.getValue();

    if (mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on") {
      this.initMMenu();
    } else {
      this.destroyMMenu();
    }
  }

  componentWillUnmount() {
    const { mMenu, tabletMMenu, mobileMMenu } = this.getValue();

    if (mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on") {
      this.destroyMMenu();
    }
  }

  getDBValue() {
    const menusConfig = Config.get("menuData");

    if (menusConfig.length === 0) {
      return { ...this.props.dbValue, items: [] };
    }

    const { menuSelected: dbMenuSelected = null, symbols = {} } =
      this.props.dbValue || {};
    const menuSelected = dbMenuSelected || menusConfig[0].id;
    const menuConfig = menusConfig.find(menu => menu.id === menuSelected);

    if (!menuConfig || menuConfig.items.length === 0) {
      return { ...this.props.dbValue, items: [] };
    }

    if (this.menuItemsCache === undefined) {
      this.menuItemsCache = {};
    }
    if (this.menuItemsCache[menuSelected] === undefined) {
      this.menuItemsCache[menuSelected] = setIds(menuConfig.items);
    }

    return {
      ...this.props.dbValue,
      menuSelected,
      items: setMenuItemsDBValue(this.menuItemsCache[menuSelected])
    };

    function setMenuItemsDBValue(items) {
      return items.map(item => ({
        ...item,
        value: {
          ...item.value,
          ...symbols[item.value.id],
          items: setMenuItemsDBValue(item.value.items)
        }
      }));
    }
  }

  handleValueChange(newValue, meta) {
    /* eslint-disable no-unused-vars */
    const { items, ...finalValue } = newValue;
    /* eslint-enabled no-unused-vars */

    if (meta.patch.items) {
      finalValue.symbols = {
        ...newValue.symbols,
        ...itemsToSymbols(newValue.items)
      };
    }

    super.handleValueChange(finalValue, meta);

    function itemsToSymbols(items) {
      return items.reduce(
        (acc, item) => ({
          ...acc,
          [item.value.id]: _.omit(
            item.value,
            "id",
            "title",
            "url",
            "_id",
            "items"
          ),
          ...(item.value.items.length > 0
            ? itemsToSymbols(item.value.items)
            : {})
        }),
        {}
      );
    }
  }

  handleTextChange = mMenuTitle => {
    this.patchValue({ mMenuTitle });
  };

  renderMMenuTitle(v) {
    const { mMenuTitle } = v;

    return (
      <li className="brz-mm-navbar">
        <a className="brz-a brz-mm-navbar__title">
          <TextEditor value={mMenuTitle} onChange={this.handleTextChange} />
        </a>
      </li>
    );
  }

  renderMenu(v, id) {
    const { mMenu, tabletMMenu, mobileMMenu } = v;
    const hasMMenu =
      (mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on") && id;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        mMenu: hasMMenu,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtend,
          sidebarExtend,
          {
            allowExtend: false
          }
        )
      }
    });

    return (
      <nav
        id={id}
        className={styleMenuClassName(v, hasMMenu)}
        style={styleMenuCSSVars(v)}
      >
        <ul className="brz-menu__ul">
          {IS_EDITOR && hasMMenu && this.renderMMenuTitle(v)}
          <EditorArrayComponent {...itemsProps} />
        </ul>
      </nav>
    );
  }

  renderMMenu(v) {
    const { menuSelected, mMenuPosition } = v;

    return (
      <React.Fragment>
        <Portal
          key={`${menuSelected}-${mMenuPosition}`}
          node={document.body}
          className="brz-ed-mmenu-portal"
        >
          <div className="brz-ed-mmenu-portal__menu brz-d-none">
            {this.renderMenu(v, this.getId())}
          </div>
        </Portal>

        {this.renderMenu(v)}

        <div className="brz-mm-menu__icon" onClick={this.openMMenu}>
          <ThemeIcon name="menu-3" type="editor" />
        </div>
      </React.Fragment>
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
      const selectedMenu = menusConfig.find(menu => menu.id === v.menuSelected);

      if (!selectedMenu) {
        errMsg = t("Select a menu from the element options");
      }
    }

    return errMsg && <div className="brz-menu__error">{errMsg}</div>;
  }

  renderForEdit(_v) {
    const errors = this.renderErrors(_v);

    if (errors) {
      return errors;
    }

    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`,

      _v.subMenuColorPalette && `${_v.subMenuColorPalette}__subMenuColor`,
      _v.subMenuHoverColorPalette &&
        `${_v.subMenuHoverColorPalette}__subMenuHoverColor`,

      _v.subMenuBgColorPalette && `${_v.subMenuBgColorPalette}__subMenuBgColor`,
      _v.subMenuHoverBgColorPalette &&
        `${_v.subMenuHoverBgColorPalette}__subMenuHoverBgColor`,
      _v.subMenuBorderColorPalette &&
        `${_v.subMenuBorderColorPalette}__subMenuBorderColor`,

      _v.subMenuFontStyle && `${_v.subMenuFontStyle}__subMenuFsDesktop`,
      _v.tabletSubMenuFontStyle &&
        `${_v.tabletSubMenuFontStyle}__subMenuFsTablet`,
      _v.mobileSubMenuFontStyle &&
        `${_v.mobileSubMenuFontStyle}__subMenuFsMobile`,

      _v.mMenuColorPalette && `${_v.mMenuColorPalette}__mMenuColor`,
      _v.mMenuBgColorPalette && `${_v.mMenuBgColorPalette}__mMenuBgColor`,
      _v.mMenuBorderColorPalette &&
        `${_v.mMenuBorderColorPalette}__mMenuBorderColor`,
      _v.mMenuHoverColorPalette &&
        `${_v.mMenuHoverColorPalette}__mMenuHoverColor`,

      _v.mMenuIconColorPalette && `${_v.mMenuIconColorPalette}__mMenuIconColor`,
      _v.tabletMMenuIconColorPalette &&
        `${_v.tabletMMenuIconColorPalette}__tabletMMenuIconColor`,
      _v.mobileMMenuIconColorPalette &&
        `${_v.mobileMMenuIconColorPalette}__mobileMMenuIconColor`,

      _v.mMenuFontStyle && `${_v.mMenuFontStyle}__mMenuFsDesktop`,
      _v.tabletMMenuFontStyle && `${_v.tabletMMenuFontStyle}__mMenuFsTablet`,
      _v.mobileMMenuFontStyle && `${_v.mobileMMenuFontStyle}__mMenuFsMobile`
    ]);

    const { mMenu, tabletMMenu, mobileMMenu } = v;
    const hasMMenu =
      mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on";

    const clickOutsideExceptions = [
      ".brz-ed-toolbar",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-sidebar__right",
      ".brz-menu",
      ".brz-menu__container",
      ".brz-ed-fixed"
    ];

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.closeMMenu}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={styleClassName(v)} style={styleCSSVars(v)}>
            {hasMMenu ? this.renderMMenu(v) : this.renderMenu(v)}
          </div>
        </CustomCSS>
      </ClickOutside>
    );
  }

  renderForView(_v) {
    const errors = this.renderErrors(_v);

    if (errors) {
      return null;
    }

    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`,
      _v.subMenuColorPalette && `${_v.subMenuColorPalette}__subMenuColor`,
      _v.subMenuHoverColorPalette &&
        `${_v.subMenuHoverColorPalette}__subMenuHoverColor`,
      _v.subMenuBgColorPalette && `${_v.subMenuBgColorPalette}__subMenuBgColor`,
      _v.subMenuHoverBgColorPalette &&
        `${_v.subMenuHoverBgColorPalette}__subMenuHoverBgColor`,
      _v.subMenuBorderColorPalette &&
        `${_v.subMenuBorderColorPalette}__subMenuBorderColor`,
      _v.subMenuFontStyle && `${_v.subMenuFontStyle}__subMenuFsDesktop`,
      _v.tabletSubMenuFontStyle &&
        `${_v.tabletSubMenuFontStyle}__subMenuFsTablet`,
      _v.mobileSubMenuFontStyle &&
        `${_v.mobileSubMenuFontStyle}__subMenuFsMobile`,
      _v.mMenuColorPalette && `${_v.mMenuColorPalette}__mMenuColor`,
      _v.mMenuBgColorPalette && `${_v.mMenuBgColorPalette}__mMenuBgColor`,
      _v.mMenuBorderColorPalette &&
        `${_v.mMenuBorderColorPalette}__mMenuBorderColor`,
      _v.mMenuHoverColorPalette &&
        `${_v.mMenuHoverColorPalette}__mMenuHoverColor`,
      _v.mMenuIconColorPalette && `${_v.mMenuIconColorPalette}__mMenuIconColor`,
      _v.tabletMMenuIconColorPalette &&
        `${_v.tabletMMenuIconColorPalette}__tabletMMenuIconColor`,
      _v.mobileMMenuIconColorPalette &&
        `${_v.mobileMMenuIconColorPalette}__mobileMMenuIconColor`,
      _v.mMenuFontStyle && `${_v.mMenuFontStyle}__mMenuFsDesktop`,
      _v.tabletMMenuFontStyle && `${_v.tabletMMenuFontStyle}__mMenuFsTablet`,
      _v.mobileMMenuFontStyle && `${_v.mobileMMenuFontStyle}__mMenuFsMobile`
    ]);

    const { mMenu, mMenuTitle, tabletMMenu, mobileMMenu, mMenuPosition } = v;
    const hasMMenu =
      mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on";

    const mMenuProps = hasMMenu
      ? {
          "data-mmenu-id": `#${this.getId()}`,
          "data-mmenu-position": `position-${mMenuPosition}`,
          "data-mmenu-title": mMenuTitle
        }
      : {};

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div
          className={styleClassName(v)}
          style={styleCSSVars(v)}
          {...mMenuProps}
        >
          {this.renderMenu(v)}
          {hasMMenu && (
            <React.Fragment>
              <div className="brz-mm-menu__icon">
                <ThemeIcon name="menu-3" type="editor" />
              </div>
              {this.renderMenu(v, this.getId())}
            </React.Fragment>
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
    const { items = [], mMenuPosition } = this.getValue();

    if (this.mMenu || !MMenu || items.length === 0) {
      return;
    }

    const options = {
      navbar: {
        add: false
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
        onClick={e => {
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
