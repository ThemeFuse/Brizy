import React, { Fragment } from "react";
import classnames from "classnames";
import Config from "visual/global/Config";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import AppList from "../common/GlobalApps/StepsView/AppsList";
import Switch from "visual/component/Controls/Switch";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import * as AppsComponent from "./Apps";
import {
  getForm,
  createForm,
  updateForm,
  getIntegration,
  createIntegration
} from "./api";
import { copyTextToClipboard } from "../common/utils";

const IS_PRO = Config.get("pro");

class Email extends BaseIntegration {
  appsData = [];
  appsComponent = AppsComponent;
  proExceptions = !IS_PRO;

  async componentDidMount() {
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const { email } = await r.json();

    this.appsData = email;
    await this.getData();
  }

  async getData() {
    const {
      value: { formId },
      onLoading
    } = this.props;

    const { status, data } = await getForm(formId);

    if (status !== 200) {
      if (status === 404) {
        const { status, data } = await createForm({
          body: {
            id: formId
          }
        });

        if (status >= 400) {
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
    } else {
      this.setState({
        connectedApps: this.getConnectedApps(data.integrations),
        emailTemplate: data.emailTemplate || "",
        hasEmailTemplate: data.hasEmailTemplate,
        loading: false
      });
    }

    onLoading(false);
  }

  updateForm = _.debounce(() => {
    updateForm({
      formId: this.props.value.formId,
      body: {
        hasEmailTemplate: this.state.hasEmailTemplate,
        emailTemplate: this.state.emailTemplate
      }
    });
  }, 1000);

  handleConnectApp = async appData => {
    const connectedApp = appData.id;
    const { formId } = this.props.value;
    const { stages } = this.appsData.find(app => app.id === connectedApp);

    let { status, data: integrationData } = await getIntegration({
      appId: connectedApp,
      formId
    });

    if (status !== 200) {
      if (status === 404) {
        const { status, data } = await createIntegration({
          formId,
          body: {
            id: connectedApp
          }
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

    const data = Object.assign({}, this.state.data, {
      [`${connectedApp}`]: {
        ...appData,
        data: integrationData
      }
    });

    this.setState({ stages, connectedApp, data }, () => {
      this.handleNext();
    });
  };

  handleHtmlChange = e => {
    this.setState({ emailTemplate: e.target.value }, this.updateForm);
  };

  handleEnableHtml = value => {
    this.setState({ hasEmailTemplate: value });

    if (value === false && this.state.emailTemplate) {
      this.setState({ emailTemplate: "" }, this.updateForm);
    }
  };

  handleCopyToClipboard(label) {
    copyTextToClipboard(`{{${label}}}`);

    this.setState({ textCopied: label }, () => {
      setTimeout(() => {
        this.setState({ textCopied: null });
      }, 800);
    });
  }

  renderFormInfo() {
    return (
      <div className="brz-ed-popup-integration-email__info">
        {this.props.value.formFields.map((field, index) => (
          <p
            key={index}
            title="Click to copy"
            className="brz-p"
            onClick={() => {
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

  renderApps() {
    const { error, emailTemplate, hasEmailTemplate } = this.state;
    const className = classnames("brz-ed-popup-integration-email__template", {
      "brz-ed-popup-integration-email__template--open": hasEmailTemplate
    });

    return (
      <Fragment>
        {error && super.renderError()}
        <AppList apps={this.appsData} proExceptions={this.proExceptions} />
        {/*<div className={className}>*/}
        {/*  <div className="brz-ed-popup-integration-email__template-head">*/}
        {/*    <p className="brz-p">*/}
        {/*      <strong className="brz-strong">{t("USE CUSTOM TEMPLATE")}</strong>*/}
        {/*    </p>*/}
        {/*    <Switch*/}
        {/*      className="brz-ed-control__switch--light"*/}
        {/*      defaultValue={hasEmailTemplate}*/}
        {/*      onChange={this.handleEnableHtml}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*<div className="brzs-ed-popup-integration-email__template-body">*/}
        {/*  <textarea*/}
        {/*    className="brz-textarea"*/}
        {/*    value={emailTemplate}*/}
        {/*    onChange={this.handleHtmlChange}*/}
        {/*  />*/}
        {/*  <div className="brz-d-xs-flex brz-align-items-xs-center">*/}
        {/*    <p className="brz-p">*/}
        {/*      {t("Tip: Use these shortcodes to populate your template")}*/}
        {/*    </p>*/}
        {/*    <Tooltip*/}
        {/*      className="brz-ed-popup-integration-email__tooltip"*/}
        {/*      size="small"*/}
        {/*      openOnClick={false}*/}
        {/*      closeDelay={600}*/}
        {/*      overlay={this.renderFormInfo()}*/}
        {/*    >*/}
        {/*      <EditorIcon icon="nc-alert-circle-que" />*/}
        {/*    </Tooltip>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*</div>*/}
      </Fragment>
    );
  }
}

export default Email;
