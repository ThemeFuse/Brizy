import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Button from "../../Components/Button";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { capitalize } from "visual/utils/string";

export default class CreateList extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    form: {},
    data: {},
    apiKeyValue: {},
    nextLoading: false,
    prevLoading: false,
    handlePrev: _.noop,
    handleNext: _.noop,
    handleChange: _.noop
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  renderInput({ name }) {
    const { apiKeyValue, handleChange } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <input
          className="brz-input"
          value={apiKeyValue[name]}
          onChange={e => {
            handleChange(name, e.target.value);
          }}
        />
      </div>
    );
  }

  renderSelect({ name, choices: _choices }) {
    const { apiKeyValue, handleChange } = this.props;
    const value = apiKeyValue[name];
    const choices = value
      ? _choices
      : [{ id: "", name: "Please Select Folder" }, ..._choices];
    const options = choices.map((option, index) => {
      const { id, name } = option;

      return (
        <SelectItem key={index} value={id}>
          {name}
        </SelectItem>
      );
    });

    return (
      <div className="brz-ed-popup-integrations-step__fields-select">
        <Select
          defaultValue={value}
          className="brz-control__select--white"
          maxItems="6"
          itemHeight="30"
          inPortal={true}
          onChange={itemTarget => {
            handleChange(name, itemTarget);
          }}
        >
          {options}
        </Select>
      </div>
    );
  }

  renderTextarea({ name }) {
    const { apiKeyValue, handleChange } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <textarea
          className="brz-textarea"
          value={apiKeyValue[name]}
          onChange={e => {
            handleChange(name, e.target.value);
          }}
        />
      </div>
    );
  }

  renderApiKeys() {
    const fields = this.props.data.listApiKeys.map((key, index) => {
      const { title, type } = key;

      return (
        <div
          key={index}
          className="brz-ed-popup-integrations-step__fields-option"
        >
          <p className="brz-p">{title}</p>
          {this[`render${capitalize(type)}`](key)}
        </div>
      );
    });

    return (
      <ScrollPane
        style={{ maxHeight: 255 }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations__scroll-pane"
      >
        {fields}
      </ScrollPane>
    );
  }

  render() {
    const {
      data: { listApiKeys },
      nextLoading,
      prevLoading,
      error,
      handlePrev,
      handleNext
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__lists-create">
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">CREATE LIST</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {listApiKeys.length && this.renderApiKeys()}

          <div className="brz-ed-popup-integrations-step__buttons">
            <Button
              type="gray"
              leftIcon="nc-arrow-left"
              loading={prevLoading}
              onClick={handlePrev}
            >
              Back
            </Button>
            <Button type="tail" loading={nextLoading} onClick={handleNext}>
              Create
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
