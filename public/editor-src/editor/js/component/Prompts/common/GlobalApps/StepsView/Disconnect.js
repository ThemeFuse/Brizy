import React, { Component } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import Button from "../../Button";

class Disconnect extends Component {
  static defaultProps = {
    title: "",
    descriptions: "",
    nextLoading: null,
    prevLoading: null,
    error: null,
    onNext: _.noop,
    onPrev: _.noop
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  render() {
    const {
      title,
      img,
      descriptions,
      error,
      nextLoading,
      prevLoading,
      onNext,
      onPrev
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations__connect">
        <div className="brz-ed-popup-integrations__connect-head">
          <img className="brz-img" src={img} alt={title} />
          <p className="brz-p">{descriptions}</p>
        </div>
        <div className="brz-ed-popup-integrations__connect-body">
          {error && this.renderError()}
          {nextLoading !== null && (
            <Button color="red" loading={nextLoading} onClick={onNext}>
              {t("Disconnect")}
            </Button>
          )}
          {prevLoading !== null && (
            <Button color="default" loading={prevLoading} onClick={onPrev}>
              {t("Cancel")}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Disconnect;
