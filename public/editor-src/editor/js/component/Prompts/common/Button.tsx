import React, { FC, MouseEvent } from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  className?: string;
  color?: "gray" | "teal" | "red" | "default" | "pro";
  type?: "button" | "link";
  size?: 1 | 2 | 3 | 4;
  rightIcon?: string;
  leftIcon?: string;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  target?: string;
  onClick?: (e: MouseEvent) => void;
}

export const Button: FC<Props> = props => {
  const {
    className: _className,
    size = 1,
    color = "gray",
    type = "button",
    rightIcon,
    leftIcon,
    loading,
    disabled,
    children,
    href,
    target,
    onClick
  } = props;
  const className = classnames(
    "brz-button brz-ed-btn",
    "brz-ed-btn-sm brz-ed-btn-rounded",
    _className,
    loading ? "brz-ed-btn--loading" : "brz-ed-btn-icon",
    `brz-ed-btn-width-${size}`,
    `brz-ed-btn-${color}`,
    { "brz-ed-btn-icon--left": leftIcon },
    { "brz-ed-btn-icon--right": rightIcon },
    { "brz-ed-btn--disabled": disabled }
  );

  const content = loading ? (
    <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
  ) : (
    <React.Fragment>
      {leftIcon && <EditorIcon icon={leftIcon} />}
      {children}
      {rightIcon && <EditorIcon icon={rightIcon} />}
    </React.Fragment>
  );

  switch (type) {
    case "link": {
      return (
        <a
          className={className}
          target={target}
          href={href}
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {content}
        </a>
      );
    }
    case "button": {
      return (
        <button className={className} onClick={onClick}>
          {content}
        </button>
      );
    }
  }
};
