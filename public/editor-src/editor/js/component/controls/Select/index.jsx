import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component-new/EditorIcon";
import ClickOutside from "visual/component-new/ClickOutside";

function getDropdownHeight(itemsCount, itemHeight, minItems, maxItems) {
  const minHeight = itemHeight * minItems;
  const maxHeight = itemHeight * maxItems;
  const itemsHeight = itemsCount * itemHeight;

  return Math.max(minHeight, Math.min(maxHeight, itemsHeight));
}

class Select extends React.Component {
  static defaultProps = {
    defaultValue: "",
    inputAttributes: {},
    labelType: "input",
    labelIcon: "nc-menu",
    minItems: 1,
    maxItems: 5,
    itemHeight: 38,
    arrowIcon: "nc-stre-down",
    onChange: _.noop
  };

  state = {
    isOpen: false,
    currentValue: this.props.defaultValue,
    position: "bottom"
  };

  componentDidMount() {
    this.reposition();
  }

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

  handleDropdownNode = node => {
    this.dropdown = node;
  };

  handleLabelClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  reposition() {
    const { bottom } = this.dropdown.getBoundingClientRect();

    if (bottom >= window.innerHeight) {
      this.setState({
        position: "top"
      });
    }
  }

  renderLabel() {
    const { labelType } = this.props;

    switch (labelType) {
      case "icon":
        return this.renderLabelIcon();
      case "input":
        return this.renderLabelInput();
      default:
        throw new Error(`Invalid label type ${labelType}`);
    }
  }

  renderLabelIcon() {
    return <EditorIcon icon={this.props.labelIcon} />;
  }

  renderLabelInput() {
    const { arrowIcon } = this.props;
    const { currentValue } = this.state;
    const children = React.Children.toArray(this.props.children);
    const selectedItem =
      children.find(child => child.props.value === currentValue) || children[0];

    return (
      <React.Fragment>
        {selectedItem}
        {arrowIcon && (
          <EditorIcon icon={arrowIcon} className="brz-control__select--arrow" />
        )}
      </React.Fragment>
    );
  }

  renderOptions = () => {
    const { children } = this.props;
    const { currentValue } = this.state;

    return _.map(children, (child, index) =>
      React.cloneElement(child, {
        key: index,
        active: child.props.value === currentValue,
        onClick: child.props.disabled
          ? null
          : () => this.onItemClick(child.props.value)
      })
    );
  };

  render() {
    const {
      className: _className,
      labelType,
      children,
      currentValue,
      inputAttributes
    } = this.props;
    const { position, isOpen } = this.state;
    const className = classnames(
      "brz-control__select",
      `brz-control__select--${position}`,
      _className,
      { opened: isOpen }
    );
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
            className={`brz-control__select-current brz-control__select-current__${labelType}`}
            onClick={this.handleLabelClick}
          >
            {this.renderLabel()}
          </div>
          <div
            ref={this.handleDropdownNode}
            className="brz-control__select-options"
          >
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
