import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";
import Button from "../../../common/Button";
import { capitalize } from "visual/utils/string";

export default class CreateList extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    form: {},
    listsCreate: [],
    apiKeyValue: {},
    nextLoading: false,
    prevLoading: false,
    onPrev: _.noop,
    onNext: _.noop,
    onChange: _.noop
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  renderInput({ name }) {
    const { apiKeyValue, onChange } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <input
          className="brz-input"
          value={apiKeyValue[name]}
          onChange={e => {
            onChange(name, e.target.value);
          }}
        />
      </div>
    );
  }

  renderSelect({ name, choices: _choices }) {
    const { apiKeyValue, onChange } = this.props;
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
            onChange(name, itemTarget);
          }}
        >
          {options}
        </Select>
      </div>
    );
  }

  renderTextarea({ name }) {
    const { apiKeyValue, onChange } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step__fields-input">
        <textarea
          className="brz-textarea"
          value={apiKeyValue[name]}
          onChange={e => {
            onChange(name, e.target.value);
          }}
        />
      </div>
    );
  }

  renderApiKeys() {
    const fields = this.props.listsCreate.map((key, index) => {
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
      listsCreate,
      nextLoading,
      prevLoading,
      error,
      onPrev,
      onNext
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__lists-create">
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">{t("CREATE LIST")}</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {listsCreate.length > 0 && this.renderApiKeys()}

          <div className="brz-ed-popup-integrations-step__buttons">
            <Button
              size={3}
              leftIcon="nc-arrow-left"
              loading={prevLoading}
              onClick={onPrev}
            >
              {t("Back")}
            </Button>
            <Button color="teal" loading={nextLoading} onClick={onNext}>
              {t("Create")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
