import React, { Component } from "react";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import { Connect } from "../../common/GlobalApps/StepsView";
import {
  createIntegrationAccount,
  getIntegration,
  getIntegrationAccountApiKey
} from "../api";
import { authWindow } from "./common/utils";

const getMessage = (data, keys) => {
  const keysTitle = keys.map((el) => el.title).join(" & ");

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
      (acc, { name, value, choices }) => {
        const defaultChoice = choices ? choices[0].id : "";
        return { ...acc, [`${name}`]: value ?? defaultChoice };
      },
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
      app: { id, data: appData },
      onChange,
      onChangeProgress,
      onError
    } = context;

    let { status, data } = await getIntegrationAccountApiKey(
      {
        id,
        formId
      },
      props.config
    );

    if (!status || status >= 400) {
      data = [];
      onError(t("Something went wrong"));
    }

    onChange(id, { ...appData, accountApiKeys: data });

    if (appData.usedAccount || (appData.accounts && appData.accounts.length)) {
      props.onChangeNext();
    } else {
      onChangeProgress({ showProgress: false });
    }
  }

  handleChange = (value, type) => {
    this.setState((state) => ({
      apiKeyValue: {
        ...state.apiKeyValue,
        [`${type}`]: value.trim()
      }
    }));
  };

  handleConnect = async () => {
    const { config } = this.props;

    const {
      app: { id, data: appData },
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

    if (!keysValue.some((key) => !key)) {
      let { status, data } = await createIntegrationAccount(
        {
          ...appData,
          formId,
          data: apiKeyValue
        },
        config
      );

      if (status === 302) {
        const { redirect: redirectUrl } = data;

        try {
          await authWindow(redirectUrl);
          const { data } = await getIntegration({ formId, id }, config);

          onChange(id, { ...appData, accounts: data.accounts });
          onChangeProgress({ showProgress: true });
          onChangeNext();
          return;
        } catch (e) {
          this.setState({
            nextLoading: false,
            error: t("Fail to authenticate")
          });
          return;
        }
      }

      if (status === 200) {
        const accounts = appData.accounts || [];

        onChange(id, { ...appData, accounts: [...accounts, data] });
        onChangeProgress({ showProgress: true });
        onChangeNext();
      } else {
        this.setState({
          nextLoading: false,
          error: getMessage(data, appData.accountApiKeys)
        });
      }
    } else {
      // Emitted fake request
      await pendingRequest();

      this.setState({
        error: t("Fields are empty"),
        nextLoading: false
      });
    }
  };

  handlePrev = async () => {
    const { oldStage, onChangeNext, onChangePrev, onChangeProgress } =
      this.context;

    this.setState({
      error: null,
      prevLoading: true
    });

    // Emitted fake request
    await pendingRequest();

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
    const data = app.data.accountApiKeys
      .filter((key) => !key.hidden)
      .map(({ title, name, type, description, choices }) => ({
        title,
        name,
        description,
        value: apiKeyValue[name],
        type,
        choices
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
