import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as sidebarExtendButton from "./sidebarExtendButton";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../tools/Wrapper";

class ResetPassword extends EditorComponent {
  static get componentId() {
    return "ResetPassword";
  }

  static defaultValue = defaultValue;

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

  handleResizerChange = patch => this.patchValue(patch);

  handleSubmit = e => {
    e.preventDefault();
  };

  renderResetPasswordFields(v) {
    const fieldsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: 2,
      itemProps: {
        meta: this.props.meta,
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          toolbarExtendLabel,
          sidebarExtendLabel,
          { allowExtend: false }
        ),
        toolbarExtend: this.makeToolbarPropsFromConfig2(toolbarExtend, null, {
          allowExtend: false
        }),
        showLabel: v.showLabel,
        showPlaceholder: v.showPlaceholder
      }
    });
    return <EditorArrayComponent {...fieldsProps} />;
  }

  renderButton() {
    const buttonsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 2,
      sliceEndIndex: 3,
      itemProps: {
        meta: this.props.meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendButton,
          sidebarExtendButton,
          { allowExtend: false }
        ),
        attributes: {
          type: "submit"
        }
      }
    });
    return (
      <div className="brz-reset-psw-form__field brz-reset-psw__item-button">
        <div className="brz-reset-psw__item brz-align-self-xs-end">
          <EditorArrayComponent {...buttonsProps} />
        </div>
      </div>
    );
  }

  renderResetPasswordForm(v) {
    return (
      <>
        {this.renderResetPasswordFields(v)}
        {this.renderButton()}
      </>
    );
  }

  renderForm(v) {
    if (IS_EDITOR) {
      return (
        <form className="brz-reset-psw-form">
          {this.renderResetPasswordForm(v)}
        </form>
      );
    } else {
      return (
        <form className="brz-reset-psw-form" noValidate>
          {this.renderResetPasswordForm(v)}
        </form>
      );
    }
  }

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-reset-psw",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes: {
              "data-redirect": v.redirectType,
              "data-redirect-value": v.messageRedirect,
              "data-error-empty": v.emptyFieldsError,
              "data-error-url": v.submitUrlError,
              "data-error-passlength": v.passLengthError,
              "data-error-passmatch": v.passMatchError
            }
          })}
        >
          {this.renderForm(v)}
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default ResetPassword;
