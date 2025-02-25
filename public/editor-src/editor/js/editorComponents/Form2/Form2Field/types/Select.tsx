import classnames from "classnames";
import { debounce } from "es-toolkit/compat";
import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { connect } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import Portal from "visual/component/Portal";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRef, attachRefs } from "visual/utils/react";
import { AddOption } from "./common/AddOption";
import TextField from "./common/TextField";
import { SelectAttributes, SelectProps, SelectState } from "./type";
import { createNewFieldOption } from "./utils";

const MAX_ITEM_DROPDOWN = 5;

const mapState = (state: ReduxState) => ({
  deviceMode: deviceModeSelector(state)
});
const SelectConnector = connect(mapState);

class Select extends TextField {
  content = React.createRef<HTMLDivElement>();
  dropdown = React.createRef<HTMLDivElement>();
  scrollbar = React.createRef<Scrollbars>();
  state: SelectState = {
    isOpen: false
  };
  getHeight = debounce(() => {
    if (this.dropdown.current) {
      const selectItem = this.dropdown.current.querySelector(
        ".brz-forms2__select-item"
      );

      if (selectItem) {
        return selectItem.getBoundingClientRect().height * MAX_ITEM_DROPDOWN;
      }
    }

    return "100px";
  }, 100);

  static get componentType(): ElementTypes.Select {
    return ElementTypes.Select;
  }

  componentDidUpdate(prevProps: SelectProps) {
    if (this.props.items.length > prevProps.items.length) {
      this.scrollbar.current?.scrollToBottom();
    }
  }

  getClassName(): string {
    const { multipleSelection, selectClassName } = this.props;
    const { isOpen } = this.state;

    return classnames(
      "brz-forms2__field brz-forms2__field-select",
      {
        "brz-forms2__field-select--multiple": multipleSelection === "on",
        "brz-forms2__field-select-opened": isOpen
      },
      selectClassName
    );
  }

  getAttributes(): SelectAttributes {
    const { multipleSelection } = this.props;

    return {
      multiple: multipleSelection === "on",
      ...makeDataAttr({ name: "max-item-dropdown", value: MAX_ITEM_DROPDOWN })
    };
  }

  handleOutside = (): void => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  handleClick = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    const node = this.input.current;
    node && node.classList.add("brz-ed-dd-cancel");
  };

  handleBlur = (): void => {
    const node = this.input.current;
    node && node.classList.remove("brz-ed-dd-cancel");
  };

  handleOpen = (e: React.MouseEvent<HTMLElement>): void => {
    this.setState(
      ({ isOpen }: { isOpen: SelectState }) => ({ isOpen: !isOpen }),
      this.forceUpdate
    );

    this.handleClick(e);
  };

  handleAddOption = (value: string) => {
    const { onChange, items } = this.props;
    const newOption = createNewFieldOption(value);

    onChange({ items: [...items, newOption] });
  };

  renderDropdown(): React.JSX.Element | null {
    const { selectClassName, toolbarExtendSelect, children, deviceMode } =
      this.props;

    const isDesktop = deviceMode === "desktop";

    const node = this.content.current;

    if (!node) {
      return null;
    }

    const { top, left, height, width } = node.getBoundingClientRect();
    const { scrollLeft } = node.ownerDocument.documentElement;
    const dropdownStyle = {
      width,
      top: top + height + window.scrollY,
      left: left + scrollLeft
    };
    const className = classnames(
      "brz-portal-forms__select brz-ed-dd-cancel",
      selectClassName
    );

    return (
      <Portal node={node.ownerDocument.body} className={className}>
        <Toolbar {...toolbarExtendSelect}>
          {({ ref }) => (
            <div
              ref={(el) => {
                attachRefs(el, [ref, this.dropdown]);
              }}
              className="brz-forms2__select-list"
              style={dropdownStyle}
            >
              <Scrollbars
                ref={this.scrollbar}
                autoHeight={true}
                autoHeightMax={this.getHeight()}
              >
                {children}
                {isDesktop && (
                  <AddOption
                    onAdd={this.handleAddOption}
                    wrapperClassName="brz-forms2__select-item"
                    inputWrapperClassName="brz-forms2__select-item__input"
                    iconClassName="brz-forms2__select-item__icon"
                  />
                )}
              </Scrollbars>
            </div>
          )}
        </Toolbar>
      </Portal>
    );
  }

  renderForEdit(v: SelectProps): React.JSX.Element {
    const { isOpen } = this.state;
    const { labelType, attr, showPlaceholder } = v;
    const clickOutsideExceptions = [
      ".brz-portal-forms__select",
      ".brz-ed-toolbar",
      ".brz-ed-tooltip__content-portal",
      ".brz-ed-eyeDropper"
    ];
    const className = classnames("brz-input", {
      "brz-p-events--none": !showPlaceholder
    });

    return (
      <ClickOutside
        exceptions={clickOutsideExceptions}
        onClickOutside={this.handleOutside}
      >
        {({ ref }) => (
          <div
            ref={(el) => {
              attachRef(el, ref);
              attachRef(el, this.content);
            }}
            className={this.getClassName()}
          >
            <div
              className="brz-forms2__select-current"
              onClick={this.handleOpen}
            >
              {labelType === "outside" ? (
                <input
                  {...attr}
                  ref={this.input}
                  className={className}
                  value={attr?.placeholder}
                  onChange={(e) => {
                    this.handleChange({ placeholder: e.target.value });
                  }}
                  onBlur={this.handleBlur}
                />
              ) : (
                <input
                  {...attr}
                  ref={this.input}
                  className={className}
                  onChange={(e) => {
                    this.handleChange({
                      label: e.target.value,
                      placeholder: e.target.value
                    });
                  }}
                  onBlur={this.handleBlur}
                />
              )}
              <ThemeIcon
                name="arrow-down"
                type="editor"
                className="brz-forms2__select--arrow"
              />
            </div>
            {isOpen && this.renderDropdown()}
          </div>
        )}
      </ClickOutside>
    );
  }

  renderForView({ attr, label }: SelectProps): React.JSX.Element {
    const { children } = this.props;

    return (
      <div className={this.getClassName()}>
        <select {...attr} className="brz-select">
          <option value="">{label}</option>
          {children}
        </select>
        <ThemeIcon
          name="arrow-down"
          type="editor"
          className="brz-forms2__select--arrow"
        />
      </div>
    );
  }
}

export default SelectConnector(Select);
