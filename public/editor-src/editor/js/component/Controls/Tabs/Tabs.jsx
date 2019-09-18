import _ from "underscore";
import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

export default class Tabs extends React.Component {
  static defaultProps = {
    align: "",
    className: "",
    tabsClassName: "",
    tabsPosition: "top",
    value: 0,
    hideHandlesWhenOne: true,
    onChange: _.noop,
    helper: null
  };

  renderTabIcon = icon => {
    return <EditorIcon icon={icon} />;
  };

  renderTabs = () => {
    // React.Children.toArray automatically filters out falsy children
    const childrenArr = React.Children.toArray(this.props.children);

    if (childrenArr.length === 1 && this.props.hideHandlesWhenOne) {
      return null;
    }

    const items = childrenArr.map((child, index) => {
      return (
        <li
          key={index}
          title={child.props.title}
          className={classnames(
            "brz-li brz-ed-control__tab",
            child.props.icon ? "brz-ed-control__tab__icon" : null,
            { active: this.props.value === child.props.value }
          )}
          onClick={this.props.onChange.bind(null, child.props.value)}
        >
          {child.props.icon ? this.renderTabIcon(child.props.icon) : null}
          <span className="brz-span">{child.props.label}</span>
        </li>
      );
    });

    const tabsClassName = classnames(
      "brz-ul brz-ed-control__tabs",
      `brz-justify-content-xs-${this.props.align}`,
      `brz-ed-control__tabs__${this.props.tabsPosition}`,
      this.props.tabsClassName
    );

    return items.length ? <ul className={tabsClassName}>{items}</ul> : null;
  };

  renderTabContent = () => {
    // React.Children.toArray automatically filters out falsy children
    const childrenArr = React.Children.toArray(this.props.children);
    const tabsContentClassName = classnames(
      "brz-ed-control__tab__content",
      `brz-ed-control__tabs__content__${this.props.tabsPosition}`
    );

    return childrenArr.map((child, index) => {
      if (this.props.value === child.props.value) {
        return (
          <div key={index} className={tabsContentClassName}>
            {child.props.children}
          </div>
        );
      }
    });
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
