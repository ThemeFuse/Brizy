import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import Toolbar from "visual/component/Toolbar";
import * as types from "./types/index";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import defaultValue from "./defaultValue";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import { uuid } from "visual/utils/uuid";

class Form2Field extends EditorComponent {
  static get componentId() {
    return "Form2Field";
  }

  static defaultValue = defaultValue;

  getError(v) {
    const {
      type,
      fileSizeErrorMessage,
      fileTypeErrorMessage,
      numberMinMessage,
      numberMaxMessage
    } = v;
    switch (type) {
      case "FileUpload":
        return {
          fileMaxSizeError: fileSizeErrorMessage,
          fileTypeError: fileTypeErrorMessage
        };

      case "Number":
        return {
          minNumError: numberMinMessage,
          maxNumError: numberMaxMessage
        };
      default:
        return {};
    }
  }

  renderForEdit(v, vs, vd) {
    const {
      labelType,
      placeholder: showPlaceholder,
      className,
      selectClassName,
      toolbarExtendLabel,
      toolbarExtendSelect
    } = this.props;
    const { type } = v;
    const Component = types[type];
    const classNameField = classnames(
      "brz-forms2__item",
      className,
      css(
        `${this.constructor.componentId}-field`,
        `${this.getId()}-field`,
        style(v, vs, vd)
      )
    );

    return (
      <div className={classNameField}>
        {labelType === "outside" && (
          <Toolbar {...toolbarExtendLabel}>
            <Component.Label
              id={this.getId()}
              value={v}
              onChange={value => this.patchValue(value)}
            />
          </Toolbar>
        )}
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
          <div>
            <Component
              {...v}
              showPlaceholder={showPlaceholder}
              labelType={labelType}
              toolbarExtendSelect={toolbarExtendSelect}
              selectClassName={selectClassName}
              onChange={value => this.patchValue(value)}
            />
          </div>
        </Toolbar>
      </div>
    );
  }

  renderForView(v, vs, vd) {
    const labelId = uuid();

    const {
      labelType,
      placeholder: showPlaceholder,
      className,
      selectClassName
    } = this.props;
    const { type } = v;
    const Component = types[type];
    const classNameField = classnames(
      "brz-forms2__item",
      className,
      { "brz-d-none": v.type === "Hidden" },
      css(
        `${this.constructor.componentId}-field`,
        `${this.getId()}-field`,
        style(v, vs, vd)
      )
    );

    return (
      <div className={classNameField}>
        {labelType === "outside" && <Component.Label id={labelId} value={v} />}
        <Component
          {...v}
          labelId={labelId}
          error={this.getError(v)}
          showPlaceholder={showPlaceholder}
          selectClassName={selectClassName}
          labelType={labelType}
        />
      </div>
    );
  }
}

export default Form2Field;
