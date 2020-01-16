import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import Toolbar from "visual/component/Toolbar";
import * as types from "./types/index";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";

class Form2Field extends EditorComponent {
  static get componentId() {
    return "Form2Field";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const {
      labelType,
      placeholder: showPlaceholder,
      className,
      selectClassName,
      labelToolbarExtend,
      selectToolbarExtend
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
          <Toolbar {...labelToolbarExtend}>
            <Component.Label
              id={this.getId()}
              value={v}
              onChange={value => this.patchValue(value)}
            />
          </Toolbar>
        )}
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
          <div>
            <Component
              {...v}
              showPlaceholder={showPlaceholder}
              labelType={labelType}
              selectToolbarItems={selectToolbarExtend}
              selectClassName={selectClassName}
              onChange={value => this.patchValue(value)}
            />
          </div>
        </Toolbar>
      </div>
    );
  }

  renderForView(v, vs, vd) {
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
        {labelType === "outside" && (
          <Component.Label id={this.getId()} value={v} />
        )}
        <Component
          {...v}
          showPlaceholder={showPlaceholder}
          selectClassName={selectClassName}
          labelType={labelType}
        />
      </div>
    );
  }
}

export default Form2Field;
