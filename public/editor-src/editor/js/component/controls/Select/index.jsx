import React from "react";
import _ from "underscore";
import jQuery from "jquery";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component-new/EditorIcon";
import ClickOutside from "visual/component-new/ClickOutside";

function getDropdownHeight(itemsCount, itemHeight, minItems, maxItems) {
  var minHeight = itemHeight * minItems,
    maxHeight = itemHeight * maxItems,
    itemsHeight = itemsCount * itemHeight;
  return Math.max(minHeight, Math.min(maxHeight, itemsHeight));
}

class Select extends React.Component {
  static defaultProps = {
    defaultValue: "",
    inputAttributes: {},
    minItems: 1,
    maxItems: 5,
    itemHeight: 38,
    arrowIcon: "nc-stre-down",
    onChange: _.noop
  };

  state = {
    isOpen: false,
    currentValue: this.props.defaultValue
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.defaultValue !== nextProps.defaultValue) {
      this.setState({
        currentValue: nextProps.defaultValue
      });
    }
  }

  onClickOutside = () => {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    }
  };

  onItemClick = value => {
    this.setState({
      isOpen: false,
      currentValue: value
    });
    this.props.onChange(value);
  };

  onSelectedClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  renderSelectedOption() {
    const { children } = this.props;
    const { currentValue } = this.state;

    return (
      _.find(children, child => child.props.value === currentValue) ||
      this.props.children[0]
    );
  }

  renderArrow() {
    const { arrowIcon } = this.props;

    return (
      arrowIcon && (
        <EditorIcon icon={arrowIcon} className="brz-control__select--arrow" />
      )
    );
  }

  renderOptions = () => {
    const { children } = this.props;
    const { currentValue } = this.state;

    return _.map(children, (child, index) =>
      React.cloneElement(child, {
        key: index,
        active: child.props.value === currentValue,
        title: child.props.value,
        onClick: child.props.disabled
          ? null
          : () => this.onItemClick(child.props.value)
      })
    );
  };

  render() {
    const {
      className: _className,
      children,
      currentValue,
      inputAttributes
    } = this.props;
    const className = classnames("brz-control__select", _className, {
      opened: this.state.isOpen
    });
    const scrollPaneStyle = {
      height: getDropdownHeight(
        React.Children.count(children),
        this.props.itemHeight,
        this.props.minItems,
        this.props.maxItems
      )
    };

    return (
      <ClickOutside onClickOutside={this.onClickOutside}>
        <div className={className}>
          <div
            className="brz-control__select-current"
            onClick={this.onSelectedClick}
          >
            {this.renderSelectedOption()}
            {this.renderArrow()}
          </div>
          <div className="brz-control__select-options">
            <ScrollPane style={scrollPaneStyle}>
              {this.renderOptions()}
            </ScrollPane>
          </div>
          <input type="hidden" value={currentValue} {...inputAttributes} />
        </div>
      </ClickOutside>
    );
  }
}

export default Select;
