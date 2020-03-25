import React from "react";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Config from "visual/global/Config";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as sidebarExtendButton from "./sidebarExtendButton";

export default class Form extends EditorComponent {
  static get componentId() {
    return "Form";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  renderFields() {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: 1,
      itemProps: {
        meta: this.props.meta
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

    return <EditorArrayComponent {...itemsProps} />;
  }

  renderForEdit(v) {
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={styleClassName(v)} style={styleCSSVars(v)}>
          <form className="brz-form" noValidate onSubmit={this.handleSubmit}>
            {this.renderFields(v)}
            {this.renderButton(v)}
          </form>
        </div>
      </CustomCSS>
    );
  }

  renderForView(v) {
    const { _id, messageSuccess, messageError, messageRedirect, customCSS } = v;
    const { submitUrl, recaptcha } = Config.get("applications").form;
    const projectId = Config.get("project").id;
    const recaptchaSiteKey = recaptcha && recaptcha.siteKey;

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div
          className={styleClassName(v)}
          style={styleCSSVars(v)}
          data-form-version="1"
        >
          <form
            className="brz-form"
            action={submitUrl}
            noValidate
            data-form-id={_id}
            data-project-id={projectId}
            data-success={messageSuccess}
            data-error={messageError}
            data-redirect={messageRedirect}
            onSubmit={this.handleSubmit}
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
