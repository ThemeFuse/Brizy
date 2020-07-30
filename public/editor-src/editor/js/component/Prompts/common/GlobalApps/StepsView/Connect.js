import React, { Component } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import Button from "../../../common/Button";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";

class Connect extends Component {
  static defaultProps = {
    img: "",
    title: "",
    descriptions: "",
    data: [
      {
        title: "",
        name: "",
        value: ""
      }
    ],
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

  handleKeyDown = e => {
    // prevent enter
    if (e.which === 13) {
      this.props.onNext();
    }
  };

  renderInputs() {
    const { data, onChange } = this.props;

    return data.map((key, index) => {
      const { title, name, value } = key;

      return (
        <InputPlaceholder
          key={index}
          title={title}
          name={name}
          required={true}
          value={value}
          onChange={({ target }) => {
            onChange(target.value, name);
          }}
          onKeyDonw={this.handleKeyDown}
        />
      );
    });
  }

  render() {
    const {
      img,
      title,
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
          <img className="brz-img" src={img} title={title} alt={title} />
          <p className="brz-p">{descriptions}</p>
          <p className="brz-p brz-ed-popup-integrations__connect-info">
            <a className="brz-a" href="#" target="_blank">
              {t("Need help")}?
            </a>
          </p>
        </div>
        <div className="brz-ed-popup-integrations__connect-body">
          {error && this.renderError()}
          {this.renderInputs()}
          {nextLoading !== null && (
            <Button color="teal" loading={nextLoading} onClick={onNext}>
              {t("Connect")}
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

export default Connect;
