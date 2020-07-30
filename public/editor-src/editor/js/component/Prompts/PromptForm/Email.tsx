import React, { ReactElement } from "react";
import classnames from "classnames";
import _ from "underscore";
import produce from "immer";
import Config from "visual/global/Config";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import AppList from "../common/GlobalApps/StepsView/AppsList";
import Tooltip from "visual/component/Controls/Tooltip";
import Switch from "visual/component/Controls/Switch";
import EditorIcon from "visual/component/EditorIcon";
import { CodeMirror } from "visual/component/Controls/CodeMirror";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import * as AppsComponent from "./Apps";
import {
  getForm,
  createForm,
  updateForm,
  getSmtpIntegration,
  createSmtpIntegration
} from "./api";
import { copyTextToClipboard } from "../common/utils";
import {
  AppData,
  BaseIntegrationContext,
  BaseIntegrationProps,
  BaseIntegrationState,
  FormField
} from "../common/GlobalApps/type";

const IS_PRO = Config.get("pro");
const IS_WP = Config.get("wp");

type Props = BaseIntegrationProps & {
  formId: string;
  formFields: FormField[];
};

type State = BaseIntegrationState & {
  emailTemplate: string;
  hasEmailTemplate: boolean;
  textCopied?: string;
};

type Context = BaseIntegrationContext & {
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
    textCopied: ""
  };

  appsData: AppData[] = [];
  appsComponent = AppsComponent;
  proExceptions = !IS_PRO;

  async componentDidMount(): Promise<void> {
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const data = await r.json();

    if (IS_WP) {
      this.appsData = data.wpEmail;
    } else {
      this.appsData = data.cloudEmail;
    }

    await this.getData();
  }

  async getData(): Promise<void> {
    const { formId, onLoading } = this.props;
    const { status, data } = await getForm({ formId });

    if (status !== 200) {
      if (status === 404) {
        const { status, data } = await createForm({ formId });

        if (status >= 400 || !data) {
          this.setState({
            error: t("Something went wrong")
          });
        } else {
          this.setState({
            connectedApps: this.getConnectedApps(data.integrations),
            loading: false
          });
        }
      } else {
        this.setState({
          error: t("Something went wrong")
        });
      }
    } else if (data) {
      this.setState({
        connectedApps: this.getConnectedApps(data.integrations),
        emailTemplate: data.emailTemplate || "",
        hasEmailTemplate: data.hasEmailTemplate,
        loading: false
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

  updateForm = _.debounce(() => {
    updateForm({
      formId: this.props.formId,
      hasEmailTemplate: this.state.hasEmailTemplate,
      emailTemplate: this.state.emailTemplate
    });
  }, 1000);

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const connectedApp = appData.id;
    const { formId } = this.props;
    const { stages = [] } =
      this.appsData.find(app => app.id === connectedApp) || {};

    // eslint-disable-next-line prefer-const
    let { status, data: integrationData } = await getSmtpIntegration({
      formId,
      id: connectedApp
    });

    if (status !== 200) {
      if (status === 404) {
        const { status, data } = await createSmtpIntegration({
          formId,
          id: connectedApp
        });

        if (status !== 200) {
          this.setState({
            error: t("Something went wrong")
          });

          return;
        } else {
          integrationData = data;
        }
      } else {
        this.setState({
          error: t("Something went wrong")
        });

        return;
      }
    }

    this.setState(
      produce(draft => {
        draft.stages = stages;
        draft.connectedApp = connectedApp;
        draft.data[connectedApp] = Object.assign(appData, {
          data: integrationData
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

  handleCopyToClipboard(label: string): void {
    copyTextToClipboard(`{{${label}}}`);

    this.setState({ textCopied: label }, () => {
      setTimeout(() => {
        this.setState({ textCopied: undefined });
      }, 800);
    });
  }

  renderFormInfo(): ReactElement {
    return (
      <div className="brz-ed-popup-integration-email__info">
        {this.props.formFields.map((field, index) => (
          <p
            key={index}
            title="Click to copy"
            className="brz-p"
            onClick={(): void => {
              this.handleCopyToClipboard(field.label);
            }}
          >
            <span className="brz-span brz-">{`{{${field.label}}}`}</span>
            <EditorIcon icon="nc-duplicate" />
            {this.state.textCopied === field.label && (
              <span className="brz-span brz-ed-animated brz-ed-animated--fadeIn">
                Copied
              </span>
            )}
          </p>
        ))}
      </div>
    );
  }

  renderApps(): ReactElement {
    const { error, emailTemplate, hasEmailTemplate } = this.state;
    const className = classnames("brz-ed-popup-integration-email__template", {
      "brz-ed-popup-integration-email__template--open": hasEmailTemplate
    });

    return (
      <>
        {error && super.renderError()}
        <AppList apps={this.appsData} proExceptions={this.proExceptions} />
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
                defaultValue={hasEmailTemplate}
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
