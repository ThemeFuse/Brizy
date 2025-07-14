import classnames from "classnames";
import { debounce } from "es-toolkit";
import { produce } from "immer";
import React, { ReactElement } from "react";
import { CodeMirror } from "visual/component/Controls/CodeMirror";
import { Switch } from "visual/component/Controls/Switch";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { EmailDisconnect } from "visual/component/Prompts/PromptForm/Step";
import { isWp } from "visual/global/Config";
import { IntegrationType } from "visual/global/Config/types/Form";
import { getForm, getSmtpIntegration, updateForm } from "visual/utils/api";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import AppList from "../common/GlobalApps/StepsView/AppsList";
import {
  AppData,
  BaseIntegrationContext,
  BaseIntegrationProps,
  BaseIntegrationState,
  FormField
} from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";
import { HelperCopy } from "./Step/common/HelperToolip";

type Props = BaseIntegrationProps & {
  formId: string;
  formFields: FormField[];
};

type State = BaseIntegrationState & {
  emailTemplate: string;
  hasEmailTemplate: boolean;
  deletedApp: { id: number; type: string } | null;
  notifications: IntegrationType[];
};

export type Context = BaseIntegrationContext & {
  formId: string;
  formFields: FormField[];
};

class Email extends BaseIntegration<Props, State, Context> {
  state: State = {
    loading: true,
    showProgress: true,
    connectedApp: "",
    connectedApps: [],
    stage: this.props.stage,
    stages: this.props.stages,
    oldStage: "",
    data: {},
    error: null,
    appError: null,
    emailTemplate: "",
    hasEmailTemplate: false,
    deletedApp: null,
    notifications: []
  };

  appsData: AppData[] = [];
  appsComponent = AppsComponent;
  proExceptions = !isPro(this.props.config);
  isWp = isWp(this.props.config);

  updateForm = debounce(() => {
    updateForm(
      {
        formId: this.props.formId,
        hasEmailTemplate: this.state.hasEmailTemplate,
        emailTemplate: this.state.emailTemplate
      },
      this.props.config
    );
  }, 1000);

  async componentDidMount(): Promise<void> {
    const { Integrations } = await import("visual/config/integrations");
    if (this.isWp) {
      this.appsData = Integrations.wpEmail;
    } else {
      this.appsData = Integrations.cloudEmail;
    }

    await this.getData();
  }

  async getData(): Promise<void> {
    const { formId, config, onLoading } = this.props;
    const data = await getForm({ formId }, config);

    if (data) {
      this.setState({
        connectedApps: this.getConnectedApps(data.integrations),
        emailTemplate: data.emailTemplate || "",
        hasEmailTemplate: data.hasEmailTemplate,
        notifications: data.notifications || [],
        loading: false
      });
    } else {
      this.setState({
        error: t("Something went wrong")
      });
    }

    onLoading(false);
  }

  getContextValue(): Context {
    const { formId, formFields } = this.props;
    const parentContext = super.getContextValue();

    return {
      ...parentContext,
      formId,
      formFields
    };
  }

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const { config } = this.props;

    const connectedApp = appData.id;
    const { formId } = this.props;
    const { stages = [] } =
      this.appsData.find((app) => app.id === connectedApp) || {};

    const data = await getSmtpIntegration(
      {
        formId,
        id: connectedApp
      },
      config
    );

    if (!data) {
      return this.setState({
        error: t("Something went wrong")
      });
    }

    this.setState(
      produce((draft) => {
        draft.stages = stages;
        draft.connectedApp = connectedApp;
        draft.data[connectedApp] = Object.assign(appData, {
          data
        });
      }),
      () => {
        this.handleNext();
      }
    );
  };

  handleHtmlChange = (v: string): void => {
    this.setState({ emailTemplate: v }, this.updateForm);
  };

  handleEnableHtml = (value: boolean): void => {
    this.setState({ hasEmailTemplate: value });

    if (value === false && this.state.emailTemplate) {
      this.setState({ emailTemplate: "" }, this.updateForm);
    }
  };

  handleDelete = (deletedApp: State["deletedApp"]) => {
    this.setState({ deletedApp });
  };

  handleRemoveDeletedApp = () => {
    this.setState({ deletedApp: null });
  };

  renderFormInfo(): ReactElement {
    return (
      <div className="brz-ed-popup-integration-email__info">
        <HelperCopy fields={this.props.formFields} />
      </div>
    );
  }

  renderApps(): ReactElement {
    const {
      error,
      emailTemplate,
      hasEmailTemplate,
      deletedApp,
      notifications
    } = this.state;
    const { formId, config } = this.props;
    const className = classnames("brz-ed-popup-integration-email__template", {
      "brz-ed-popup-integration-email__template--open": hasEmailTemplate
    });

    return deletedApp ? (
      <EmailDisconnect
        handleRemoveDeletedApp={this.handleRemoveDeletedApp}
        app={this.appsData.find((app) => app.id === deletedApp.type)}
        notification={notifications[deletedApp.id]}
        formId={formId}
      />
    ) : (
      <>
        {error && super.renderError()}
        <AppList
          apps={this.appsData}
          proExceptions={this.proExceptions}
          hasDelete
          config={config}
          handleDelete={this.handleDelete}
        />
        {!this.proExceptions && (
          <div className={className}>
            <div className="brz-ed-popup-integration-email__template-head">
              <p className="brz-p">
                <strong className="brz-strong">
                  {t("USE CUSTOM TEMPLATE")}
                </strong>
              </p>
              <Switch
                className="brz-ed-control__switch--light"
                value={hasEmailTemplate}
                onChange={this.handleEnableHtml}
              />
            </div>
            <div className="brz-ed-popup-integration-email__template-body">
              <CodeMirror
                className="brz-ed-popup-integration-email__codemirror"
                value={emailTemplate}
                onChange={this.handleHtmlChange}
                language="xml"
                theme="idea"
              />
              <div className="brz-d-xs-flex brz-align-items-xs-center">
                <p className="brz-p">
                  {t("Tip: Use these shortcodes to populate your template")}
                </p>
                <Tooltip
                  className="brz-ed-popup-integration-email__tooltip"
                  size="small"
                  openOnClick={false}
                  closeDelay={600}
                  overlay={this.renderFormInfo()}
                >
                  <EditorIcon icon="nc-alert-circle-que" />
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Email;
