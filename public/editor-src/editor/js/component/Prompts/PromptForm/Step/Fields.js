import React, { Component } from "react";
import { replaceAt } from "timm";
import { t } from "visual/utils/i18n";
import { updateIntegration, getIntegrationFields } from "../api";
import { Context } from "../../common/GlobalApps/Context";
import { SelectFields } from "../../common/GlobalApps/StepsView";
import {
  getFields,
  checkRequiredFields,
  fakeRequest
} from "../../common/utils";

class Fields extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);
    const {
      app: {
        data: { fieldsMap, fields },
        restrictions
      },
      formFields
    } = context;

    this.state = {
      formFields: getFields(fieldsMap, fields, formFields, restrictions),
      prevLoading: false,
      nextLoading: false,
      error: null
    };
  }

  static async onBeforeLoad(context) {
    const {
      app: { data: appData },
      formId,
      onChange,
      onError
    } = context;
    let { data, status } = await getIntegrationFields({
      appId: appData.id,
      formId
    });

    if (status !== 200) {
      onError(t("Something went wrong"));
    } else {
      onChange(appData.id, { ...appData, fields: data });
    }
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
    await fakeRequest();

    this.context.onChangePrev();
  };

  handleNext = async () => {
    const {
      app: { data: appData },
      formId,
      onChange,
      onChangeNext
    } = this.context;
    const { formFields } = this.state;

    this.setState({
      nextLoading: true,
      error: null
    });

    if (!checkRequiredFields(appData.fields, formFields, "select")) {
      // Emitted fake request
      await fakeRequest();

      this.setState({
        error: t("All fields marked with an asterisk ( * ) must be mapped."),
        nextLoading: false
      });
    } else {
      const { status, data } = await updateIntegration({
        formId,
        body: {
          ...appData,
          fieldsMap: formFields,
          completed: true
        }
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: t("Something went wrong")
        });
      } else {
        onChange(appData.id, { ...appData, ...data });
        onChangeNext();
      }
    }
  };

  render() {
    const { app } = this.context;
    const { formFields, error, nextLoading, prevLoading } = this.state;

    return (
      <SelectFields
        {...app}
        {...app.data}
        formFields={formFields}
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

export default Fields;
