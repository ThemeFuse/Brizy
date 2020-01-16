import React from "react";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import Config from "visual/global/Config";
import CustomCSS from "visual/component/CustomCSS";
import Form2Items from "./Items";
import { css } from "visual/utils/cssStyle";
import { styleForm } from "./styles";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendConfigFields from "./toolbarExtendFields";
import * as toolbarExtendConfigButton from "./toolbarExtendButton";
import * as parentToolbarExtend from "./parentExtendToolbar";

const FIELDS_INDEX = 0;
const BUTTON_INDEX = 1;

class Form2 extends EditorComponent {
  static get componentId() {
    return "Form2";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      parentToolbarExtend,
      { allowExtend: false }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleSubmit = e => {
    e.preventDefault();
  };

  renderItems(v) {
    const { label, placeholder } = v;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      meta: this.props.meta,
      labelType: label === "off" ? "inside" : "outside",
      itemProps: (_, itemIndex) => {
        let props = {
          meta: this.props.meta,
          labelType: label === "off" ? "inside" : "outside",
          placeholder: placeholder === "on"
        };

        switch (itemIndex) {
          case FIELDS_INDEX:
            props = {
              ...props,
              toolbarExtend: this.makeToolbarPropsFromConfig2(
                toolbarExtendConfigFields,
                { allowExtend: false }
              )
            };
            break;
          case BUTTON_INDEX:
            props = {
              ...props,
              toolbarExtend: this.makeToolbarPropsFromConfig2(
                toolbarExtendConfigButton,
                { allowExtend: false }
              )
            };
            break;
          default:
            throw new Error(`Form unexpected index ${itemIndex}`);
        }

        return props;
      }
    });

    return <Form2Items {...itemsProps} />;
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
            {this.renderItems(v)}
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
            {this.renderItems(v)}
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

export default Form2;
