import React, { Component } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import Button from "../../../common/Button";

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
        <label key={index} className="brz-ed-popup-integrations__connect-label">
          <input
            className="brz-input"
            name={title}
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
          <img className="brz-img" src={img} title={title} />
          <p className="brz-p">{descriptions}</p>
        </div>
        <div className="brz-ed-popup-integrations__connect-body">
          {error && this.renderError()}
          {this.renderInputs()}
          {nextLoading !== null && (
            <Button type="tail" loading={nextLoading} onClick={onNext}>
              {t("Connect")}
            </Button>
          )}
          {prevLoading !== null && (
            <Button type="default" loading={prevLoading} onClick={onPrev}>
              {t("Cancel")}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Connect;
