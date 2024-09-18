import React, { JSX, useCallback, useEffect } from "react";
import classnames from "classnames";
import { Props } from "./types";
import { uiSelector } from "visual/redux/selectors";
import { updateUI } from "visual/redux/actions2";
import { IconLabel } from "visual/component/Controls/AdvancedSettings/IconLabel";
import { useDispatch, useSelector } from "react-redux";

const type = "rightSidebar";

export const AdvancedSettings = ({
  className: _className,
  icon,
  sidebarLabel,
  attr,
  title,
  helperContent
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { rightSidebar } = useSelector(uiSelector);
  const { isOpen, lock } = rightSidebar;

  const className = classnames(
    "brz-ed-option__advanced",
    "brz-ed-option__inline",
    _className || "",
    attr?.className || {}
  );

  useEffect(
    () => () => {
      if (isOpen && lock === undefined) {
        dispatch(
          updateUI(type, {
            ...rightSidebar,
            isOpen: false
          })
        );
      }
    },
    // dependency is not needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleLabelClick = useCallback(() => {
    if (!isOpen) {
      dispatch(
        updateUI(type, {
          ...rightSidebar,
          isOpen: true
        })
      );
    }
  }, [dispatch, isOpen, rightSidebar]);

  return (
    <IconLabel
      onClick={handleLabelClick}
      icon={icon || "nc-cog"}
      className={className}
      title={title || ""}
      label={sidebarLabel || ""}
      helperContent={helperContent}
    />
  );
};
