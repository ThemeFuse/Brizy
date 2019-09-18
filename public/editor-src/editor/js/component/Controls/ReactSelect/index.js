import React, { Component } from "react";
import _ from "underscore";
import Downshift from "downshift";
import classnames from "classnames";
import FuzzySearch from "fuzzy-search";
import { Manager, Reference, Popper } from "react-popper";
import Portal from "visual/component/Portal";
import ScrollPane from "visual/component/ScrollPane";
import { t } from "visual/utils/i18n";

const getDropdownHeight = (itemsCount, itemHeight, minItems, maxItems) => {
  const minHeight = itemHeight * minItems;
  const maxHeight = itemHeight * maxItems;
  const itemsHeight = itemsCount * itemHeight;

  return Math.max(minHeight, Math.min(maxHeight, itemsHeight));
};

class ReactSelect extends Component {
  static defaultProps = {
    className: "",
    value: "",
    options: [],
    placement: "bottom",
    placeholder: "",
    fixed: false,
    minItems: 1,
    maxItems: 5,
    itemHeight: 30,
    onChange: _.noop
  };

  selectRef = React.createRef();

  renderInput(props) {
    return (
      <Reference>
        {({ ref }) => (
          <div ref={ref} className="brz-control__select2-value-container">
            <input
              {...props}
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
      options,
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

    const container = this.selectRef.current;
    const menuWidth = container.getBoundingClientRect().width;
    const node = container.ownerDocument.body;
    const className = classnames("brz-ed-select2-portal", _className);

    return (
      <Portal node={node} className={className}>
        <Popper placement={placement} positionFixed={fixed}>
          {({ ref, style, placement }) => {
            const searcher = new FuzzySearch(options, ["value"]);
            const items = searcher.search(inputValue).map((item, index) => (
              <li
                {...getItemProps({
                  key: item.value,
                  index,
                  item
                })}
                className={classnames("brz-li brz-control__select2-option", {
                  "brz-control__select2-option--active": selectedItem === item
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
    const { className: _className, placeholder, value, onChange } = this.props;
    const className = classnames("brz-control__select2-container", _className);

    return (
      <div ref={this.selectRef} className={className}>
        <Manager>
          <Downshift
            initialSelectedItem={value}
            onChange={onChange}
            itemToString={item => (item ? item.label : "")}
          >
            {({
              getInputProps,
              getItemProps,
              getMenuProps,
              isOpen,
              inputValue,
              highlightedIndex,
              selectedItem
            }) => (
              <div className="brz-control__select2">
                {this.renderInput(getInputProps({ placeholder }))}
                {this.renderDropdown({
                  ...this.props,
                  isOpen,
                  inputValue,
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
