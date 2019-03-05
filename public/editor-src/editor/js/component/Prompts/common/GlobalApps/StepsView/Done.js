import React, { Component } from "react";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import Button from "../../../common/Button";

class ViewDone extends Component {
  static defaultProps = {
    title: "",
    onNext: _.noop
  };

  render() {
    const { title, onNext } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__done">
        <div className="brz-ed-popup-integrations-step__done-icon">
          <EditorIcon icon="nc-check-light" />
        </div>
        <div className="brz-ed-popup-integrations-step__done-content">
          <p className="brz-p">
            You have successfully connect the form with {title}
          </p>
        </div>
        <Button type="tail" onClick={onNext}>
          Done
        </Button>
      </div>
    );
  }
}

export default ViewDone;
