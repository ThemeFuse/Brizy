import React, { Component } from "react";
import { Context } from "../../Context";
import ViewConnect from "./ViewConnect";
import {
  getIntegrationAccountApiKey,
  createIntegrationAccount,
  fakeLoading
} from "../../utils";

const getMessage = (data, keys) => {
  const keysTitle = keys.map(el => el.title).join(" & ");

  switch (data.code) {
    case 401:
      return `Incorrect ${keysTitle}`;

    case 400:
      return "Duplicate Account";

    default:
      return "Something went wrong";
  }
};

class ApiConnect extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);
    const {
      data: { accountApiKeys }
    } = context.app;
    const generatedValues = accountApiKeys.reduce(
      (acc, { name }) => ({ ...acc, [`${name}`]: "" }),
      {}
    );

    this.state = {
      apiKeyValue: generatedValues,
      nextLoading: false,
      prevLoading: false,
      error: null
    };
  }

  static async onBeforeLoad(context, props) {
    const {
      formId,
      app: { data },
      onChange,
      onChangeProgress
    } = context;

    const accountApiKeys = await getIntegrationAccountApiKey({
      appId: data.id,
      formId
    });

    onChange(data.id, { data: { ...data, accountApiKeys } });

    if (data.usedAccount || (data.accounts && data.accounts.length)) {
      props.onChangeNext();
    } else {
      onChangeProgress({
        showProgress: false
      });
    }
  }

  handleChange = (value, type) => {
    this.setState(state => ({
      apiKeyValue: {
        ...state.apiKeyValue,
        [`${type}`]: value.trim()
      }
    }));
  };

  handleConnect = async () => {
    const {
      app,
      formId,
      onChange,
      onChangeProgress,
      onChangeNext
    } = this.context;
    const { apiKeyValue } = this.state;
    const keysValue = Object.values(apiKeyValue);

    this.setState({
      nextLoading: true,
      error: null
    });

    if (!keysValue.some(key => !key)) {
      const integrationData = await createIntegrationAccount({
        appId: app.id,
        formId,
        body: apiKeyValue
      });

      if (integrationData.code && integrationData.code !== 200) {
        this.setState({
          nextLoading: false,
          error: getMessage(integrationData, app.data.accountApiKeys)
        });
      } else {
        const { data } = app;
        const accounts = data.accounts || [];

        onChange(data.id, {
          data: { ...data, accounts: [...accounts, integrationData] }
        });
        onChangeProgress({
          showProgress: true
        });
        onChangeNext();
      }
    } else {
      // Emitted fake request
      await fakeLoading();

      this.setState({
        error: "Fields are empty",
        nextLoading: false
      });
    }
  };

  handlePrev = async () => {
    this.setState({
      error: null,
      prevLoading: true
    });

    // Emitted fake request
    await fakeLoading();

    if (this.context.oldStage === "account") {
      this.props.onChangeNext("account");
      this.context.onChangeProgress({
        showProgress: true
      });
    } else {
      this.props.onChangePrev();
    }
  };

  render() {
    const { app } = this.context;
    const { apiKeyValue, error, nextLoading, prevLoading } = this.state;

    return (
      <ViewConnect
        {...app}
        apiKeyValue={apiKeyValue}
        error={error}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        handlePrev={this.handlePrev}
        handleNext={this.handleConnect}
        onChange={this.handleChange}
      />
    );
  }
}

export default ApiConnect;
