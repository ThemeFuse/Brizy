import classNames from "classnames";
import React, { ReactElement, useCallback, useState } from "react";
import { Manager, Popper, Reference } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import { t } from "visual/utils/i18n";
import { InternalLinkValue } from "./Components/InternalLinkValue";
import { SelectDropdown } from "./Components/SelectDropdown";
import { SelectItem, SelectItemNoResults } from "./Components/SelectItem";
import { SourceSelect } from "./Components/SourceSelect";
import { Choice, Props, Status } from "./types";
import { isValuePopulated, trimTitle } from "./utils";

export const Control = ({
  className,
  value,
  placeholder,
  items,
  status,
  loading,
  resetValue,
  label,
  source,
  choices,
  sourceLabel,
  sourceHelper,
  onSearch,
  onChange,
  onSourceChange
}: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const inputValueClassName = classNames(
    {
      "brz-ed-control__internalLink__value--placeholder": !value?.title
    },
    className
  );

  const _value = trimTitle(value?.title || placeholder || t("Type name"));

  const handleClickItem = useCallback(
    (item: Choice): void => {
      onChange(item);
      setIsOpen(false);
    },
    [onChange]
  );

  const selectItems =
    status === Status.NO_RESULT ? (
      <SelectItemNoResults />
    ) : (
      <ul className="brz-ul">
        {items.map((item, index) => (
          <SelectItem
            key={index}
            title={item.title}
            onClick={() => handleClickItem(item)}
          />
        ))}
      </ul>
    );

  return (
    <>
      <SourceSelect
        choices={choices}
        value={{ value: source }}
        onChange={onSourceChange}
        label={sourceLabel}
        helper={sourceHelper}
        config={{ size: "large" }}
      />
      {source && (
        <div className="brz-ed-control__internalLink-wrapper">
          {label}
          <ClickOutside onClickOutside={() => setIsOpen(false)}>
            {({ ref }) => (
              <div className="brz-ed-control__internalLink" ref={ref}>
                <Manager>
                  <Reference>
                    {({ ref }): ReactElement => (
                      <InternalLinkValue
                        className={inputValueClassName}
                        ref={ref}
                        value={_value}
                        onClick={() => {
                          if (!isValuePopulated(value)) {
                            setIsOpen(!isOpen);
                          }
                        }}
                        onRemove={value?.title ? resetValue : undefined}
                      />
                    )}
                  </Reference>
                </Manager>
                <div style={{ position: "relative" }}>
                  <Popper>
                    {({ ref, style }) => {
                      if (!isOpen) {
                        return null;
                      }

                      return (
                        <SelectDropdown
                          ref={ref}
                          style={style}
                          searchIsLoading={loading}
                          onSearchChange={onSearch}
                        >
                          {selectItems}
                        </SelectDropdown>
                      );
                    }}
                  </Popper>
                </div>
              </div>
            )}
          </ClickOutside>
        </div>
      )}
    </>
  );
};
