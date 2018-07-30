import React from "react";
import _ from "underscore";
import classnames from "classnames";

export default class IconToggle extends React.Component {
  static defaultProps = {
    className: "",
    title: "",
    value: "",
    onChange: _.noop
  };

  getCurrentIndex = () => {
    const { children, value } = this.props;

    return (
      _.findIndex(
        children,
        function(child) {
          return child.props.value === value;
        },
        this
      ) || 0
    );
  };

  onClick = event => {
    // event.stopPropagation();
    const { children, onChange } = this.props;

    const currentIndex = this.getCurrentIndex();
    const itemsCount = React.Children.count(children);
    const next = currentIndex + 1 < itemsCount ? currentIndex + 1 : 0;
    const nextValue = children[next].props.value;

    onChange(nextValue);
  };

  render() {
    const { className: _className, title, children } = this.props;
    const current = children[this.getCurrentIndex()];
    const className = classnames(
      "brz-ed-control__icon-carousel",
      _className
    );

    return (
      <div className={className} title={title} onClick={this.onClick}>
        {current}
      </div>
    );
  }
}
