import { Obj } from "@brizy/readers";
import classnames from "classnames";
import React from "react";
import { getIn } from "timm";
import Toolbar from "visual/component/Toolbar";
import { Translate } from "visual/component/Translate";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Model } from "visual/editorComponents/EditorComponent/types";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { uuid } from "visual/utils/uuid";
import { migrations } from "../migrations/Form2Field";
import Form2FieldItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import { style } from "./styles";
import * as toolbar from "./toolbars/toolbar";
import { Error, FormInput, Props, Value } from "./type";
import { Label } from "./types/common/Label";
import types from "./types/index";
import { Active } from "./types/type";

class Form2Field extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.Form2Field {
    return ElementTypes.Form2Field;
  }

  getError(v: Value): Error {
    const {
      type,
      fileSizeErrorMessage,
      fileTypeErrorMessage,
      numberMinMessage,
      numberMaxMessage
    } = v;

    switch (type) {
      case FormInput.FileUpload:
        return {
          fileMaxSizeError: fileSizeErrorMessage,
          fileTypeError: fileTypeErrorMessage
        };

      case FormInput.Number:
        return {
          minNumError: numberMinMessage,
          maxNumError: numberMaxMessage
        };
      default:
        return {};
    }
  }

  handleActive = (active: Active): void => this.patchValue({ active });

  renderForEdit(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const {
      labelType,
      placeholder: showPlaceholder,
      className,
      selectClassName,
      toolbarExtendLabel,
      toolbarExtendSelect,
      toolbarExtend: _toolbarExtend
    } = this.props;

    const { type, active, label, activeRadio } = v;

    const Component = types[type];

    const classNameField = classnames(
      "brz-forms2__item",
      className,
      this.css(
        `${this.getComponentId()}-field`,
        `${this.getId()}-field`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const isSelect = type === ElementTypes.Select;
    const isRadio = type === ElementTypes.Radio;
    const isCheckbox = type === ElementTypes.Checkbox;

    const isRadioOrCheckbox = isRadio || isCheckbox;
    const isTypeWithItems = isSelect || isRadioOrCheckbox;

    const toolbarExtend = isSelect
      ? toolbarExtendSelect
      : isRadioOrCheckbox
        ? this.makeToolbarPropsFromConfig2(toolbar)
        : _toolbarExtend;

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        type,
        toolbarExtend,
        ...(isRadioOrCheckbox ? { active, label } : {}),
        ...(isRadio ? { activeRadio } : {}),
        handleChangeActive: this.handleActive,
        handleRadioChange: (activeRadio: number) =>
          this.patchValue({ activeRadio })
      }
    });

    return (
      <div className={classNameField}>
        {labelType === "outside" && (
          // @ts-expect-error: Need transform toolbarExtendLabel to TS
          <Toolbar {...toolbarExtendLabel}>
            {({ ref }) => (
              <Label
                id={this.getId()}
                value={v}
                onChange={(value: Partial<Model<Value>>) =>
                  this.patchValue(value)
                }
                renderContext={this.props.renderContext}
                ref={ref}
                type={type}
              />
            )}
          </Toolbar>
        )}

        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
          {({ ref }) => (
            <div ref={ref}>
              {!isTypeWithItems && (
                <Component
                  {...v}
                  showPlaceholder={showPlaceholder}
                  labelType={labelType}
                  {...(isSelect
                    ? { toolbarExtendSelect, selectClassName }
                    : {})}
                  onChange={(value: Partial<Model<Value>>) =>
                    this.patchValue(value)
                  }
                  renderContext={this.props.renderContext}
                />
              )}
              {isSelect && (
                <Component
                  {...v}
                  showPlaceholder={showPlaceholder}
                  labelType={labelType}
                  toolbarExtendSelect={toolbarExtendSelect}
                  selectClassName={selectClassName}
                  onChange={(value: Partial<Model<Value>>) =>
                    this.patchValue(value)
                  }
                  renderContext={this.props.renderContext}
                >
                  {/* @ts-expect-error: ArrayComponent to ts */}
                  <Form2FieldItems {...itemProps} />
                </Component>
              )}
            </div>
          )}
        </Toolbar>
        {/* render Radio and Checkbox here because toolbar above we merge with toolbar from From2FieldOption */}
        {isRadioOrCheckbox && (
          <div>
            <Component
              {...v}
              showPlaceholder={showPlaceholder}
              labelType={labelType}
              onChange={(value: Partial<Model<Value>>) =>
                this.patchValue(value)
              }
              renderContext={this.props.renderContext}
            >
              {/* @ts-expect-error: ArrayComponent to ts */}
              <Form2FieldItems {...itemProps} />
            </Component>
          </div>
        )}
      </div>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const {
      labelType,
      placeholder: showPlaceholder,
      className,
      selectClassName
    } = this.props;

    const {
      type,
      customFieldName,
      _id,
      active,
      label,
      required,
      activeRadio,
      defaultValue
    } = v;
    const name = customFieldName ?? _id;
    const Component = types[type];

    const uidPlaceholder = makePlaceholder({
      content: "{{ random_id }}",
      attr: { key: name }
    });
    const labelId = `${uuid()}_${uidPlaceholder}`;

    const classNameField = classnames(
      "brz-forms2__item",
      className,
      { "brz-d-none": type === ElementTypes.Hidden },
      this.css(
        `${this.getComponentId()}-field`,
        `${this.getId()}-field`,
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const isRadio = type === ElementTypes.Radio;
    const isCheckbox = type === ElementTypes.Checkbox;
    const isRadioOrCheckbox = isRadio || isCheckbox;
    const activeValueForCheckbox = isCheckbox
      ? {
          active: {
            ...(Obj.isObject(active) ? active : {}),
            ...defaultValue
              ?.split(",")
              .reduce((acc, k) => ({ ...acc, [k.trim()]: true }), {})
          }
        }
      : {};
    const activeValueForRadio = isRadio ? { activeRadio } : {};

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        type,
        ...activeValueForCheckbox,
        ...activeValueForRadio,
        ...(isRadioOrCheckbox ? { name } : {}),
        ...(required === "on" ? { required } : {}),
        label
      }
    });

    const isSelect = type === ElementTypes.Select;
    const isTypeWithItems =
      type === ElementTypes.Radio || type === ElementTypes.Checkbox || isSelect;
    // Re-order values only for Radio
    const value = isRadio
      ? defaultValue || getIn(v.items[activeRadio ?? 0], ["value", "value"])
      : defaultValue;

    return (
      <Translate className={classNameField}>
        {labelType === "outside" && (
          <Label
            id={labelId}
            value={v}
            onChange={(value: Partial<Model<Value>>) => this.patchValue(value)}
            renderContext={this.props.renderContext}
            type={type}
          />
        )}
        {!isTypeWithItems ? (
          <Component
            {...v}
            name={name}
            labelId={labelId}
            error={this.getError(v)}
            showPlaceholder={showPlaceholder}
            labelType={labelType}
            renderContext={this.props.renderContext}
            {...(isSelect ? { selectClassName } : {})}
          />
        ) : (
          <Component
            {...v}
            defaultValue={value}
            name={name}
            label={label}
            labelId={labelId}
            error={this.getError(v)}
            showPlaceholder={showPlaceholder}
            selectClassName={selectClassName}
            labelType={labelType}
            renderContext={this.props.renderContext}
          >
            {/* @ts-expect-error: ArrayComponent to ts */}
            <Form2FieldItems {...itemProps} />
          </Component>
        )}
      </Translate>
    );
  }
}

export default withMigrations(Form2Field, migrations);
