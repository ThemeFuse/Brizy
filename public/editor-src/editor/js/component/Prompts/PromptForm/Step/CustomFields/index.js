import React, { Component } from "react";
import _ from "underscore";
import { replaceAt } from "timm";
import { Context } from "../../Context";
import {
  getFields,
  checkRequiredFields,
  updateIntegration,
  fakeLoading
} from "../../utils";

import ViewFields from "./ViewFields";

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
      app: { data },
      onChange
    } = context;

    onChange(data.id, { ...data, fields: [] });
  }

  handleChangeAction = action => {
    this.setState({
      action
    });
  };

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

    if (!checkRequiredFields(data.fields, formFields, "input")) {
      // Emitted fake request
      await fakeLoading();

      this.setState({
        error: "All fields cannot be empty",
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

      onChange(data.id, { data: { ...data, ...integrationData } });
      onChangeNext();
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

export default CustomFields;
