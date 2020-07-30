import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Switch from "visual/component/Controls/Switch";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import ReactSelect from "visual/component/Controls/ReactSelect";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import Button from "../../Button";
import { t } from "visual/utils/i18n";

class InputFields extends Component {
  static defaultProps = {
    id: "",
    headTitle: "",
    headDescription: "",
    description: "",
    data: [
      {
        title: "",
        value: "",
        name: "",
        helper: null
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
          className="brz-ed-control__switch--light"
          defaultValue={value}
          onChange={checked => {
            this.props.onActive(name, checked);
          }}
        />
      </div>
    );
  }

  renderSearch({ name, multiple, value, choices }) {
    const nValue = Boolean(value) && multiple ? value.split(",") : value;

    return (
      <div className="brz-ed-popup-integrations-step__fields-select">
        <ReactSelect
          className="brz-control__select2--light"
          multiple={multiple}
          value={nValue}
          options={choices}
          onChange={value => {
            this.props.onActive(name, multiple ? value.join(",") : value.value);
          }}
        />
      </div>
    );
  }

  renderOptions() {
    const options = this.props.data.map((option, index) => {
      const { title, required, type, helper } = option;

      return (
        <div
          key={index}
          className="brz-ed-popup-integrations-step__fields-option"
        >
          <div className="brz-d-xs-flex brz-align-items-xs-center">
            <p className="brz-p">
              {title}
              {required && (
                <strong className="brz-strong brz--required">
                  *
                </strong>
              )}
            </p>
            {helper && (
              <Tooltip
                className="brz-ed-popup-integrations-fields__tooltip"
                openOnClick={false}
                inPortal={true}
                overlay={
                  <div
                    className="brz-ed-popup-integrations-fields__info"
                    dangerouslySetInnerHTML={{ __html: helper }}
                  />
                }
              >
                <EditorIcon icon="nc-alert-circle-que" />
              </Tooltip>
            )}
          </div>
          {!type && this.renderInput(option)}
          {type === "select" && this.renderSelect(option)}
          {type === "switch" && this.renderSwitch(option)}
          {type === "search" && this.renderSearch(option)}
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

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  render() {
    const {
      headTitle,
      headDescription,
      description,
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
          {headTitle && (
            <p className="brz-p">
              <strong className="brz-strong">{headTitle}</strong>
            </p>
          )}
          {headDescription && (
            <p className="brz-p">
              <strong className="brz-strong">{headDescription}</strong>
            </p>
          )}
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {this.renderOptions()}
          {description && (
            <p className="brz-p brz-ed-popup-integrations__description">
              {description}
            </p>
          )}
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
              <Button
                color="teal"
                rightIcon="nc-arrow-right"
                loading={nextLoading}
                onClick={onNext}
              >
                {t("Continue")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default InputFields;
