import { noop } from "es-toolkit";
import React, { Component, KeyboardEvent } from "react";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import { Button } from "../../Button";
import { InputField } from "./index";
import { ConnectProps } from "./types";

class Connect extends Component<ConnectProps> {
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
        description: "",
        choices: []
      }
    ],
    nextLoading: null,
    prevLoading: null,
    error: null,
    onNext: noop,
    onPrev: noop
  };

  renderError(): React.JSX.Element {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    // prevent enter
    if (e.which === 13) {
      this.props.onNext && this.props.onNext();
    }
  };

  render(): React.JSX.Element {
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
      <Scrollbar theme="light">
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
            {data?.map((field, index) => (
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
      </Scrollbar>
    );
  }
}

export default Connect;
