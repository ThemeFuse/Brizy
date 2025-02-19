import classnames from "classnames";
import { noop } from "es-toolkit";
import T from "prop-types";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";

export default class Tabs extends React.Component {
  static propTypes = {
    align: T.string,
    className: T.string,
    tabsClassName: T.string,
    tabsPosition: T.string,
    value: T.string,
    hideHandlesWhenOne: T.bool,
    onChange: T.func
  };

  static defaultProps = {
    align: "",
    className: "",
    tabsClassName: "",
    tabsPosition: "top",
    value: "",
    hideHandlesWhenOne: true,
    onChange: noop,
    helper: null
  };

  renderTabs = () => {
    const {
      value,
      hideHandlesWhenOne,
      align,
      tabsPosition,
      tabsClassName,
      children,
      onChange
    } = this.props;

    // React.Children.toArray automatically filters out falsy children
    const childrenArr = React.Children.toArray(children);
    if (
      childrenArr.length === 0 ||
      (childrenArr.length === 1 && hideHandlesWhenOne)
    ) {
      return null;
    }

    const className = classnames(
      "brz-ul brz-ed-control__tabs",
      `brz-justify-content-xs-${align}`,
      `brz-ed-control__tabs__${tabsPosition}`,
      tabsClassName
    );
    const items = childrenArr.map((child, index) => {
      const { icon, value: childValue, title, label } = child.props;
      const className = classnames("brz-li brz-ed-control__tab", {
        "brz-ed-control__tab__icon": icon,
        active: value === childValue
      });

      return (
        <li
          key={index}
          title={title}
          className={className}
          onClick={() => onChange(childValue)}
        >
          {icon && <EditorIcon icon={icon} />}
          <span className="brz-span">{label}</span>
        </li>
      );
    });

    return <ul className={className}>{items}</ul>;
  };

  renderTabContent = () => {
    const { value, tabsPosition, children } = this.props;

    // React.Children.toArray automatically filters out falsy children
    const childrenArr = React.Children.toArray(children);
    const className = classnames(
      "brz-ed-control__tab__content",
      `brz-ed-control__tabs__content__${tabsPosition}`
    );
    const activeChild = childrenArr.find(
      (child) => value === child.props.value
    );

    return (
      activeChild && (
        <div className={className}>{activeChild.props.children}</div>
      )
    );
  };

  render() {
    return (
      <div className={this.props.className}>
        {this.props.helper}
        {this.renderTabs()}
        {this.renderTabContent()}
      </div>
    );
  }
}
