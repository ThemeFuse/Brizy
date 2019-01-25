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
    emailTo: "",
    subject: "",
    active: "",
    nextLoading: false,
    prevLoading: false,
    handleActive: _.noop,
    handlePrev: _.noop,
    handleNext: _.noop
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  renderOptions() {
    const { emailTo, subject, handleActive } = this.props;

    return (
      <ScrollPane
        style={{ maxHeight: 255 }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations__scroll-pane"
      >
        <div className="brz-ed-popup-integrations-step__fields-option">
          <p className="brz-p">Email To</p>
          <div className="brz-ed-popup-integrations-step__fields-input">
            <input
              className="brz-input"
              required
              type="text"
              value={emailTo}
              required
              onChange={e => {
                handleActive("emailTo", e.target.value);
              }}
            />
          </div>
        </div>
        <div className="brz-ed-popup-integrations-step__fields-option">
          <p className="brz-p">Subject Message</p>
          <div className="brz-ed-popup-integrations-step__fields-input">
            <input
              className="brz-input"
              required
              type="text"
              value={subject}
              required
              onChange={e => {
                handleActive("subject", e.target.value);
              }}
            />
          </div>
        </div>
      </ScrollPane>
    );
  }

  render() {
    const {
      error,
      title,
      prevLoading,
      handlePrev,
      nextLoading,
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
