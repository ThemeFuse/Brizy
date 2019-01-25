import React, { Component } from "react";
import classnames from "classnames";

export default class Progress extends Component {
  static defaultProps = {
    stage: ""
  };

  render() {
    const { stage, children } = this.props;

    return (
      <div className="brz-ed-popup-integrations__progress">
        {React.Children.map(children, child => {
          return child && React.cloneElement(child, { stage });
        })}
      </div>
    );
  }
}

export const Stage = ({ stage, num, text }) => {
  const className = classnames("brz-ed-popup-integrations__progress-stage", {
    "brz-ed-popup-integrations__progress-stage--active": num === stage
  });

  return (
    <div className={className}>
      <span className="brz-span">{text}</span>
    </div>
  );
};
