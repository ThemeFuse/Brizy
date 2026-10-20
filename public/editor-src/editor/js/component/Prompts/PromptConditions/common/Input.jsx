import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";

export default function Input(props) {
  const {
    className,
    type = "text",
    placeholder = "",
    value = "",
    onChange = noop
  } = props;
  const classNames = classnames("brz-input", className);

  return (
    <div className="brz-control__select">
      <input
        className={classNames}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </div>
  );
}
