import classNames from "classnames";
import React, {
  CSSProperties,
  ReactElement,
  Ref,
  useEffect,
  useState
} from "react";
import { Manager, Popper, Reference } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import {
  MultiSelectItemProps as ItemProps,
  MultiSelectProps as Props
} from "./types";
import { toggleItemValue, valueTitle } from "./utils";

export { MultiSelectItem } from "./Item";

export function MultiSelect<T>({
  value,
  valueIsLoading,
  children,
  className,
  placeholder,
  search,
  searchIsEmpty,
  searchIsLoading,
  useAsSimpleSelect,
  showArrow,
  onChange,
  onSearchChange
}: Props<T>): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const items: ItemProps<T>[] = children.map(({ props }) => ({
    title: props.title,
    value: props.value
  }));
  const _className = classNames("brz-ed-control__multiSelect2", className);

  return (
    <ClickOutside onClickOutside={(): void => setIsOpen(false)}>
      {({ ref }) => (
        <div className={_className} ref={ref}>
          <Manager>
            <Reference>
              {({ ref }): ReactElement => (
                <SelectValue
                  customRef={ref}
                  items={items}
                  value={value}
                  valueIsLoading={valueIsLoading}
                  showArrow={showArrow}
                  placeholder={placeholder}
                  onClick={(): void => setIsOpen(!isOpen)}
                />
              )}
            </Reference>
            <div className="brz-ed-control__multiSelect2__dropdown-container">
              <Popper>
                {({ ref, style }): ReactElement | null => {
                  if (!isOpen) {
                    return null;
                  }

                  return (
                    <SelectDropdown
                      customRef={ref}
                      items={items}
                      value={value}
                      style={style}
                      search={search}
                      searchIsEmpty={searchIsEmpty}
                      searchIsLoading={searchIsLoading}
                      useAsSimpleSelect={useAsSimpleSelect}
                      onItemClick={(item): void => {
                        onChange(
                          toggleItemValue(item, value, useAsSimpleSelect)
                        );

                        if (useAsSimpleSelect) {
                          setIsOpen(false);
                        }
                      }}
                      onSearchChange={
                        onSearchChange && ((s): void => onSearchChange(s))
                      }
                    />
                  );
                }}
              </Popper>
            </div>
          </Manager>
        </div>
      )}
    </ClickOutside>
  );
}

type SelectValueProps<T> = {
  customRef: Ref<HTMLDivElement>;
  items: ItemProps<T>[];
  value: T[];
  valueIsLoading?: boolean;
  placeholder?: string;
  showArrow?: boolean;
  onClick: () => void;
};
function SelectValue<T>({
  customRef,
  items,
  value,
  valueIsLoading,
  placeholder,
  showArrow,
  onClick
}: SelectValueProps<T>): ReactElement {
  const isLoading = valueIsLoading ?? false;

  if (isLoading) {
    return (
      <div
        ref={customRef}
        className="brz-ed-control__multiSelect2__value brz-ed-control__multiSelect2__value--loading"
      >
        <EditorIcon
          icon="nc-circle-02"
          className="brz-ed-control__multiSelect2__spinner brz-ed-animated--spin"
        />
      </div>
    );
  }

  const title = valueTitle(items, value);
  const className = classNames("brz-ed-control__multiSelect2__value", {
    "brz-ed-control__multiSelect2__value--placeholder":
      title === undefined && placeholder !== undefined
  });

  return (
    <div ref={customRef} className={className} onClick={onClick}>
      <span className="brz-span">{title ?? placeholder}</span>
      {showArrow && (
        <EditorIcon
          icon="nc-stre-down"
          className="brz-control__select--arrow"
        />
      )}
    </div>
  );
}

type SelectDropdownProps<T> = {
  customRef: Ref<HTMLDivElement>; // this was done because React.forwardRef does not work with generics
  items: ItemProps<T>[];
  value: T[];
  style: CSSProperties;
  search?: boolean;
  searchIsEmpty?: boolean;
  searchIsLoading?: boolean;
  useAsSimpleSelect?: boolean;
  onItemClick: (item: ItemProps<T>) => void;
  onSearchChange?: (s: string) => void;
};
function SelectDropdown<T>({
  customRef, // this was done because React.forwardRef does not work with generics
  items,
  value,
  style,
  search,
  searchIsEmpty,
  searchIsLoading,
  useAsSimpleSelect,
  onItemClick,
  onSearchChange
}: SelectDropdownProps<T>): ReactElement {
  useEffect(() => {
    return (): void => {
      onSearchChange?.("");
    };
    // onSearchChange dependency is not nedded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const className = classNames("brz-ed-control__multiSelect2__dropdown", {
    "brz-ed-control__multiSelect2__dropdown--with-search": search,
    "brz-ed-control__multiSelect2__dropdown--search-loading": searchIsLoading
  });
  const spinnerClassName = classNames("brz-ed-control__multiSelect2__spinner", {
    "brz-ed-control__multiSelect2__spinner--hidden": !searchIsLoading,
    "brz-ed-animated--spin": searchIsLoading
  });

  return (
    <div ref={customRef} className={className} style={style}>
      {search && (
        <div className="brz-ed-control__multiSelect2__search">
          <input
            className="brz-input"
            placeholder={t("Type to Search ...")}
            autoFocus={true}
            spellCheck={false}
            onChange={
              onSearchChange && ((e): void => onSearchChange(e.target.value))
            }
          />
          <EditorIcon icon="nc-circle-02" className={spinnerClassName} />
        </div>
      )}
      <Scrollbar
        autoHeight={true}
        autoHeightMax={150} // hardcoded for 5 items * 30px each
      >
        <ul className="brz-ul">
          {items.map((item) => (
            <SelectItem
              key={String(item.value)}
              title={item.title}
              value={item.value}
              icon={!useAsSimpleSelect}
              active={value.includes(item.value)}
              onClick={(): void => onItemClick(item)}
            />
          ))}
          {search && searchIsEmpty && <SelectItemNoResults />}
        </ul>
      </Scrollbar>
    </div>
  );
}

type SelectItemProps<T> = {
  title: string;
  value: T;
  active?: boolean;
  onClick: () => void;
  icon?: boolean;
};
function SelectItem<T>({
  title,
  active = false,
  onClick,
  icon = true
}: SelectItemProps<T>): ReactElement {
  const className = classNames("brz-ed-control__multiSelect2__option", {
    "brz-ed-control__multiSelect2__option--active": active
  });
  const checkboxIcon = active ? "nc-check-square-on" : "nc-check-square-off";

  return (
    <li className={className} title={title} onClick={onClick}>
      {icon && (
        <EditorIcon
          icon={checkboxIcon}
          className="brz-ed-control__multiSelect2__option-checkbox"
        />
      )}
      <span className="brz-ed-control__multiSelect2__option-text">{title}</span>
    </li>
  );
}

function SelectItemNoResults(): ReactElement {
  return (
    <li className="brz-ed-control__multiSelect2__option brz-ed-control__multiSelect2__option--disabled">
      {t("No results")}
    </li>
  );
}
