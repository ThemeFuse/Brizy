import React, { FC } from "react";
import classNames from "classnames";

export interface Props {
  className?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  size?: "short" | "medium" | "large" | "auto";
  placeholder?: string;
}

export const Input: FC<Props> = ({
  className = "",
  value,
  onChange,
  onBlur,
  size = "auto",
  placeholder = ""
}) => {
  const baseClass = "brz-ed-control__input2";
  const _className = classNames(baseClass, className, `${baseClass}--${size}`);

  return (
    <div className={_className}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={({ target: { value } }): void => onChange(value)}
        onBlur={onBlur}
      />
    </div>
  );
};
