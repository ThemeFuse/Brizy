import React, { Component } from "react";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
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
            {t("You have successfully connect the form with")} {title}
          </p>
        </div>
        <Button color="teal" onClick={onNext}>
          {t("Done")}
        </Button>
      </div>
    );
  }
}

export default ViewDone;
