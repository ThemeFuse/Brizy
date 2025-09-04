import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { FormEvent } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { ElementPatch, ElementProps } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getBoxResizerParams } from "visual/editorComponents/Form2/utils";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isStory } from "visual/providers/EditorModeProvider";
import { isView } from "visual/providers/RenderProvider";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import * as Attr from "visual/utils/string/parseCustomAttributes";
import { MValue } from "visual/utils/value";
import { withMigrations } from "../tools/withMigrations";
import { Button, MSButtons, SubmitButton } from "./Components/Buttons";
import { Form } from "./Components/Form";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations/Form2";
import * as sidebarExtendButton from "./sidebarExtendButton";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { styleForm } from "./styles";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as toolbarExtendFields from "./toolbarExtendFields";
import * as toolbarExtendMultiStepBtn from "./toolbarExtendMultiStepBtn";
import * as toolbarExtendParent from "./toolbarExtendParent";
import type { State, Value } from "./types";

class Form2 extends EditorComponent<Value, ElementProps, State> {
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
        placeholder: placeholder === "on",
        labelType: label === "off" ? "inside" : "outside",
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
        renderer: {
          disableTooltip: true,
          form: {
            percentWidth: true
          }
        },
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendMultiStepBtn,
          undefined,
          { allowExtend: false }
        ),
        updateWidthPrefixBySizeChange: "px"
      }
    });
  }

  renderPrevButton(): React.JSX.Element {
    const itemsProps = this.getPrevAndNextButtonsItemProps(3, 4);

    const style = {
      display: isView(this.props.renderContext) ? "none" : ""
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

    const submitButtonItemProps = {
      renderer: {
        disableTooltip: true,
        form: {
          percentWidth: true
        }
      }
    };

    const className = classnames({
      "brz-form-ms-buttons--story": isStory(this.props.editorMode)
    });

    if (isView(this.props.renderContext)) {
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
            {this.renderButton(v, submitButtonItemProps)}
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

  renderButton(
    v: Value,
    itemProps?: Record<string, unknown>
  ): React.JSX.Element {
    const { multistep } = v;
    const IS_VIEW = isView(this.props.renderContext);

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
        ),
        updateWidthPrefixBySizeChange: "px",
        renderer: {
          disableTooltip: true
        },
        ...itemProps
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
        {({ ref: cssRef }) => (
          <SubmitButton
            className={className}
            style={style}
            attributes={Attr.mRead(v.customAttributes)}
            ref={cssRef}
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
        )}
      </CustomCSS>
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const { meta } = this.props;
    const { multistep, customCSS } = v;
    const { points, restrictions } = getBoxResizerParams();

    const isMultistepEnabled = multistep === "on";

    const className = classnames(
      "brz-forms2",
      { "brz-forms2--multistep": isMultistepEnabled },
      this.css(
        `${this.getComponentId()}-form`,
        `${this.getId()}-form`,
        styleForm({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const formContent = (
      <Form className="brz-form" onSubmit={this.handleSubmit}>
        {!isMultistepEnabled ? (
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
        {({ ref: cssRef }) => (
          <Wrapper {...this.makeWrapperProps({ className, ref: cssRef })}>
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
        )}
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
      messageEmptyRequired,
      customCSS,
      multistep,
      actionClosePopup
    } = v;

    const isMultistepEnabled = multistep === "on";

    const { action, recaptcha } = config?.integrations?.form ?? {};
    const projectId = config?.project?.id ?? "";
    const recaptchaSiteKey = recaptcha && recaptcha.siteKey;

    const className = classnames(
      "brz-forms2",
      { "brz-forms2--multistep": isMultistepEnabled },
      this.css(
        `${this.getComponentId()}-form`,
        `${this.getId()}-form`,
        styleForm({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const formType = isMultistepEnabled ? "multistep" : "default";

    const { popupId } = this.props.meta;

    const attr = {
      action,
      [makeAttr("form-id")]: _id,
      [makeAttr("project-id")]: projectId,
      [makeAttr("success")]: messageSuccess,
      [makeAttr("error")]: messageError,
      [makeAttr("redirect")]: messageRedirect,
      [makeAttr("empty")]: messageEmptyRequired,
      [makeAttr("form-type")]: formType,
      [makeAttr("default-success", true)]: "Your email was sent successfully",
      [makeAttr("default-error", true)]: "Your email was not sent",
      [makeAttr("default-empty", true)]: "Please fill in the required fields",
      [makeAttr("default-invalid", true)]:
        "Please check your entry and try again",
      [makeAttr("default-invalid-email", true)]:
        "Please enter a valid email address (e.g., name@example.com)",
      ...(popupId
        ? {
            [makeAttr("close-popup")]: actionClosePopup,
            [makeAttr("popup-id")]: popupId
          }
        : {})
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
            {!isMultistepEnabled ? (
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

export default withMigrations(Form2, migrations);
