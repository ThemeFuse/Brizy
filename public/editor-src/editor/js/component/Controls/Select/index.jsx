import classnames from "classnames";
import React from "react";
import _ from "underscore";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import Portal from "visual/component/Portal";
import { Scrollbar } from "visual/component/Scrollbar";
import { ThemeIcon } from "visual/component/ThemeIcon";

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
    /** @deprecated */
    arrowIcon: "nc-arrow-down",
    inPortal: false,
    clickOutsideExceptions: [],
    onChange: _.noop
  };

  state = {
    isOpen: false,
    currentValue: this.props.defaultValue,
    position: "bottom-left"
  };

  componentDidMount() {
    if (!this.props.inPortal) {
      this.reposition();
    }
  }

  /*
   * commented because reposition causes react perf problems (cascading updates)
   * and it seems unnecessary because when commented nothing seems changes visually.
   * Will leave here for a number of releases and potentially remove in the future
   */
  // componentDidUpdate() {
  //   if (!this.props.inPortal && !this.isRepositioning) {
  //     this.reposition();
  //   }
  // }

  static getDerivedStateFromProps(nextProps, state) {
    if (state.defaultValue !== nextProps.defaultValue) {
      return {
        currentValue: nextProps.defaultValue
      };
    }
    return null;
  }

  getScrollPaneStyle() {
    const { children } = this.props;
    const childrenCount = React.Children.count(children);
    let childrenOptgroupCount = 0;

    React.Children.forEach(children, (child) => {
      const { items } = child.props;

      if (items && items.length) {
        childrenOptgroupCount += items.length;
      }
    });

    const maxChildrenCount = childrenCount + childrenOptgroupCount;

    return getDropdownHeight(
      maxChildrenCount,
      this.props.itemHeight,
      this.props.minItems,
      this.props.maxItems
    );
  }

  onClickOutside = () => {
    if (this.state.isOpen) {
      this.setState({
        isOpen: false
      });
    }
  };

  handleItemClick = (value) => {
    this.setState({
      isOpen: false,
      currentValue: value
    });
    this.props.onChange(value);
  };

  handleContentRef = (node) => {
    this.content = node;
  };

  handleDropdownNode = (node) => {
    this.dropdown = node;
  };

  handleLabelClick = () => {
    this.setState({ isOpen: !this.state.isOpen }, () => {
      if (this.state.isOpen) {
        this.reposition();
      }
    });
  };

  reposition() {
    if (this.dropdown) {
      this.isRepositioning = true;
      this.dropdown.style.setProperty("opacity", 1);

      this.setState({ position: "bottom-left" }, () => {
        const { bottom, right } = this.dropdown.getBoundingClientRect();
        const positionY = bottom >= window.innerHeight ? "top" : "bottom";
        const positionX = right >= window.innerWidth ? "right" : "left";

        this.setState({ position: `${positionY}-${positionX}` }, () => {
          this.isRepositioning = false;
        });
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
    const { children } = this.props;
    const { currentValue } = this.state;
    let selectedItem;

    React.Children.forEach(children, (child) => {
      const { items } = child.props;

      if (selectedItem) {
        return;
      }

      if (items && items.length) {
        const children = React.Children.toArray(child.props.items);

        selectedItem = children.find(
          (child) => child.props.value === currentValue
        );
      } else if (child.props.value === currentValue) {
        selectedItem = child;
      }
    });
    /**
     * we are using EditorIcon in editor mode because select is widely used
     * in toolbars and there is a noticeable delay when using ThemeIcon because
     * it fetches the icon in componentDidMount and renders after that causing
     * an unpleasant user experience
     */
    const arrowIcon = IS_EDITOR ? (
      <EditorIcon icon="nc-stre-down" className="brz-control__select--arrow" />
    ) : (
      <ThemeIcon
        name="arrow-down"
        type="editor"
        className="brz-control__select--arrow"
      />
    );

    return (
      <React.Fragment>
        {selectedItem || this.findFirstItem()}
        {arrowIcon}
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

  renderDropDown() {
    const { inPortal, className: _className } = this.props;

    if (IS_PREVIEW) {
      return (
        <div className="brz-control__select-options">
          <Scrollbar autoHeightMax={this.getScrollPaneStyle()} theme="light">
            {this.renderItems()}
          </Scrollbar>
        </div>
      );
    }

    if (this.state.isOpen && !inPortal) {
      return (
        <div
          className="brz-control__select-options"
          style={{ opacity: 0 }}
          ref={this.handleDropdownNode}
        >
          <Scrollbar autoHeightMax={this.getScrollPaneStyle()} theme="light">
            {this.renderItems()}
          </Scrollbar>
        </div>
      );
    } else if (this.state.isOpen && inPortal) {
      const { top, left, height, width } = this.content.getBoundingClientRect();
      const { scrollLeft } = this.content.ownerDocument.documentElement;
      const className = classnames(
        "brz-control__portal-select brz-control__select",
        _className
      );
      const dropDownStyle = {
        top: top + height + 3,
        left: left + scrollLeft,
        width
      };

      return (
        <Portal node={this.content.ownerDocument.body} className={className}>
          <div className="brz-control__select-options" style={dropDownStyle}>
            <Scrollbar autoHeightMax={this.getScrollPaneStyle()} theme="light">
              {this.renderItems()}
            </Scrollbar>
          </div>
        </Portal>
      );
    }
  }

  render() {
    const {
      className: _className,
      labelType,
      currentValue,
      inputAttributes,
      clickOutsideExceptions: _clickOutsideExceptions
    } = this.props;
    const { position, isOpen } = this.state;
    const className = classnames(
      "brz-control__select",
      `brz-control__select--${position}`,
      _className,
      { opened: isOpen }
    );
    const clickOutsideExceptions = [
      ..._clickOutsideExceptions,
      ".brz-control__portal-select"
    ];

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.onClickOutside}
      >
        <div className={className} ref={this.handleContentRef}>
          <div
            className={`brz-control__select-current brz-control__select-current__${labelType}`}
            onClick={this.handleLabelClick}
          >
            {this.renderLabel()}
          </div>
          {this.renderDropDown()}
          <input type="hidden" value={currentValue} {...inputAttributes} />
        </div>
      </ClickOutside>
    );
  }

  findFirstItem(items = this.props.children) {
    let selectedItem;

    React.Children.forEach(items, (item) => {
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
