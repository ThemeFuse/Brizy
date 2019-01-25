import React, { Component } from "react";
import { replaceAt } from "timm";
import { Context } from "../../Context";
import {
  getFields,
  checkRequiredFields,
  updateIntegration,
  getIntegrationFields,
  fakeLoading
} from "../../utils";
import ViewFields from "./ViewFields";

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
      app: { data },
      formId,
      onChange
    } = context;
    const fields = await getIntegrationFields({
      appId: data.id,
      formId
    });

    onChange(data.id, { data: { ...data, fields } });
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
      error: null,
      prevLoading: true
    });

    // Emitted fake request
    await fakeLoading();

    this.context.onChangePrev();
  };

  handleNext = async () => {
    const {
      app: { data },
      formId,
      onChange,
      onChangeNext
    } = this.context;
    const { formFields } = this.state;

    this.setState({
      error: null,
      nextLoading: true
    });

    if (!checkRequiredFields(data.fields, formFields, "select")) {
      // Emitted fake request
      await fakeLoading();

      this.setState({
        error: "All fields marked with an asterisk ( * ) must be mapped.",
        nextLoading: false
      });
    } else {
      const integrationData = await updateIntegration({
        formId,
        body: {
          ...data,
          fieldsMap: formFields,
          completed: true
        }
      });

      if (integrationData.code && integrationData.code !== 200) {
        this.setState({
          nextLoading: false,
          error: "Something went wrong"
        });
      } else {
        onChange(data.id, { data: { ...data, ...integrationData } });
        onChangeNext();
      }
    }
  };

  render() {
    const { app } = this.context;
    const { formFields, error, nextLoading, prevLoading } = this.state;

    return (
      <ViewFields
        {...app}
        {...app.data}
        formFields={formFields}
        error={error}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        handleActive={this.handleActive}
        handlePrev={this.handlePrev}
        handleNext={this.handleNext}
      />
    );
  }
}

export default Fields;
