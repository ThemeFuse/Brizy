import { Num } from "@brizy/readers";
import classnames from "classnames";
import React, { ReactElement } from "react";
import { Text } from "visual/component/ContentOptions/types";
import { ElementModel } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeAttr } from "visual/utils/i18n/attribute";
import { encodeToString } from "visual/utils/string";
import TextField from "./common/TextField";

interface Value extends ElementModel {
  calculatedExpression: string;
  attr: Record<string, unknown>;
}

export default class Calculated extends TextField {
  static get componentType(): ElementTypes.Calculated {
    return ElementTypes.Calculated;
  }

  renderForEdit(v: Value, isPreview?: boolean): ReactElement {
    const { attr } = v;
    const {
      calculatedExpression,
      onChange,
      defaultValue: _defaultValue
    } = this.props;
    const calculatedAttr = {
      [makeAttr("calc-expression")]: encodeToString(calculatedExpression)
    };

    const _classNames = this.getClassName(v);
    const classNames = classnames("brz-forms2__calculated", _classNames);

    const { defaultValue, ...attributes } = attr;
    const value = Num.read(defaultValue) || _defaultValue || 0;

    return (
      <div className={classNames}>
        <Text
          className="brz-forms2__calculated-text"
          id="calculatedText"
          v={v}
          onChange={onChange}
        />
        <span className="brz-forms2__calculated-result" {...calculatedAttr}>
          {value}
        </span>
        {isPreview && (
          // this input is needed to getFormData() function from export
          <input
            {...attributes}
            className="brz-input brz-hidden"
            type="hidden"
            value={value}
          />
        )}
      </div>
    );
  }

  renderForView(v: Value): ReactElement {
    return this.renderForEdit(v, true);
  }
}
