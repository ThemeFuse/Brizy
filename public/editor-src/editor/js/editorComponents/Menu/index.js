import React from "react";
import _ from "underscore";
import jQuery from "jquery";
import "jquery.mmenu";
import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import ThemeIcon from "visual/component/ThemeIcon";
import Portal from "visual/component/Portal";
import { setIds } from "visual/utils/models";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as parentToolbarExtendConfig from "./parentToolbarExtend";
import {
  styleClassName,
  styleCSSVars,
  styleMenuClassName,
  styleMenuCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";
import { printf } from "visual/utils/string";
import { t } from "visual/utils/i18n";
import TextEditor from "visual/editorComponents/Text/Editor";
import ClickOutside from "visual/component/ClickOutside";

export default class Menu extends EditorComponent {
  static get componentId() {
    return "Menu";
  }

  static defaultValue = defaultValue;

  mMenu = null;

  componentDidMount() {
    const parentToolbarExtend = this.makeToolbarPropsFromConfig(
      parentToolbarExtendConfig,
      {
        allowExtend: false,
        filterExtendName: `${this.constructor.componentId}_parent`
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
    const { items, ...finalValue } = newValue;

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
      <li className="mm-navbar">
        <a className="brz-a mm-navbar__title">
          <TextEditor value={mMenuTitle} onChange={this.handleTextChange} />
        </a>
      </li>
    );
  }

  renderMenu(v, id) {
    const { onToolbarEnter, onToolbarLeave } = this.props;
    const { mMenu, tabletMMenu, mobileMMenu } = v;
    const hasMMenu =
      (mMenu === "on" || tabletMMenu === "on" || mobileMMenu === "on") && id;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        mMenu: hasMMenu,
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig, {
          allowExtend: !hasMMenu
        }),
        onToolbarEnter,
        onToolbarLeave
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
          <div className="brz-ed-mmenu-portal__menu">
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
    const configMenus = Config.get("menuData");
    const dashboardNavMenu = Config.get("urls").dashboardNavMenu;

    let errMsg;

    if (configMenus.length === 0) {
      errMsg = (
        <span className="brz-menu--error--not-found">
          <a href={dashboardNavMenu} target="_blank" className="brz-a">
            {t("Add a Menu")}
          </a>
          {t("in your WordPress admin")}
        </span>
      );
    }

    if (!errMsg) {
      const selectedMenu = configMenus.find(menu => menu.id === v.menuSelected);
      if (!selectedMenu) {
        errMsg = t("Please select a menu");
      } else if (selectedMenu.items.length === 0) {
        errMsg = printf(
          t("%s does not have any menu items"),
          selectedMenu.name
        );
      }
    }

    return (
      errMsg && (
        <div className="brz-menu--error">
          <b className="brz-b">{t("Menu error")}: </b>
          <span className="brz-span">{errMsg}</span>
        </div>
      )
    );
  }

  renderForEdit(_v) {
    const errors = this.renderErrors(_v);

    if (errors) {
      return errors;
    }

    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.hoverColorPalette && `${_v.hoverColorPalette}__hoverColor`,
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
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
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
      return errors;
    }

    const v = this.applyRulesToValue(_v, [
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.hoverColorPalette && `${_v.hoverColorPalette}__hoverColor`,
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
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,
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
  initMMenu() {
    if (this.mMenu) {
      return;
    }

    const { mMenuPosition } = this.getValue();

    const options = {
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
          pageSelector: "#brz-ed-root"
        }
      }
    };
    this.mMenu = jQuery(`#${this.getId()}`).mmenu(options, config);
  }

  destroyMMenu() {
    if (this.mMenu) {
      this.mMenu.remove();
      this.mMenu = null;
    }
  }

  openMMenu = () => {
    const mMenuApi = this.mMenu.data("mmenu");

    if (mMenuApi) {
      mMenuApi.open();
    }
  };

  closeMMenu = () => {
    const mMenuApi = this.mMenu && this.mMenu.data("mmenu");

    if (mMenuApi) {
      mMenuApi.close();
    }
  };
}
