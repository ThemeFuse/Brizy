import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Button from "../../Components/Button";

class ViewFields extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    form: {},
    formFields: [],
    usedAccount: "",
    accounts: [],

    usedList: "",
    lists: [],

    fieldsMap: "",
    fields: [],
    nextLoading: false,
    prevLoading: false,
    handlePrev: _.noop,
    handleNext: _.noop
  };

  renderOptions() {
    const { formFields, handleActive } = this.props;
    const options = formFields.map(({ sourceTitle, target, sourceId }) => {
      const value = target === "_auto_generate" ? sourceTitle : target;

      return (
        <div
          key={sourceId}
          className="brz-ed-popup-integrations-step__fields-option"
        >
          <p className="brz-p">{sourceTitle}</p>
          <div className="brz-ed-popup-integrations-step__fields-input">
            <input
              className="brz-input"
              required
              type="text"
              value={value}
              onChange={e => {
                handleActive(sourceId, e.target.value);
              }}
            />
          </div>
        </div>
      );
    });

    return (
      <ScrollPane
        style={{ maxHeight: 255 }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations__scroll-pane"
      >
        {options}
      </ScrollPane>
    );
  }

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
      error,
      prevLoading,
      nextLoading,
      handlePrev,
      handleNext
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__fields">
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">FORM FIELDS</strong>
          </p>
          <p className="brz-p">
            <strong className="brz-strong">{title} FIELDS</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {this.renderOptions()}
          <div className="brz-ed-popup-integrations-step__buttons">
            <Button
              type="gray"
              leftIcon="nc-arrow-left"
              loading={prevLoading}
              onClick={handlePrev}
            >
              Back
            </Button>
            <Button
              type="tail"
              rightIcon="nc-arrow-right"
              loading={nextLoading}
              onClick={handleNext}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewFields;
