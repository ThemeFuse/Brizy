import React, { ForwardedRef, forwardRef } from "react";
import { isEditor } from "visual/providers/RenderProvider";
import { FormInput } from "../../type";

interface Props {
  id: string;
  value: {
    label?: string;
    placeholder?: string;
  };
  onChange: (value: { label: string }) => void;
  renderContext: string;
  type: string;
}

export const Label = forwardRef<HTMLDivElement, Props>(
  ({ id, value, onChange, renderContext, type }, ref) => {
    const { label, placeholder: _placeholder } = value;

    if (isEditor(renderContext)) {
      return (
        <label
          className="brz-label brz-forms2__field-label"
          ref={ref as ForwardedRef<HTMLLabelElement>}
        >
          <div className="brz-p-relative">
            <input
              className="brz-input brz-p-absolute"
              type="text"
              value={label}
              placeholder={_placeholder === null ? label : _placeholder}
              onChange={(e) => {
                onChange({ label: e.target.value });
              }}
            />
            <span className="brz-invisible">{label}</span>
          </div>
        </label>
      );
    }

    return type === FormInput.Hidden ? null : (
      <label className="brz-label brz-forms2__field-label" htmlFor={id}>
        {label}
      </label>
    );
  }
);
