import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import { updateIntegration } from "../../api";
import { fakeRequest } from "../../../common/utils";
import { InputFields } from "../../../common/GlobalApps/StepsView";

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
    const { app, formId, onChange, onChangeNext } = this.props;
    const { apiKeyValue } = this.state;
    const keysValue = Object.values(apiKeyValue);

    this.setState({
      nextLoading: true,
      error: null
    });

    if (keysValue.filter(key => typeof key === "boolean").some(key => !key)) {
      // Emitted fake request
      await fakeRequest();

      this.setState({
        error: t("Fields are empty"),
        nextLoading: false
      });
    } else {
      const { status, data } = await updateIntegration({
        formId,
        body: {
          ...app.data,
          ...apiKeyValue,
          completed: true
        }
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: t("Something went wrong")
        });
      } else {
        onChange(app.id, { ...app.data, ...data });
        onChangeNext();
      }
    }
  };

  handlePrev = async () => {
    this.setState({
      prevLoading: true
    });

    await fakeRequest();

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
