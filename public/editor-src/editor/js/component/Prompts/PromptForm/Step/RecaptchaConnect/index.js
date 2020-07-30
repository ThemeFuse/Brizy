import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import ViewFields from "./ViewFields";
import { Context } from "../../../common/GlobalApps/Context";
import { deleteAccount } from "../../../common/GlobalApps/api";
import { pendingRequest } from "visual/utils/api/editor";
import { validation } from "./validation";

const apiKeys = [
  { name: "sitekey", title: "Site Key" },
  { name: "secretkey", title: "Secret Key" }
];

class RecaptchaConnect extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);
    const {
      app: { data }
    } = context;

    this.state = {
      apiKeyValue: data ? data : this.getDefaultValue(),
      validated: true,
      confirmed: false,
      prevLoading: false,
      nextLoading: false,
      error: null
    };
  }

  static async onBeforeLoad(context, props) {
    if (context.app.data) {
      props.onChangeNext("disconnect");
    }
  }

  getDefaultValue() {
    return apiKeys.reduce((acc, { name }) => ({ ...acc, [`${name}`]: "" }), {});
  }

  handleChange = (value, type) => {
    this.setState(({ apiKeyValue }) => ({
      apiKeyValue: {
        ...apiKeyValue,
        [`${type}`]: value.trim()
      }
    }));
  };

  handleConfirmation = confirmed => {
    this.setState({
      confirmed
    });
  };

  handleNext = async () => {
    const { app, onChangeNext } = this.context;
    const { apiKeyValue } = this.state;
    const keysValue = Object.values(apiKeyValue);

    this.setState({
      nextLoading: true,
      error: null
    });

    if (keysValue.some(key => !key)) {
      // Emitted fake request
      await pendingRequest();

      this.setState({
        error: "Fields are empty",
        nextLoading: false
      });
    } else {
      const { data } = app;

      if (data) {
        const { status } = await deleteAccount(data.id);

        if (status !== 200) {
          this.setState({
            nextLoading: false,
            error: t("Something went wrong")
          });
        }
      }

      const validated = await validation(apiKeyValue);

      if (validated) {
        onChangeNext();
      } else {
        this.setState({
          nextLoading: false,
          validated: false
        });
      }
    }
  };

  handlePrev = async () => {
    this.setState({
      prevLoading: true
    });

    await pendingRequest();
    this.context.onChangePrev();
  };

  render() {
    const {
      apiKeyValue,
      nextLoading,
      prevLoading,
      confirmed,
      error,
      validated
    } = this.state;
    const data = apiKeys.map(({ title, name }) => ({
      title,
      name,
      value: apiKeyValue[name]
    }));

    return (
      <ViewFields
        {...this.context.app}
        data={data}
        validated={validated}
        confirmed={confirmed}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        error={error}
        onChange={this.handleChange}
        onChangeConfirmation={this.handleConfirmation}
        onNext={this.handleNext}
        onRetry={this.handleNext}
        onPrev={this.handlePrev}
      />
    );
  }
}

export default RecaptchaConnect;
