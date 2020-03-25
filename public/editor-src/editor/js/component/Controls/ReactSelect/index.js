import React, { Component } from "react";
import _ from "underscore";
import { addLast, removeLast, removeAt } from "timm";
import Downshift from "downshift";
import classnames from "classnames";
import FuzzySearch from "fuzzy-search";
import { Manager, Reference, Popper } from "react-popper";
import Portal from "visual/component/Portal";
import ScrollPane from "visual/component/ScrollPane";
import { t } from "visual/utils/i18n";
import EditorIcon from "visual/component/EditorIcon";

const getDropdownHeight = (itemsCount, itemHeight, minItems, maxItems) => {
  const minHeight = itemHeight * minItems;
  const maxHeight = itemHeight * maxItems;
  const itemsHeight = itemsCount * itemHeight;

  return Math.max(minHeight, Math.min(maxHeight, itemsHeight));
};

class ReactSelect extends Component {
  static defaultProps = {
    className: "",
    value: null,
    options: [{ label: "Test", value: "test" }],
    placement: "bottom",
    placeholder: "",
    fixed: false,
    minItems: 1,
    maxItems: 5,
    itemHeight: 30,
    multiple: false,
    onChange: _.noop
  };

  state = {
    inputValue: ""
  };

  selectRef = React.createRef();

  inputRef = React.createRef();

  handleChange = (changes, downshiftStateAndHelpers) => {
    const { multiple, value, onChange } = this.props;

    if (multiple) {
      if (!downshiftStateAndHelpers.isOpen) {
        this.setState({ inputValue: "" });
      }

      if (changes.hasOwnProperty("value")) {
        const newValue = Array.isArray(value) ? value : [];
        onChange(addLast(newValue, changes.value));
      }
    } else if (changes) {
      this.setState({
        inputValue: changes.value
      });
      onChange(changes);
    }
  };

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  handleRemoveTag = index => {
    const { value, onChange } = this.props;

    onChange(removeAt(value, index));
  };

  handleInputKeyDown = e => {
    const { value, multiple, onChange } = this.props;

    // remove last item when trigger backspace
    if (multiple && e.keyCode === 8 && !this.state.inputValue) {
      onChange(removeLast(value));
    }
  };

  itemToString(i) {
    return i ? i.label : "";
  }

  renderTags(items) {
    if (!Array.isArray(items)) {
      return null;
    }

    return items.map((tag, index) => (
      <div key={index} className="brz-control__select2-tag">
        {tag}
        <EditorIcon
          icon="nc-trash"
          onClick={() => {
            this.handleRemoveTag(index);
          }}
        />
      </div>
    ));
  }

  renderInput(props) {
    const { multiple, selectedItem, isOpen, toggleMenu, inputProps } = props;
    const className = multiple
      ? "brz-control__select2-value-container-tag"
      : "brz-control__select2-value-container";

    return (
      <Reference>
        {({ ref }) => (
          <div
            ref={ref}
            className={className}
            onClick={() => {
              toggleMenu();
              !isOpen && this.inputRef.current.focus();
            }}
          >
            {multiple && this.renderTags(selectedItem)}
            <input
              {...inputProps}
              className="brz-input brz-control__select2-value"
            />
          </div>
        )}
      </Reference>
    );
  }

  renderDropdown(props) {
    const {
      className: _className,
      options: _options,
      value,
      multiple,
      placement,
      fixed,
      itemHeight,
      minItems,
      maxItems,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
      getItemProps,
      getMenuProps
    } = props;

    if (!isOpen) {
      return;
    }

    const options =
      Array.isArray(value) && multiple
        ? _options.filter(option =>
            value.every(value => value !== option.value)
          )
        : _options;
    const container = this.selectRef.current;
    const menuWidth = container.getBoundingClientRect().width;
    const node = container.ownerDocument.body;
    const className = classnames("brz-ed-select2-portal", _className);
    const searcher = new FuzzySearch(options, ["value"]);

    return (
      <Portal node={node} className={className}>
        <Popper placement={placement} positionFixed={fixed}>
          {({ ref, style, placement }) => {
            const items = searcher.search(inputValue).map((item, index) => (
              <li
                key={item.value}
                {...getItemProps({
                  index,
                  item
                })}
                className={classnames("brz-li brz-control__select2-option", {
                  "brz-control__select2-option--active":
                    selectedItem === item || highlightedIndex === index
                })}
              >
                {item.value}
              </li>
            ));

            return (
              <div
                ref={ref}
                style={{
                  ...style,
                  width: menuWidth
                }}
                className="brz-control__select2-menu"
                data-placement={placement}
              >
                <ScrollPane
                  style={{
                    height: getDropdownHeight(
                      items.length,
                      itemHeight,
                      minItems,
                      maxItems
                    )
                  }}
                  className="brz-control__select2-scroll-pane brz-ed-scroll--small"
                >
                  <ul {...getMenuProps()} className="brz-ul">
                    {items.length > 0 ? (
                      items
                    ) : (
                      <li className="brz-li brz-control__select2-option">
                        {t("Nothing Found")}
                      </li>
                    )}
                  </ul>
                </ScrollPane>
              </div>
            );
          }}
        </Popper>
      </Portal>
    );
  }

  render() {
    const { className: _className, placeholder, multiple, value } = this.props;
    const { inputValue } = this.state;
    const className = classnames("brz-control__select2-container", _className);

    return (
      <div ref={this.selectRef} className={className}>
        <Manager>
          <Downshift
            initialSelectedItem={value}
            selectedItem={value}
            onChange={this.handleChange}
            itemToString={this.itemToString}
          >
            {({
              getInputProps,
              getItemProps,
              getMenuProps,
              isOpen,
              highlightedIndex,
              selectedItem,
              toggleMenu
            }) => (
              <div className="brz-control__select2">
                {this.renderInput({
                  inputProps: getInputProps({
                    ref: this.inputRef,
                    placeholder,
                    value: inputValue,
                    onKeyDown: this.handleInputKeyDown,
                    onChange: this.handleInputChange
                  }),
                  multiple,
                  selectedItem,
                  isOpen,
                  toggleMenu
                })}
                {this.renderDropdown({
                  ...this.props,
                  inputValue,
                  isOpen,
                  highlightedIndex,
                  selectedItem,
                  getMenuProps,
                  getItemProps
                })}
              </div>
            )}
          </Downshift>
        </Manager>
      </div>
    );
  }
}

export default ReactSelect;
