import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendButton from "./sidebarExtendButton";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as toolbarExtendParent from "./toolbarExtendParent";

class ResetPassword extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return ElementTypes.ResetPassword;
  }

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  handleSubmit = (e) => {
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
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtend,
          sidebarExtend,
          { allowExtend: false }
        ),
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
    if (isEditor(this.props.renderContext)) {
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
    const {
      customCSS,
      redirectType,
      messageRedirect,
      emptyFieldsError,
      submitUrlError,
      passLengthError,
      passMatchError
    } = v;
    const className = classnames(
      "brz-reset-psw",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        {({ ref: cssRef }) => (
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: {
                ...makeDataAttr({ name: "redirect", value: redirectType }),
                ...makeDataAttr({
                  name: "redirect-value",
                  value: messageRedirect
                }),
                ...makeDataAttr({
                  name: "error-empty",
                  value: emptyFieldsError,
                  translatable: true
                }),
                ...makeDataAttr({
                  name: "error-url",
                  value: submitUrlError,
                  translatable: true
                }),
                ...makeDataAttr({
                  name: "error-passlength",
                  value: passLengthError
                }),
                ...makeDataAttr({
                  name: "error-passmatch",
                  value: passMatchError
                })
              },
              ref: cssRef
            })}
          >
            {this.renderForm(v)}
          </Wrapper>
        )}
      </CustomCSS>
    );
  }
}

export default ResetPassword;
