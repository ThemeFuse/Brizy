import React from "react";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import classnames from "classnames";
import Config from "visual/global/Config";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";
import { styleForm } from "./styles";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendFields from "./toolbarExtendFields";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as sidebarExtendButton from "./sidebarExtendButton";

export default class Form2 extends EditorComponent {
  static get componentId() {
    return "Form2";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      { allowExtend: false }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  renderFields(v) {
    const { label, placeholder } = v;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: 1,
      itemProps: {
        meta: this.props.meta,
        labelType: label === "off" ? "inside" : "outside",
        placeholder: placeholder === "on",
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendFields,
          null,
          { allowExtend: false }
        )
      }
    });

    return <EditorArrayComponent {...itemsProps} />;
  }

  renderButton() {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 1,
      itemProps: {
        meta: this.props.meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendButton,
          sidebarExtendButton,
          { allowExtend: false }
        )
      }
    });

    return (
      <div className="brz-forms2__item brz-align-self-xs-end brz-forms2__item-button">
        <EditorArrayComponent {...itemsProps} />
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-forms2",
      css(
        `${this.constructor.componentId}-form`,
        `${this.getId()}-form`,
        styleForm(v, vs, vd)
      )
    );
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <form
            className="brz-form brz-d-xs-flex brz-flex-xs-wrap"
            noValidate
            onSubmit={this.handleSubmit}
          >
            {this.renderFields(v)}
            {this.renderButton(v)}
          </form>
        </div>
      </CustomCSS>
    );
  }

  renderForView(v, vs, vd) {
    const className = classnames(
      "brz-forms2",
      css(
        `${this.constructor.componentId}-form`,
        `${this.getId()}-form`,
        styleForm(v, vs, vd)
      )
    );
    const { _id, messageSuccess, messageError, messageRedirect, customCSS } = v;
    const { submitUrl, recaptcha } = Config.get("applications").form;
    const projectId = Config.get("project").id;
    const recaptchaSiteKey = recaptcha && recaptcha.siteKey;

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={className} data-form-version="2">
          <form
            className="brz-form brz-d-xs-flex brz-flex-xs-wrap"
            action={submitUrl}
            noValidate
            data-form-id={_id}
            data-project-id={projectId}
            data-success={messageSuccess}
            data-error={messageError}
            data-redirect={messageRedirect}
          >
            {this.renderFields(v)}
            {this.renderButton(v)}
            {recaptchaSiteKey && (
              <div
                className="brz-g-recaptcha"
                data-sitekey={recaptchaSiteKey}
                data-size="invisible"
              />
            )}
          </form>
        </div>
      </CustomCSS>
    );
  }
}
