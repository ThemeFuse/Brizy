import React, { Component } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import Button from "../../../common/Button";
import ScrollPane from "visual/component/ScrollPane";

class ViewFields extends Component {
  static defaultProps = {
    id: "",
    title: "",
    img: "",
    confirmed: false,
    error: false,
    nextLoading: false,
    prevLoading: false,
    onChange: _.noop,
    onChangeConfirmation: _.noop,
    onNext: _.noop,
    onPrev: _.noop
  };

  handleConfirmation = e => {
    this.props.onChangeConfirmation(e.target.checked);
  };

  handleKeyDown = e => {
    const { confirmed, onNext } = this.props;

    // prevent enter
    if (e.which === 13 && confirmed) {
      onNext();
    }
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">{this.props.error}</div>
    );
  }

  renderValidationError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error brz-ed-popup-recaptcha-validation-error">
        <p className="brz-p">
          {t(
            "Verification process failed, please make sure you have done the following three things and try again in a few minutes."
          )}
        </p>
        <p className="brz-p">1. {t("Inputted a valid site key")}. </p>
        <p className="brz-p">
          2.
          {t(
            "Deselected the “Verify the origin of reCAPTCHA solutions” checkbox within your Google account."
          )}
        </p>
        <p className="brz-p">
          3. {t("Established a stable internet connection")}.
        </p>
      </div>
    );
  }

  renderItems() {
    const { data, onChange } = this.props;

    return data.map((key, index) => {
      const { title, name, value } = key;

      return (
        <label key={index} className="brz-ed-popup-integrations__connect-label">
          <input
            className="brz-input"
            name={key}
            type="text"
            value={value}
            required
            onChange={e => {
              onChange(e.target.value, name);
            }}
            onKeyDown={this.handleKeyDown}
          />
          <p className="brz-p">
            <strong className="brz-strong">
              {title} <span className="brz-span">({t("required")})</span>
            </strong>
          </p>
        </label>
      );
    });
  }

  renderDescriptions() {
    return (
      <div className="brz-ed-popup-recaptcha__confirmation">
        <label className="brz-label">
          <input
            className="brz-input"
            type="checkbox"
            value={this.props.confirmed}
            onChange={this.handleConfirmation}
          />
          I have deselected "Verify the origins of reCAPTCHA solu-
          <br className="brz-br" />
          tions and clicked "Save Changes" under "Key Settings >
          <br className="brz-br" />
          Advanced Settings" in my Google reCAPTCHA page
        </label>
      </div>
    );
  }

  render() {
    const {
      title,
      img,
      validated,
      confirmed,
      error,
      nextLoading,
      prevLoading,
      onRetry,
      onNext,
      onPrev
    } = this.props;

    return (
      <ScrollPane
        className="brz-ed-popup-integrations-apps__scroll-pane"
        style={{ height: "100%" }}
      >
        <div className="brz-ed-popup-recaptcha__connect">
          <div className="brz-ed-popup-recaptcha__container">
            <div className="brz-ed-popup-integrations__connect-head">
              <img className="brz-img" src={img} alt={title} />
              {validated
                ? this.renderDescriptions()
                : this.renderValidationError()}
              {error && this.renderError()}
            </div>
            <div className="brz-ed-popup-integrations__connect-body">
              {this.renderItems()}
              {!validated ? (
                <Button type="tail" loading={nextLoading} onClick={onRetry}>
                  {t("Try Again")}
                </Button>
              ) : (
                <Button
                  type="tail"
                  loading={nextLoading}
                  disabled={!confirmed}
                  onClick={onNext}
                >
                  {t("Connect")}
                </Button>
              )}
              <Button type="default" loading={prevLoading} onClick={onPrev}>
                {t("Cancel")}
              </Button>
            </div>
          </div>
        </div>
      </ScrollPane>
    );
  }
}

export default ViewFields;
