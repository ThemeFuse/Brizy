import classNames from "classnames";
import React, { ReactElement, RefObject, useCallback, useMemo } from "react";
import { useState } from "react";
import { Manager, Popper, Reference } from "react-popper";
import { ClickOutside } from "../ClickOutside";
import { t } from "../utils/i18n";
import { InternalLinkValue } from "./Components/InternalLinkValue";
import { SelectDropdown } from "./Components/SelectDropdown";
import { SelectItem, SelectItemNoResults } from "./Components/SelectItem";
import { Props, Status } from "./types";
import { divStyles, isValuePopulated, trimTitle } from "./utils";

export const InternalLink: React.FC<Props> = ({
  className,
  value,
  placeholder,
  items,
  status,
  isLoading,
  resetValue,
  onSearch,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const inputValueClassName = classNames(
    {
      "brz-ed-control__internalLink__value--placeholder": !value?.title
    },
    className
  );

  const _value = trimTitle(value?.title || placeholder || t("Type name"));

  const handleRemove = useMemo(
    () => (value?.title ? resetValue : undefined),
    [value, resetValue]
  );
  const handleClick = useCallback(
    () => !isValuePopulated(value) && setIsOpen((v) => !v),
    [value, setIsOpen]
  );
  const handleClickOutside = useCallback(() => setIsOpen(false), [setIsOpen]);

  const selectItems =
    status === Status.NO_RESULT ? (
      <SelectItemNoResults />
    ) : (
      <ul className="brz-ul">
        {items.map((item, index) => (
          <SelectItem
            key={index}
            title={item.title}
            onClick={(): void => onChange(item)}
          />
        ))}
      </ul>
    );

  return (
    <ClickOutside onClickOutside={handleClickOutside}>
      {(ref: RefObject<HTMLDivElement>) => (
        <div ref={ref} className="brz-ed-control__internalLink">
          <Manager>
            <Reference>
              {({ ref }): ReactElement => (
                <InternalLinkValue
                  className={inputValueClassName}
                  ref={ref}
                  value={_value}
                  onClick={handleClick}
                  onRemove={handleRemove}
                />
              )}
            </Reference>
          </Manager>
          <div style={divStyles}>
            <Popper>
              {({ ref, style }) =>
                isOpen && (
                  <SelectDropdown
                    ref={ref}
                    style={style}
                    isSearchLoading={isLoading}
                    onSearchChange={onSearch}
                  >
                    {selectItems}
                  </SelectDropdown>
                )
              }
            </Popper>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};
