import React, { Component, Fragment } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import Tooltip from "visual/component/Controls/Tooltip";
import Button from "visual/component/Prompts/common/Button";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

class ViewAdd extends Component {
  static defaultProps = {
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

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

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

  renderUpload({ name, value, accept }) {
    return (
      <div className="brz-ed-popup-integrations-step__fields-upload">
        {value ? (
          <Fragment>
            <span className="brz-span">{value.name}</span>
            <button
              className="brz-button brz-ed-btn brz-ed-btn-xs brz-ed-btn-gray brz-ed-btn-red--hover brz-ed-btn-rounded brz-fw-700"
              onClick={() => {
                this.props.onActive(name, "");
              }}
            >
              &nbsp;{t("DELETE")}&nbsp;
            </button>
          </Fragment>
        ) : (
          <label
            className="brz-label brz-ed-btn brz-ed-btn-xs brz-ed-btn-gray brz-ed-btn-teal--hover brz-ed-btn-rounded brz-fw-700"
            htmlFor={name}
          >
            <input
              id={name}
              className="brz-input brz-hidden"
              type="file"
              accept={accept}
              onChange={({ target: t }) => {
                this.props.onActive(name, t.files[0]);
              }}
            />
            {t("UPLOAD")}
          </label>
        )}
      </div>
    );
  }

  renderOptions() {
    const options = this.props.data.map((option, index) => {
      const { title, type, helper } = option;

      return (
        <div
          key={index}
          className="brz-ed-popup-integrations-step__fields-option"
        >
          <div className="brz-d-xs-flex brz-align-items-xs-center">
            <p className="brz-p">{title}</p>
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
          {type === "select" && this.renderSelect(option)}
          {type === "upload" && this.renderUpload(option)}
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
    const { error, prevLoading, nextLoading, onPrev, onNext } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__fields">
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">{t("ADD FONT VARIATION")}</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {this.renderOptions()}
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
                {t("Add Font")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewAdd;
