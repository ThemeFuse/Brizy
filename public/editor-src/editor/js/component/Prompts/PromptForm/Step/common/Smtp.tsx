import { isT } from "fp-utilities";
import React, { Component, ReactElement } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { pendingRequest, updateSmtpIntegration } from "visual/utils/api";
import { pipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import * as Str from "visual/utils/string/specs";
import { Fields } from "../../../common/GlobalApps/StepsView/Fields";
import { AppData, FormField } from "../../../common/GlobalApps/type";
import { readApiKey } from "./utils";

export type ApiKeys = Record<string, unknown>;

interface Props {
  formId: string;
  formFields: FormField[];
  app: AppData;
  apiKeys: ApiKeys[];
  config: ConfigCommon;
  onChange: (id: string, appData: AppData["data"]) => void;
  onChangePrev: (prevStage?: string) => void;
  onChangeNext: (nextState?: string) => void;
  onClose?: VoidFunction;
}

interface State {
  prevLoading: boolean;
  nextLoading: boolean;
  error: null | string;
  apiKeyValue: Record<string, unknown>;
}

class Smtp extends Component<Props, State> {
  state: State = {
    apiKeyValue: this.getDefaultValue(),
    prevLoading: false,
    nextLoading: false,
    error: null
  };

  getDefaultValue(): Record<string, unknown> {
    const {
      app: { data = {} },
      apiKeys
    } = this.props;

    return apiKeys.reduce(
      (acc, { name }) => ({
        ...acc,
        // @ts-expect-error: No index signature with a parameter of type data[property]
        [`${name}`]: data[Str.read(name) ?? ""] || ""
      }),
      {}
    );
  }

  getValue(v: unknown): unknown {
    const { apiKeyValue } = this.state;
    return pipe((obj: ApiKeys) => obj[v as string])(apiKeyValue);
  }

  handleChange = (type: string, value: unknown): void => {
    this.setState(({ apiKeyValue }) => ({
      apiKeyValue: {
        ...apiKeyValue,
        [`${type}`]: value
      }
    }));
  };

  handleNext = async (): Promise<void> => {
    const { config } = this.props;

    const {
      app: { id, data: appData },
      formId,
      apiKeys,
      onChange,
      onChangeNext
    } = this.props;
    const { apiKeyValue } = this.state;

    if (!appData) {
      this.setState({
        error: t("Missing app data")
      });
      return;
    }

    this.setState({
      nextLoading: true,
      error: null
    });

    if (
      apiKeys.find(
        ({ required, name }) => required && !apiKeyValue[Str.read(name) ?? ""]
      )
    ) {
      // Emitted fake request
      await pendingRequest();

      this.setState({
        error: t("All fields marked with an asterisk ( * ) must be completed."),
        nextLoading: false
      });
    } else {
      const data = await updateSmtpIntegration(
        {
          ...appData,
          ...apiKeyValue,
          formId,
          completed: true
        },
        config,
        id
      );

      if (!data) {
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

  handlePrev = async (): Promise<void> => {
    this.setState({
      prevLoading: true
    });

    await pendingRequest();

    this.props.onChangePrev();
  };

  render(): ReactElement {
    const { app, apiKeys, formId, formFields } = this.props;
    const { error, prevLoading, nextLoading } = this.state;
    const data = apiKeys
      .map((option) =>
        readApiKey({ ...option, value: this.getValue(option.name) })
      )
      .filter(isT);

    return (
      <Fields
        {...app}
        formId={formId}
        formFields={formFields}
        data={data}
        error={error ?? undefined}
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
