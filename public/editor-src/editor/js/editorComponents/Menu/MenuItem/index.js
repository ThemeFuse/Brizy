import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import ClickOutside from "visual/component/ClickOutside";
import MenuItemItems from "./items";
import toolbarConfigFn from "./toolbar";
import sidebarConfigFn from "./sidebar";
import { styleClassName, styleMmMenuClassName } from "./styles";
import defaultValue from "./defaultValue.json";

class MenuItem extends EditorComponent {
  static get componentId() {
    return "MenuItem";
  }

  static defaultProps = {
    defaultValue: {},
    level: 0,
    mMenu: false
  };

  static defaultValue = defaultValue;

  state = {
    isOpen: false
  };

  componentDidUpdate(nextProps) {
    if (
      this.props.defaultValue.megaMenu !== nextProps.defaultValue.megaMenu &&
      nextProps.defaultValue.megaMenu === "on"
    ) {
      this.setState({
        isOpen: true
      });
    }
  }

  handleClick = () => {
    if (!this.state.isOpen) {
      this.setState({
        isOpen: true
      });
    }
  };

  handleClickOutside = () => {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
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

  renderLink(v, content) {
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

  renderMegaMenu() {
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "megaMenuItems",
      level: this.props.level,
      megaMenu: true
    });

    return <MenuItemItems {...itemProps} />;
  }

  renderDropDown() {
    const { level, toolbarExtend, mMenu } = this.props;

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend,
      level,
      mMenu,
      megaMenu: false
    });

    return <MenuItemItems {...itemProps} />;
  }

  renderSimple(v, content) {
    const clickOutsideExceptions = [
      ".brz-ed-sidebar",
      ".brz-ed-toolbar",
      ".brz-ed-sidebar__right",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-fixed"
    ];
    const { level, mMenu } = this.props;
    const toolbarConfig = toolbarConfigFn(level, mMenu);
    const sidebarConfig = sidebarConfigFn(level, mMenu);

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleClickOutside}
      >
        <li
          className={styleClassName(v, this.state)}
          onClick={this.handleClick}
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
          >
            {this.renderLink(v, content)}
          </Toolbar>
          {v.megaMenu === "on"
            ? this.renderMegaMenu(v)
            : this.renderDropDown(v)}
        </li>
      </ClickOutside>
    );
  }

  renderMMenu(v, content) {
    const { level, mMenu } = this.props;
    const toolbarConfig = toolbarConfigFn(level, mMenu);
    const sidebarConfig = sidebarConfigFn(level, mMenu);

    return (
      <li className={styleMmMenuClassName(v)}>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          {this.renderLink(v, content)}
        </Toolbar>
        {this.renderDropDown(v)}
      </li>
    );
  }

  renderForEdit(v) {
    const { title, iconName, iconType } = v;
    const hasIcon = iconName && iconType;
    const content = (
      <React.Fragment>
        {hasIcon && this.renderIcon(v)}
        {title}
      </React.Fragment>
    );

    return this.props.mMenu
      ? this.renderMMenu(v, content)
      : this.renderSimple(v, content);
  }
}

export default MenuItem;
