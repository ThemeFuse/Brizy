import React, { Component } from "react";

export default class Steps extends Component {
  static defaultProps = {
    stage: "",
    apps: []
  };

  render() {
    const { stage, apps, children, onClose } = this.props;

    return React.Children.map(children, child => {
      return (
        stage === child.props.num &&
        React.cloneElement(child, {
          apps,
          onClose
        })
      );
    });
  }
}

export const Step = ({ render, ...props }) => render(props);
