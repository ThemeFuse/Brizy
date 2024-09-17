import classnames from "classnames";
import React from "react";
import { CheckGroupItemEditor } from "./CheckGroupItemEditor";
import { CheckGroupItemView } from "./CheckGroupItemView";
import { CheckGroupItem as _CheckGroupItem } from "./types";

export const CheckGroupItem = ({
  className: _className,
  active,
  inline,
  divider,
  value,
  name,
  isEditor,
  required,
  renderIcons,
  children,
  onClick,
  label,
  type,
  ...attributes
}: _CheckGroupItem): JSX.Element => {
  const className = classnames(
    "brz-control__check-group-option",
    {
      "brz-control__check-group-option--divider": divider,
      "brz-control__check-group-option--inline": inline
    },
    _className
  );

  const _active = !!active;

  return (
    <>
      {isEditor ? (
        <CheckGroupItemEditor
          className={className}
          value={value}
          name={name}
          active={_active}
          renderIcons={renderIcons}
          onClick={onClick}
        >
          {children}
        </CheckGroupItemEditor>
      ) : (
        <CheckGroupItemView
          className={className}
          value={value}
          name={name}
          required={required}
          renderIcons={renderIcons}
          active={_active}
          attributes={attributes}
          label={label}
          type={type}
        >
          {children}
        </CheckGroupItemView>
      )}
    </>
  );
};
