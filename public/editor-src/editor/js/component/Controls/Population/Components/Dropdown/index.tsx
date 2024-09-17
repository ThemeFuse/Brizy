import classnames from "classnames";
import React, { useCallback } from "react";
import { Manager, Popper, Reference } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import { PopulationIcon } from "../../PopulationIcon";
import type { Props } from "./types";
import { FCC } from "visual/utils/react/types";

export const Dropdown: FCC<Props> = (props) => {
  const { isOpen, className, onOpened, children, clickOutsideExceptions } =
    props;
  const iconClassName = classnames({
    "brz-control__select--active": isOpen
  });
  const wrapperClassName = classnames(
    "brz-ed-control__population--wrapper",
    "brz-control__select-current",
    "brz-control__select-current__icon",
    className
  );

  const handleIconClick = useCallback(() => {
    onOpened(true);
  }, [onOpened]);

  const handleClickOutside = useCallback(() => {
    onOpened(false);
  }, [onOpened]);

  return (
    <div className={wrapperClassName}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <PopulationIcon
              ref={ref}
              className={iconClassName}
              onClick={handleIconClick}
            />
          )}
        </Reference>
        <div style={{ position: "relative" }}>
          <Popper placement="bottom-start">
            {({ ref, style }) => {
              if (!isOpen) {
                return null;
              }

              return (
                <ClickOutside
                  exceptions={clickOutsideExceptions}
                  onClickOutside={handleClickOutside}
                >
                  <div
                    style={style}
                    ref={ref}
                    className="brz-ed-control__population-content-wrapper"
                  >
                    {children}
                  </div>
                </ClickOutside>
              );
            }}
          </Popper>
        </div>
      </Manager>
    </div>
  );
};
