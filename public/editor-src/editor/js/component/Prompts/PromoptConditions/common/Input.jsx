import React from "react";
import classnames from "classnames";

export default function Input(props) {
  const {
    className,
    type = "text",
    placeholder = "",
    value = "",
    onChange = () => {}
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
