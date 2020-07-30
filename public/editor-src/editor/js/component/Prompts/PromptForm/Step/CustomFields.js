import React, { Component } from "react";
import { replaceAt } from "timm";
import { t } from "visual/utils/i18n";
import { updateIntegration } from "../api";
import { Context } from "../../common/GlobalApps/Context";
import { InputFields } from "../../common/GlobalApps/StepsView";
import { getFields, checkRequiredFields } from "../../common/utils";
import { pendingRequest } from "visual/utils/api/editor";

class CustomFields extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);

    const {
      app: { data, restrictions },
      formFields
    } = context;
    const { fieldsMap, fields } = data || {};

    this.state = {
      formFields: getFields(fieldsMap, fields, formFields, restrictions),
      prevLoading: false,
      nextLoading: false
    };
  }

  static async onBeforeLoad(context) {
    const {
      app: { id, data },
      onChange
    } = context;

    onChange(id, { ...data, fields: [] });
  }

  handleActive = (id, target) => {
    const { formFields } = this.state;
    const index = formFields.findIndex(({ sourceId }) => sourceId === id);

    this.setState({
      formFields: replaceAt(formFields, index, { ...formFields[index], target })
    });
  };

  handlePrev = async () => {
    this.setState({
      prevLoading: true,
      error: null
    });

    // Emitted fake request
    await pendingRequest();

    this.context.onChangePrev();
  };

  handleNext = async () => {
    const {
      app: { id, data: appData },
      formId,
      onChange,
      onChangeNext
    } = this.context;
    const { formFields } = this.state;

    this.setState({
      error: null,
      nextLoading: true
    });

    if (!checkRequiredFields(appData.fields, formFields, "input")) {
      // Emitted fake request
      await pendingRequest();

      this.setState({
        error: t("All fields cannot be empty"),
        nextLoading: false
      });
    } else {
      const { status, data } = await updateIntegration({
        ...appData,
        formId,
        fieldsMap: JSON.stringify(formFields),
        completed: true
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: t("Something went wrong")
        });
      } else {
        onChange(id, { ...appData, ...data });
        onChangeNext();
      }
    }
  };

  render() {
    const {
      app: { title }
    } = this.context;
    const { formFields, error, nextLoading, prevLoading } = this.state;
    const data = formFields.map(({ sourceTitle, sourceId, target }) => ({
      title: sourceTitle,
      name: sourceId,
      value: target === "_auto_generate" ? sourceTitle : target
    }));

    return (
      <InputFields
        headTitle={t("FORM FIELDS")}
        headDescription={`${title} ${t("FIELDS")}`}
        data={data}
        error={error}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        onActive={this.handleActive}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    );
  }
}

export default CustomFields;
