import classNames from "classnames";
import React, { ForwardedRef, ReactElement, useEffect } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Search } from "./Search";
import { SelectDropdownProps } from "./types";

const _SelectDropdown = (
  { style, searchIsLoading, children, onSearchChange }: SelectDropdownProps,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement => {
  useEffect(() => {
    return (): void => {
      onSearchChange?.("");
    };
  }, [onSearchChange]);

  const className = classNames(
    "brz-ed-control__internalLink__dropdown",
    "brz-ed-control__internalLink__dropdown--with-search",
    {
      "brz-ed-control__internalLink__dropdown--search-loading": searchIsLoading
    }
  );

  return (
    <div ref={ref} className={className} style={style}>
      <Search loading={searchIsLoading} onChange={onSearchChange} />

      <Scrollbars
        autoHeight={true}
        autoHeightMax={150} // hardcoded for 5 items * 30px each
        renderThumbVertical={(props): ReactElement => {
          return (
            <div
              className={"brz-ed-control__multiSelect__scroll-thumb"}
              {...props}
            />
          );
        }}
      >
        {children}
      </Scrollbars>
    </div>
  );
};

export const SelectDropdown = React.forwardRef<
  HTMLDivElement,
  SelectDropdownProps
>(_SelectDropdown);
