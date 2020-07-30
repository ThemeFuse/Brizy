import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import Button from "../../Button";
import { isMaxFields } from "../../utils";
import { t } from "visual/utils/i18n";

class SelectFields extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    fields: [],
    formFields: [],
    restrictions: {},
    error: null,
    nextLoading: null,
    prevLoading: null,
    onActive: _.noop,
    onPrev: _.noop,
    onNext: _.noop
  };

  renderSelect(id, target) {
    const { formFields, fields, restrictions, onActive } = this.props;
    const busyFields = _.pluck(formFields, "target");
    let newFields = fields.filter(item => {
      return busyFields.indexOf(item.slug) === -1 || item.slug === target;
    });

    const allBusyFields =
      fields.length +
      (formFields.length - _.without(busyFields, "_auto_generate").length);

    if (
      !(
        isMaxFields(allBusyFields, restrictions) &&
        (!target || target !== "_auto_generate")
      )
    ) {
      newFields.unshift({
        name: "Auto Generate",
        required: false,
        slug: "_auto_generate"
      });
    }

    const options = newFields.map(({ required, name, slug }) => {
      return (
        <SelectItem key={slug} value={slug}>
          <span className="brz-span">{name}</span>
          {required && <strong className="brz-strong brz--required">*</strong>}
        </SelectItem>
      );
    });

    return (
      <Select
        defaultValue={target}
        className="brz-control__select--white"
        maxItems="6"
        itemHeight="30"
        inPortal={true}
        onChange={itemTarget => {
          onActive(id, itemTarget);
        }}
      >
        {options}
      </Select>
    );
  }

  renderOptions() {
    const options = this.props.formFields.map(
      ({ sourceTitle, target, sourceId }) => {
        return (
          <div
            key={sourceId}
            className="brz-ed-popup-integrations-step__fields-option"
          >
            <p className="brz-p">{sourceTitle}</p>
            <div className="brz-ed-popup-integrations-step__fields-select">
              {this.renderSelect(sourceId, target)}
            </div>
          </div>
        );
      }
    );

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

  renderErrorEmpty() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">
          {t("Fields are empty. Please add fields and try again.")}
        </span>
      </div>
    );
  }

  render() {
    const {
      title,
      error,
      formFields,
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
            <strong className="brz-strong">{t("FORM FIELDS")}</strong>
          </p>
          <p className="brz-p">
            <strong className="brz-strong">
              {title} {t("FIELDS")}
            </strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {formFields.length ? this.renderOptions() : this.renderErrorEmpty()}
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

export default SelectFields;
