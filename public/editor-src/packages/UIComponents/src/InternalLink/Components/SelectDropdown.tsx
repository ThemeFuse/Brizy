import classNames from "classnames";
import React from "react";
import { ReactElement, useEffect } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Search } from "./Search";
import { SelectDropdownProps } from "./types";

export const SelectDropdown = React.forwardRef<
  HTMLDivElement,
  SelectDropdownProps
>(({ style, isSearchLoading, children, onSearchChange }, ref) => {
  useEffect(() => {
    return (): void => {
      onSearchChange?.("");
    };
  }, [onSearchChange]);

  const className = classNames(
    "brz-ed-control__internalLink__dropdown",
    "brz-ed-control__internalLink__dropdown--with-search",
    {
      "brz-ed-control__internalLink__dropdown--search-loading": isSearchLoading
    }
  );

  return (
    <div ref={ref} className={className} style={style}>
      <Search isLoading={isSearchLoading} onChange={onSearchChange} />

      <Scrollbars
        autoHeight
        autoHeightMax={150} // hardcoded for 5 items * 30px each
        renderThumbVertical={(props): ReactElement => {
          return (
            <div
              className="brz-ed-control__multiSelect__scroll-thumb"
              {...props}
            />
          );
        }}
      >
        {children}
      </Scrollbars>
    </div>
  );
});
