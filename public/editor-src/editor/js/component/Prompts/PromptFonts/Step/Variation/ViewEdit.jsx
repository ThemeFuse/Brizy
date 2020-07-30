import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Button from "visual/component/Prompts/common/Button";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

class ViewEdit extends Component {
  static defaultProps = {
    data: [
      {
        title: "",
        value: "",
        name: ""
      }
    ],
    nextLoading: null,
    prevLoading: null,
    createLoading: false,
    onPrev: _.noop,
    onNext: _.noop,
    onActive: _.noop,
    onCreate: _.noop
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  renderOptions() {
    const { data, onActive } = this.props;
    const options = data.map((option, index) => {
      const { id, title, type } = option;

      return (
        <div
          key={index}
          className="brz-ed-popup-integrations-step__fields-option brz-ed-popup-integrations-step__fields-option--big"
        >
          <p className="brz-p brz-ed-popup-integration__font-name">{title}</p>
          <p className="brz-p" style={{ fontWeight: id, flexBasis: "60%" }}>
            {type}
          </p>
          <div
            title="Disconnect"
            className="brz-ed-popup-integrations--delete"
            onClick={() => {
              onActive(id);
            }}
          >
            <EditorIcon icon="nc-trash" />
          </div>
        </div>
      );
    });

    return (
      <ScrollPane
        style={{ maxHeight: 255 }}
        className="brz-ed-popup-integrations__scroll-pane"
      >
        {options}
      </ScrollPane>
    );
  }

  render() {
    const {
      error,
      prevLoading,
      nextLoading,
      createLoading,
      onPrev,
      onNext,
      onCreate
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__fields">
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">{t("FONT VARIATION")}</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {this.renderOptions()}
          <div
            className="brz-ed-popup-integrations-new__option"
            onClick={onCreate}
          >
            <EditorIcon
              icon={createLoading ? "nc-circle-02" : "nc-add"}
              className={createLoading ? "brz-ed-animated--spin" : ""}
            />
            {t("Add new font variation")}
          </div>
          <div className="brz-ed-popup-integrations-step__buttons">
            {prevLoading !== null && (
              <Button
                size={3}
                leftIcon="nc-arrow-left"
                loading={prevLoading}
                onClick={onPrev}
              >
                {t("Back")}
              </Button>
            )}
            {nextLoading !== null && (
              <Button color="teal" loading={nextLoading} onClick={onNext}>
                {t("Continue")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewEdit;
