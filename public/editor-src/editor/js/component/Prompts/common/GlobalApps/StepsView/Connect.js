import React, { Component } from "react";
import _ from "underscore";
import { t } from "visual/utils/i18n";
import { Button } from "../../../common/Button";
import { InputField } from "./index";

class Connect extends Component {
  static defaultProps = {
    img: "",
    title: "",
    descriptions: "",
    data: [
      {
        title: "",
        name: "",
        value: "",
        type: "",
        choices: []
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

  handleKeyDown = (e) => {
    // prevent enter
    if (e.which === 13) {
      this.props.onNext();
    }
  };

  render() {
    const {
      img,
      title,
      descriptions,
      error,
      nextLoading,
      prevLoading,
      onNext,
      onPrev,
      docsUrl,
      data,
      onChange
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations__connect">
        <div className="brz-ed-popup-integrations__connect-head">
          <img className="brz-img" src={img} title={title} alt={title} />
          <p className="brz-p">{descriptions}</p>
          <p className="brz-p brz-ed-popup-integrations__connect-info">
            <a
              className="brz-a"
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t("Need help")}?
            </a>
          </p>
        </div>
        <div className="brz-ed-popup-integrations__connect-body">
          {error && this.renderError()}
          {data.map((field, index) => (
            <InputField
              key={index}
              field={field}
              onChange={onChange}
              onKeyDown={this.handleKeyDown}
            />
          ))}
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
