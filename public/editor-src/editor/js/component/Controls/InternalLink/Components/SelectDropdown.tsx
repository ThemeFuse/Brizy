import classNames from "classnames";
import React, { ForwardedRef, ReactElement, useEffect } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Search } from "./Search";
import { SelectDropdownProps } from "./types";

const _SelectDropdown = (
  {
    style,
    searchIsLoading,
    children,
    onSearchChange,
    maxHeight = 150,
    attr
  }: SelectDropdownProps,
  ref: ForwardedRef<HTMLDivElement>
): ReactElement => {
  useEffect(() => {
    return (): void => {
      onSearchChange?.("");
    };
    // onSearchChange dependency is not nedded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const className = classNames(
    "brz-ed-control__internalLink__dropdown",
    "brz-ed-control__internalLink__dropdown--with-search",
    {
      "brz-ed-control__internalLink__dropdown--search-loading": searchIsLoading
    }
  );

  return (
    <div ref={ref} className={className} style={style} {...attr}>
      <Search loading={searchIsLoading} onChange={onSearchChange} />

      <Scrollbars
        autoHeight={true}
        autoHeightMax={maxHeight}
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
