import { noop } from "es-toolkit";
import React, { Component } from "react";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import { Button } from "../../../common/Button";

class ViewFields extends Component {
  static defaultProps = {
    id: "",
    title: "",
    img: "",
    confirmed: false,
    error: false,
    nextLoading: false,
    prevLoading: false,
    onChange: noop,
    onChangeConfirmation: noop,
    onNext: noop,
    onPrev: noop
  };

  handleConfirmation = (e) => {
    this.props.onChangeConfirmation(e.target.checked);
  };

  handleKeyDown = (e) => {
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
      <div className="brz-ed-alert brz-ed-alert-error brz-ed-popup-common-validation-error">
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
        <InputPlaceholder
          key={index}
          title={title}
          value={value}
          required={true}
          onChange={(e) => {
            onChange(e.target.value, name);
          }}
        />
      );
    });
  }

  renderDescriptions() {
    const description = t(
      'I have deselected "Verify the origins of reCAPTCHA solutions and clicked "Save Changes" under "Key Settings > Advanced Settings" in my Google reCAPTCHA page'
    );

    return (
      <div className="brz-ed-popup-common__confirmation">
        <label className="brz-label">
          <input
            className="brz-input"
            type="checkbox"
            value={this.props.confirmed}
            onChange={this.handleConfirmation}
          />
          <span dangerouslySetInnerHTML={{ __html: description }} />
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
      <Scrollbar theme="light">
        <div className="brz-ed-popup-common__connect">
          <div className="brz-ed-popup-common__container">
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
                <Button color="teal" loading={nextLoading} onClick={onRetry}>
                  {t("Try Again")}
                </Button>
              ) : (
                <Button
                  color="teal"
                  loading={nextLoading}
                  disabled={!confirmed}
                  onClick={onNext}
                >
                  {t("Connect")}
                </Button>
              )}
              <Button color="default" loading={prevLoading} onClick={onPrev}>
                {t("Cancel")}
              </Button>
            </div>
          </div>
        </div>
      </Scrollbar>
    );
  }
}

export default ViewFields;
