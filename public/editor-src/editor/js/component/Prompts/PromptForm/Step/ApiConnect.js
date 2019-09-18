import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import { getIntegrationAccountApiKey, createIntegrationAccount } from "../api";
import { Context } from "../../common/GlobalApps/Context";
import { Connect } from "../../common/GlobalApps/StepsView";
import { fakeRequest } from "../../common/utils";

const getMessage = (data, keys) => {
  const keysTitle = keys.map(el => el.title).join(" & ");

  switch (data.code) {
    case 401:
      return `${t("Incorrect")} ${keysTitle}`;

    case 400:
      return t("Duplicate Account");

    default:
      return t("Something went wrong");
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
      app: { data: appData },
      onChange,
      onChangeProgress
    } = context;

    const { data } = await getIntegrationAccountApiKey({
      appId: appData.id,
      formId
    });

    onChange(appData.id, { ...appData, accountApiKeys: data });

    if (appData.usedAccount || (appData.accounts && appData.accounts.length)) {
      props.onChangeNext();
    } else {
      onChangeProgress({ showProgress: false });
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
      const { status, data } = await createIntegrationAccount({
        appId: app.id,
        formId,
        body: apiKeyValue
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: getMessage(data, app.data.accountApiKeys)
        });
      } else {
        const appData = app.data;
        const accounts = appData.accounts || [];

        onChange(appData.id, { ...appData, accounts: [...accounts, data] });
        onChangeProgress({ showProgress: true });
        onChangeNext();
      }
    } else {
      // Emitted fake request
      await fakeRequest();

      this.setState({
        error: t("Fields are empty"),
        nextLoading: false
      });
    }
  };

  handlePrev = async () => {
    const {
      oldStage,
      onChangeNext,
      onChangePrev,
      onChangeProgress
    } = this.context;

    this.setState({
      error: null,
      prevLoading: true
    });

    // Emitted fake request
    await fakeRequest();

    onChangeProgress({ showProgress: true });

    if (oldStage === "account") {
      onChangeNext("account");
    } else {
      onChangePrev();
    }
  };

  render() {
    const { app } = this.context;
    const { apiKeyValue, error, nextLoading, prevLoading } = this.state;
    const data = app.data.accountApiKeys.map(({ title, name }) => ({
      title,
      name,
      value: apiKeyValue[name]
    }));

    return (
      <Connect
        {...app}
        data={data}
        error={error}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        onPrev={this.handlePrev}
        onNext={this.handleConnect}
        onChange={this.handleChange}
      />
    );
  }
}

export default ApiConnect;
