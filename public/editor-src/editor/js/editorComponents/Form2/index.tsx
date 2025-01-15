import classnames from "classnames";
import React, { FormEvent } from "react";
import { noop } from "underscore";
import { isView } from "visual/providers/RenderProvider";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { ElementPatch, ElementProps } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getBoxResizerParams } from "visual/editorComponents/Form2/utils";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isStory } from "visual/global/EditorModeContext";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import * as Attr from "visual/utils/string/parseCustomAttributes";
import { MValue } from "visual/utils/value";
import { Button, MSButtons, SubmitButton } from "./Components/Buttons";
import { Form } from "./Components/Form";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendButton from "./sidebarExtendButton";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { styleForm } from "./styles";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as toolbarExtendFields from "./toolbarExtendFields";
import * as toolbarExtendMultiStepBtn from "./toolbarExtendMultiStepBtn";
import * as toolbarExtendParent from "./toolbarExtendParent";
import type { State, Value } from "./types";

export default class Form2 extends EditorComponent<Value, ElementProps, State> {
  static defaultValue = defaultValue;
  static defaultProps = {
    meta: {},
    onToolbarOpen: noop,
    onToolbarClose: noop,
    onToolbarEnter: noop,
    onToolbarLeave: noop,
    extendParentToolbar: noop
  };
  state = {
    active: 1
  };

  static get componentId(): ElementTypes.Form2 {
    return ElementTypes.Form2;
  }

  handleResizerChange = (patch: ElementPatch<Value>): void =>
    this.patchValue(patch);

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      { allowExtend: false }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  getTotalSteps(v: Value): MValue<number> {
    return v.items[2]?.value?.items?.length;
  }

  handleActive = (active: State["active"]): void => {
    this.setState({ active });
  };

  renderMultiStep(v: Value): React.JSX.Element {
    const { active } = this.state;
    const { label, placeholder, viewType, multistep } = v;

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 2,
      sliceEndIndex: 3,
      itemProps: {
        onActiveChange: this.handleActive,
        activeStep: active,
        viewType,
        multistep,
        labelType: label === "off" ? "inside" : "outside",
        placeholder: placeholder === "on",
        meta: this.props.meta,
        toolbarExtendFields: this.makeToolbarPropsFromConfig2(
          toolbarExtendFields,
          undefined,
          { allowExtend: false }
        )
      }
    });

    // @ts-expect-error EditorArrayComponent should be converted to .ts
    return <EditorArrayComponent {...itemsProps} />;
  }

  getPrevAndNextButtonsItemProps(
    sliceStartIndex: number,
    sliceEndIndex: number
  ) {
    return this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex,
      sliceEndIndex,
      itemProps: {
        meta: this.props.meta,
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendMultiStepBtn,
          undefined,
          { allowExtend: false }
        )
      }
    });
  }

  renderPrevButton(): React.JSX.Element {
    const itemsProps = this.getPrevAndNextButtonsItemProps(3, 4);

    const style = {
      display: isView(this.renderContext) ? "none" : ""
    };

    return (
      <Button className="brz-form-ms-prev-button" style={style}>
        {/*@ts-expect-error EditorArrayComponent should be converted to .ts*/}
        <EditorArrayComponent {...itemsProps} />
      </Button>
    );
  }

  renderNextButton(): React.JSX.Element {
    const itemsProps = this.getPrevAndNextButtonsItemProps(4, 5);

    return (
      <Button className="brz-form-ms-next-button">
        {/*@ts-expect-error EditorArrayComponent should be converted to .ts*/}
        <EditorArrayComponent {...itemsProps} />
      </Button>
    );
  }

  renderMsButtons(v: Value): React.JSX.Element {
    const { active } = this.state;
    const totalSteps = this.getTotalSteps(v);

    const className = classnames({
      "brz-form-ms-buttons--story": isStory(this.props.editorMode)
    });

    if (isView(this.renderContext)) {
      return (
        <MSButtons className={className}>
          {this.renderPrevButton()}
          {this.renderNextButton()}
          {this.renderButton(v)}
        </MSButtons>
      );
    }

    return (
      <MSButtons className={className}>
        {active === 1 && this.renderNextButton()}
        {active === totalSteps && (
          <>
            {this.renderPrevButton()}
            {this.renderButton(v)}
          </>
        )}
        {active !== 1 && active !== totalSteps && (
          <>
            {this.renderPrevButton()}
            {this.renderNextButton()}
          </>
        )}
      </MSButtons>
    );
  }

  renderFields(v: Value): React.JSX.Element {
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
          undefined,
          { allowExtend: false }
        )
      }
    });

    // @ts-expect-error EditorArrayComponent should be converted to .ts
    return <EditorArrayComponent {...itemsProps} />;
  }

  renderButton(v: Value): React.JSX.Element {
    const { multistep } = v;
    const IS_VIEW = isView(this.renderContext);

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 1,
      sliceEndIndex: 2,
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
      { "brz-forms2-story": isStory(this.props.editorMode) }
    );

    const style = {
      display: IS_VIEW && multistep === "on" ? "none" : ""
    };

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <SubmitButton
          className={className}
          style={style}
          attributes={Attr.mRead(v.customAttributes)}
        >
          {/*@ts-expect-error EditorArrayComponent should be converted to .ts*/}
          <EditorArrayComponent {...itemsProps} />
          {IS_VIEW && (
            <ThemeIcon
              className="brz-form-spinner brz-invisible brz-ed-animated--spin"
              name="circle-02"
              type="glyph"
            />
          )}
        </SubmitButton>
      </CustomCSS>
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const { meta } = this.props;
    const { multistep, customCSS } = v;
    const { points, restrictions } = getBoxResizerParams();

    const className = classnames(
      "brz-forms2",
      this.css(
        `${this.getComponentId()}-form`,
        `${this.getId()}-form`,
        styleForm({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    const formContent = (
      <Form className="brz-form" onSubmit={this.handleSubmit}>
        {multistep === "off" ? (
          <>
            {this.renderFields(v)}
            {this.renderButton(v)}
          </>
        ) : (
          <>
            {this.renderMultiStep(v)}
            {this.renderMsButtons(v)}
          </>
        )}
      </Form>
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {isStory(this.props.editorMode) ? (
            <BoxResizer
              points={points}
              meta={meta}
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

  renderForView(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const config = this.getGlobalConfig();

    const {
      _id,
      messageSuccess,
      messageError,
      messageRedirect,
      customCSS,
      multistep
    } = v;

    const { action, recaptcha } = config?.integrations?.form ?? {};
    const projectId = config?.project?.id ?? "";
    const recaptchaSiteKey = recaptcha && recaptcha.siteKey;

    const className = classnames(
      "brz-forms2",
      this.css(
        `${this.getComponentId()}-form`,
        `${this.getId()}-form`,
        styleForm({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    const formType = multistep === "on" ? "multistep" : "default";

    const attr = {
      action,
      [makeAttr("form-id")]: _id,
      [makeAttr("project-id")]: projectId,
      [makeAttr("success")]: messageSuccess,
      [makeAttr("error")]: messageError,
      [makeAttr("redirect")]: messageRedirect,
      [makeAttr("form-type")]: formType,
      [makeAttr("default-success", true)]: "Your email was sent successfully",
      [makeAttr("default-error", true)]: "Your email was not sent",
      [makeAttr("default-empty", true)]: "Please check your entry and try again"
    };

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes: makeDataAttr({ name: "form-version", value: "2" })
          })}
        >
          <Form
            className="brz-d-xs-flex brz-flex-xs-wrap"
            attributes={attr}
            recaptcha={recaptchaSiteKey}
          >
            {multistep === "off" ? (
              <>
                {this.renderFields(v)}
                {this.renderButton(v)}
              </>
            ) : (
              <>
                {this.renderMultiStep(v)}
                {this.renderMsButtons(v)}
              </>
            )}
          </Form>
        </Wrapper>
      </CustomCSS>
    );
  }
}
