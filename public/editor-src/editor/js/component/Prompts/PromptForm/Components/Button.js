import React, { Component } from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

const classNameByType = {
  gray: "brz-ed-btn-width-3 brz-ed-btn-gray",
  tail: "brz-ed-btn-width-1 brz-ed-btn-teal",
  default: "brz-ed-btn-width-1 brz-ed-btn-default",
  red: "brz-ed-btn-width-1 brz-ed-btn-red"
};

class Button extends Component {
  static defaultProps = {
    className: "",
    type: "", // gray | tail | red | default
    rightIcon: "",
    leftIcon: "",
    loading: false,
    onClick: () => {}
  };

  render() {
    const {
      className: _className,
      type,
      rightIcon,
      leftIcon,
      loading,
      children,
      onClick
    } = this.props;
    const className = classnames(
      "brz-button brz-ed-btn",
      "brz-ed-btn-sm brz-ed-btn-rounded",
      _className,
      loading ? "brz-ed-btn--loading" : "brz-ed-btn-icon",
      { "brz-ed-btn-icon--left": leftIcon },
      { "brz-ed-btn-icon--right": rightIcon },
      classNameByType[type]
    );

    return (
      <button className={className} onClick={onClick}>
        {loading ? (
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        ) : (
          <React.Fragment>
            {leftIcon && <EditorIcon icon={leftIcon} />}
            {children}
            {rightIcon && <EditorIcon icon={rightIcon} />}
          </React.Fragment>
        )}
      </button>
    );
  }
}

export default Button;
