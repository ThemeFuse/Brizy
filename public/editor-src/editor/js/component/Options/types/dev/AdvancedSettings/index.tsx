import classnames from "classnames";
import React, { type JSX, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconLabel } from "visual/component/Controls/AdvancedSettings/IconLabel";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import type { Props } from "./types";

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: migrated from eslint
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
