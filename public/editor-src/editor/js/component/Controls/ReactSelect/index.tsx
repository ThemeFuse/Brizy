import classnames from "classnames";
import Downshift from "downshift";
import { has } from "es-toolkit/compat";
import FuzzySearch from "fuzzy-search";
import React, { ChangeEvent, Component, RefObject } from "react";
import { Manager, Popper, Reference } from "react-popper";
import { addLast, removeAt, removeLast } from "timm";
import EditorIcon from "visual/component/EditorIcon";
import Portal from "visual/component/Portal";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import {
  DropdownProps,
  InputProps,
  MultipleValue,
  Props,
  SingleValue,
  State
} from "./types";

const getDropdownHeight = (
  itemsCount: number,
  itemHeight: number,
  minItems: number,
  maxItems: number
) => {
  const minHeight = itemHeight * minItems;
  const maxHeight = itemHeight * maxItems;
  const itemsHeight = itemsCount * itemHeight;

  return Math.max(minHeight, Math.min(maxHeight, itemsHeight));
};

class ReactSelect extends Component<Props, State> {
  state = {
    inputValue: ""
  };

  selectRef: RefObject<HTMLDivElement> = React.createRef();

  inputRef: RefObject<HTMLInputElement> = React.createRef();

  handleChange = (
    changes: MultipleValue | SingleValue,
    { isOpen }: { isOpen: boolean }
  ) => {
    const { isMultiple, value, onChange } = this.props;

    if (isMultiple) {
      if (!isOpen) {
        this.setState({ inputValue: "" });
      }

      if (has(changes, "value")) {
        const newValue = Array.isArray(value) ? value : [];
        onChange(addLast(newValue, changes.value));
      }
    } else if (changes && "label" in changes) {
      this.setState({
        inputValue: changes.value
      });
      onChange(changes);
    }
  };

  handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputValue: e.target.value
    });
  };

  handleRemoveTag = (index: number) => {
    const { value, onChange } = this.props;
    if (Array.isArray(value)) {
      onChange(removeAt(value, index));
    }
  };

  handleInputKeyDown = (e: KeyboardEvent) => {
    const { value, isMultiple, onChange } = this.props;

    // remove last item when trigger backspace
    if (
      isMultiple &&
      Array.isArray(value) &&
      e.code === "Backspace" &&
      !this.state.inputValue
    ) {
      onChange(removeLast(value));
    }
  };

  itemToString(i: SingleValue) {
    return i ? i.label : "";
  }

  renderTags(items: string[]) {
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

  renderInput(props: InputProps) {
    const { isMultiple, selectedItem, isOpen, toggleMenu, inputProps } = props;
    const className = isMultiple
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
              !isOpen && this.inputRef.current?.focus();
            }}
          >
            {isMultiple &&
              Array.isArray(selectedItem) &&
              this.renderTags(selectedItem)}
            <input
              {...inputProps}
              className="brz-input brz-control__select2-value"
            />
          </div>
        )}
      </Reference>
    );
  }

  renderDropdown(props: DropdownProps) {
    const {
      className: _className,
      options: _options,
      value,
      isMultiple,
      placement,
      isFixed,
      itemHeight = 30,
      minItems = 1,
      maxItems = 5,
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
      Array.isArray(value) && isMultiple
        ? (_options as MultipleValue[]).filter((option) =>
            value.every((value) => value !== option.value)
          )
        : _options;
    const container = this.selectRef.current;
    const menuWidth = container?.getBoundingClientRect().width;
    const node = container?.ownerDocument.body;
    const className = classnames("brz-ed-select2-portal", _className);
    const searcher = new FuzzySearch(options as MultipleValue[], ["value"]);

    return (
      node && (
        <Portal node={node} className={className}>
          <Popper
            placement={placement}
            strategy={isFixed ? "fixed" : "absolute"}
          >
            {({ ref, style, placement }) => {
              const searchItems = searcher.search(
                inputValue
              ) as MultipleValue[];
              const items = searchItems.map((item, index) => (
                <li
                  key={item.value}
                  {...getItemProps({
                    index,
                    item
                  })}
                  className={classnames("brz-li brz-control__select2-option", {
                    "brz-control__select2-option--active":
                      selectedItem === item.value || highlightedIndex === index
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
                  <Scrollbar
                    autoHeightMax={getDropdownHeight(
                      items.length,
                      itemHeight,
                      minItems,
                      maxItems
                    )}
                    theme="dark"
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
                  </Scrollbar>
                </div>
              );
            }}
          </Popper>
        </Portal>
      )
    );
  }

  render() {
    const {
      className: _className,
      placeholder,
      isMultiple,
      value
    } = this.props;
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
                  isMultiple,
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
