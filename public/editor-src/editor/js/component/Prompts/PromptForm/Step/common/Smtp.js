import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import { updateSmtpIntegration } from "../../api";
import { InputFields } from "../../../common/GlobalApps/StepsView";
import { pendingRequest } from "visual/utils/api/editor";

class Smtp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKeyValue: this.getDefaultValue(),
      prevLoading: false,
      nextLoading: false,
      error: null
    };
  }

  getDefaultValue() {
    const {
      app: { data },
      apiKeys
    } = this.props;

    return apiKeys.reduce(
      (acc, { name }) => ({ ...acc, [`${name}`]: data[name] || "" }),
      {}
    );
  }

  handleChange = (type, value) => {
    this.setState(({ apiKeyValue }) => ({
      apiKeyValue: {
        ...apiKeyValue,
        [`${type}`]: value
      }
    }));
  };

  handleNext = async () => {
    const {
      app: { id, data: appData },
      formId,
      apiKeys,
      onChange,
      onChangeNext
    } = this.props;
    const { apiKeyValue } = this.state;

    this.setState({
      nextLoading: true,
      error: null
    });

    if (apiKeys.find(({ required, name }) => required && !apiKeyValue[name])) {
      // Emitted fake request
      await pendingRequest();

      this.setState({
        error: t("All fields marked with an asterisk ( * ) must be completed."),
        nextLoading: false
      });
    } else {
      const { status, data } = await updateSmtpIntegration({
        ...appData,
        ...apiKeyValue,
        formId,
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

  handlePrev = async () => {
    this.setState({
      prevLoading: true
    });

    await pendingRequest();

    this.props.onChangePrev();
  };

  render() {
    const { app, apiKeys } = this.props;
    const { apiKeyValue, error, prevLoading, nextLoading } = this.state;
    const data = apiKeys.map(option => ({
      ...option,
      value: apiKeyValue[option.name]
    }));

    return (
      <InputFields
        {...app}
        data={data}
        error={error}
        prevLoading={prevLoading}
        nextLoading={nextLoading}
        onActive={this.handleChange}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    );
  }
}

export default Smtp;
