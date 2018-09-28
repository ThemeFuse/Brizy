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
    position: "bottom-left"
  };

  componentDidMount() {
    this.reposition();
  }

  componentDidUpdate() {
    if (this.isRepositioning) {
      return;
    }

    this.reposition();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.defaultValue !== nextProps.defaultValue) {
      this.setState({
        currentValue: nextProps.defaultValue
      });
    }
  }

  getScrollPaneStyle() {
    const { children } = this.props;
    const childrenCount = React.Children.count(children);
    let childrenOptgroupCount = 0;

    React.Children.forEach(children, child => {
      const { items } = child.props;

      if (items && items.length) {
        childrenOptgroupCount += items.length;
      }
    });

    const maxChildrenCount = childrenCount + childrenOptgroupCount;

    return {
      height: getDropdownHeight(
        maxChildrenCount,
        this.props.itemHeight,
        this.props.minItems,
        this.props.maxItems
      )
    };
  }

  onClickOutside = () => {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    }
  };

  handleItemClick = value => {
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
    const { bottom, width, x } = this.dropdown.getBoundingClientRect();
    let { position } = this.state;
    const [positionX, positionY] = position.split("-");

    if (bottom >= window.innerHeight) {
      position = `top-${positionY}`;
    }
    if (width + x >= window.innerWidth) {
      position = `${positionX}-right`;
    }

    this.isRepositioning = true;

    this.setState({ position }, () => {
      this.isRepositioning = false;
    });
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
    const { arrowIcon, children } = this.props;
    const { currentValue } = this.state;
    let selectedItem;

    React.Children.forEach(children, child => {
      const { items } = child.props;

      if (selectedItem) {
        return;
      }

      if (items && items.length) {
        const children = React.Children.toArray(child.props.items);

        selectedItem = children.find(
          child => child.props.value === currentValue
        );
      } else if (child.props.value === currentValue) {
        selectedItem = child;
      }
    });

    return (
      <React.Fragment>
        {selectedItem || this.findFirstItem()}
        {arrowIcon && (
          <EditorIcon icon={arrowIcon} className="brz-control__select--arrow" />
        )}
      </React.Fragment>
    );
  }

  renderItems(children = this.props.children) {
    const { currentValue } = this.state;

    return React.Children.map(children, (child, index) => {
      const { value, disabled, items } = child.props;

      if (items && items.length) {
        return React.cloneElement(child, {
          key: index,
          items: this.renderItems(items)
        });
      }

      return React.cloneElement(child, {
        key: index,
        active: value === currentValue,
        onClick: disabled ? null : () => this.handleItemClick(value)
      });
    });
  }

  render() {
    const {
      className: _className,
      labelType,
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
            <ScrollPane style={this.getScrollPaneStyle()}>
              {this.renderItems()}
            </ScrollPane>
          </div>
          <input type="hidden" value={currentValue} {...inputAttributes} />
        </div>
      </ClickOutside>
    );
  }

  findFirstItem(items = this.props.children) {
    let selectedItem;

    React.Children.forEach(items, item => {
      const { items } = item.props;

      if (selectedItem) {
        return;
      }
      if (items && items.length) {
        selectedItem = this.findFirstItem(items);
      } else {
        selectedItem = item;
      }
    });

    return selectedItem;
  }
}

export default Select;
