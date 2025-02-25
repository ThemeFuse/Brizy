import { noop } from "es-toolkit";
import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import { Button } from "../../Button";

class Disconnect extends Component {
  static defaultProps = {
    title: "",
    descriptions: "",
    nextLoading: null,
    prevLoading: null,
    error: null,
    onNext: noop,
    onPrev: noop
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
    const hasButtons = nextLoading !== null && prevLoading !== null;

    return (
      <div className="brz-ed-popup-integrations__connect">
        <div className="brz-ed-popup-integrations__connect-head">
          <img className="brz-img" src={img} alt={title} />
          <p className="brz-p">{descriptions}</p>
        </div>
        <br />
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations__connect-body">
          {hasButtons && (
            <div className="brz-ed-popup-integrations-step__buttons">
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
          )}
        </div>
      </div>
    );
  }
}

export default Disconnect;
