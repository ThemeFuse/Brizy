import React from "react";
import { noop } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import classnames from "classnames";
import Config from "visual/global/Config";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import { css } from "visual/utils/cssStyle";
import { styleForm } from "./styles";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtendFields from "./toolbarExtendFields";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as sidebarExtendButton from "./sidebarExtendButton";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import BoxResizer from "visual/component/BoxResizer";
import { IS_STORY } from "visual/utils/models";

const resizerPoints = ["centerLeft", "centerRight"];

export default class Form2 extends EditorComponent {
  static get componentId() {
    return "Form2";
  }

  static defaultValue = defaultValue;

  static defaultProps = {
    extendParentToolbar: noop
  };

  handleResizerChange = patch => this.patchValue(patch);

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

    const className = classnames(
      "brz-forms2",
      "brz-forms2__item",
      "brz-forms2__item-button",
      { "brz-forms2-story": IS_STORY }
    );

    return (
      <div className={className}>
        <EditorArrayComponent {...itemsProps} />
        {IS_PREVIEW && (
          <ThemeIcon
            className="brz-form-spinner brz-invisible brz-ed-animated--spin"
            name="circle-02"
            type="glyph"
          />
        )}
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

    const restrictions = {
      width: {
        "%": { min: 5, max: 100 }
      }
    };

    const formContent = (
      <form className="brz-form" noValidate onSubmit={this.handleSubmit}>
        {this.renderFields(v)}
        {this.renderButton(v)}
      </form>
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {IS_STORY ? (
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
              restrictions={restrictions}
            >
              {formContent}
            </BoxResizer>
          ) : (
            formContent
          )}
        </Wrapper>
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
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes: { "data-form-version": "2" }
          })}
        >
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
                data-callback="brzFormV2Captcha"
              />
            )}
          </form>
        </Wrapper>
      </CustomCSS>
    );
  }
}
