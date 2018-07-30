import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import classnames from "classnames";
import { replaceAt } from "timm";
import AutoGenerateFields from "./AutoGenerateFields";
import EditorIcon from "visual/component-new/EditorIcon";
import CustomFields from "./CustomFields";
import { updateWpFormIntegrations } from "visual/utils/api/integrations";
import {
  getFields,
  getWpFields,
  checkRequiredFields,
  validateEmail
} from "../utils";

class LinkFields extends Component {
  static get title() {
    return "Fields";
  }
  static get id() {
    return "linkFields";
  }

  static contextTypes = {
    connectedApps: PropTypes.array
  };

  constructor(props) {
    super(props);

    const { app, list, form, editorFields, restrictions } = this.props;

    const appFields =
      app === "wordpress"
        ? getWpFields(form)
        : getFields(form.fields, list, editorFields, restrictions);

    this.state = {
      action: null,
      appFields,
      list
    };
  }

  componentWillReceiveProps(nextProps) {
    const { form, app } = this.props;
    if (nextProps.form !== form && app === "wordpress") {
      this.setState({ appFields: nextProps.form });
    }
  }

  onBack = () => {
    const {
      form,
      restrictions: { existLists },
      onChange
    } = this.props;
    let page = existLists ? "list" : "accounts";
    onChange(page, { type: "get", ...form }, { prevLoading: true });
  };

  onChange = (inputId, linked) => {
    const { app } = this.props;
    const { appFields } = this.state;
    let newAppFields;

    if (app === "wordpress") {
      newAppFields = Object.assign({}, appFields, {
        [`${inputId}`]: linked
      });
    } else {
      let index = _.indexOf(_.pluck(appFields, "id"), inputId);
      const newObj = Object.assign({}, appFields[index], { linked });
      newAppFields = replaceAt(appFields, index, newObj);
    }

    this.setState({
      appFields: newAppFields
    });
  };

  onButtonSave = () => {
    const { app, formId, wpApiUrl, onChange } = this.props;
    const { connectedApps: _connectedApps } = this.context;
    const { appFields, list } = this.state;
    let data = null;

    if (app === "wordpress") {
      data = { ...appFields, id: formId };
      const connectedApps = _connectedApps.filter(el => el !== "wordpress");

      if (Object.values(data).some(el => !el)) {
        this.onChangeAction({
          type: "error",
          message: "All fields cannot be empty"
        });

        return;
      }
      if (!validateEmail(data.emailTo)) {
        this.onChangeAction({
          type: "error",
          message: "EmailTo is not valid"
        });

        return;
      }
      if (connectedApps.length > 0) {
        updateWpFormIntegrations(formId, {
          wpApiUrl,
          body: 1
        });
      } else {
        updateWpFormIntegrations(formId, {
          wpApiUrl,
          body: 0
        });
      }
    } else {
      const {
        app,
        form: {
          list: formList,
          account: { id },
          form: { form_id }
        },
        restrictions
      } = this.props;
      if (!checkRequiredFields(list, appFields, "select")) {
        this.onChangeAction({
          type: "error",
          message: "All fields marked with an asterisk ( * ) must be mapped."
        });

        return;
      }
      if (!checkRequiredFields(list, appFields, "input")) {
        this.onChangeAction({
          type: "error",
          message: "All fields cannot be empty"
        });

        return;
      }

      data = {
        account: id
      };

      if (restrictions.existLists) {
        data.list = formList;
        data.fields = JSON.stringify(appFields);
      } else {
        data.fields = JSON.stringify(
          appFields.map(el => {
            const value = { ...el };

            if (el.linked === "_auto_generate") {
              value.linked = el.title;
            }

            return value;
          })
        );
      }

      updateWpFormIntegrations(formId, {
        wpApiUrl,
        body: 1
      });
    }

    onChange("done", data, { ...this.props, nextLoading: true });
  };

  onChangeAction = action => this.setState({ action });

  renderMessages() {
    const { type, message } = this.state.action;
    const className = classnames("brz-ed-alert", `brz-ed-alert-${type}`);

    return (
      <div className={className}>
        <span className="brz-span">{message}</span>
      </div>
    );
  }

  renderNextButton(hasList, loading) {
    return hasList && !loading ? (
      <button
        key="fieldsContinue"
        onClick={this.onButtonSave}
        className="brz-button brz-ed-btn brz-ed-btn-rounded brz-ed-btn-width-1 brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-teal"
      >
        <span className="brz-span">Continue</span>
        <EditorIcon icon="nc-arrow-right" />
      </button>
    ) : (
      <button
        key="fieldsNextLoading"
        className="brz-button brz-ed-btn brz-ed-btn-rounded brz-ed-btn-width-1 brz-ed-btn-sm brz-ed-btn-teal brz-ed-btn--loading"
      >
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </button>
    );
  }

  renderPrevButton(hasList, loading) {
    return hasList && !loading ? (
      <button
        key="fieldsBack"
        onClick={this.onBack}
        className="brz-button brz-ed-btn brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-gray brz-ed-btn-icon--left brz-ed-btn-width-3"
      >
        <EditorIcon icon="nc-arrow-right" className="brz-ed-rotate--180" />
        <span className="brz-span">Back</span>
      </button>
    ) : (
      <button
        key="fieldsLoadings"
        className="brz-button brz-ed-btn brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-gray brz-ed-btn-width-3 brz-ed-btn--loading"
      >
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </button>
    );
  }

  renderButtons = (prevLoading, nextLoading, list) => {
    const { existFields } = this.props.restrictions;
    const hasList = existFields ? list.length > 0 : true;

    return (
      <div className="brz-ed-form-row brz-ed-popup-app-form-buttons brz-d-xs-flex brz-justify-content-xs-between">
        {this.renderPrevButton(hasList, prevLoading)}
        {this.renderNextButton(hasList, nextLoading)}
      </div>
    );
  };

  render() {
    const {
      className: _className,
      restrictions: { existFields }
    } = this.props;
    const { list, appFields, action } = this.state;
    const className = classnames("brz-ed-popup-app-form", _className);

    return (
      <div className={className}>
        {action && this.renderMessages()}
        {existFields ? (
          <AutoGenerateFields
            {...this.props}
            appFields={appFields}
            scrollHeight={action ? 205 : 255}
            list={list}
            onChange={this.onChange}
          />
        ) : (
          <CustomFields
            {...this.props}
            appFields={appFields}
            scrollHeight={action ? 205 : 255}
            list={list}
            onChange={this.onChange}
          />
        )}
      </div>
    );
  }
}

export default LinkFields;
