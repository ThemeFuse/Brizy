import classNames from "classnames";
import React, { FC } from "react";

export interface Props {
  className?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

export const Input: FC<Props> = ({
  className = "",
  value,
  onChange,
  onBlur,
  placeholder = ""
}) => {
  const baseClass = "brz-ed-control__input2";
  const _className = classNames(baseClass, className);

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
