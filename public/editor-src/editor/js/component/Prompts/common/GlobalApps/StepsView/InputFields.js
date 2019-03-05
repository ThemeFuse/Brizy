import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Switch from "visual/component/Controls/Switch";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import Button from "../../Button";

class InputFields extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    data: [
      {
        title: "",
        value: "",
        name: ""
      }
    ],
    nextLoading: null,
    prevLoading: null,
    onPrev: _.noop,
    onNext: _.noop,
    onActive: _.noop
  };

  renderSelect({ name, value, choices }) {
    const options = choices.map(({ title, name }) => (
      <SelectItem key={name} value={name}>
        {title}
      </SelectItem>
    ));

    return (
      <div className="brz-ed-popup-integrations-step__fields-select">
        <Select
          className="brz-control__select--white"
          maxItems="6"
          itemHeight="30"
          inPortal={true}
          defaultValue={value}
          onChange={v => {
            this.props.onActive(name, v);
          }}
        >
          {options}
        </Select>
      </div>
    );
  }

  renderInput({ name, value }) {
    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <input
          className="brz-input"
          required
          type={name === "password" ? "password" : "text"}
          value={value}
          onChange={e => {
            this.props.onActive(name, e.target.value);
          }}
        />
      </div>
    );
  }

  renderSwitch({ name, value }) {
    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <Switch
          defaultValue={value}
          onChange={checked => {
            this.props.onActive(name, checked);
          }}
        />
      </div>
    );
  }

  renderOptions() {
    const options = this.props.data.map((option, index) => {
      const { title, type } = option;

      return (
        <div
          key={index}
          className="brz-ed-popup-integrations-step__fields-option"
        >
          <p className="brz-p">{title}</p>
          {!type && this.renderInput(option)}
          {type === "select" && this.renderSelect(option)}
          {type === "switch" && this.renderSwitch(option)}
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
      onPrev,
      onNext
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
            {prevLoading !== null && (
              <Button
                type="gray"
                leftIcon="nc-arrow-left"
                loading={prevLoading}
                onClick={onPrev}
              >
                Back
              </Button>
            )}
            {nextLoading !== null && (
              <Button
                type="tail"
                rightIcon="nc-arrow-right"
                loading={nextLoading}
                onClick={onNext}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default InputFields;
