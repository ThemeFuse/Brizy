import React, { Component } from "react";
import Steps, { Step } from "./Steps";
import Progress, { Stage } from "./Progress";

class Steppers extends Component {
  static defaultProps = {
    stage: "",
    apps: []
  };
  static Steps = Steps;
  static Step = Step;
  static Progress = Progress;
  static Stage = Stage;

  render() {
    const { stage, apps, children } = this.props;

    return React.Children.map(children, child => {
      return child && React.cloneElement(child, { stage, apps });
    });
  }
}

export default Steppers;
