import classNames from "classnames";
import React, { ReactElement, useCallback } from "react";
import EditorIcon from "visual/component/EditorIcon";
import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/types/attributes";

export type Props = WithClassName & WithOnChange<boolean> & WithValue<boolean>;

export function Switch({ className, value, onChange }: Props): ReactElement {
  const toggle = useCallback((): void => onChange(!value), [onChange, value]);
  const _className = classNames({
    [className || ""]: true,
    "brz-ed-control__switch": true,
    "brz-ed-control__switch--on": value
  });

  return (
    <div className={_className} onClick={toggle}>
      <label className="brz-label brz-ed-control__switch-label">
        <span className="brz-span brz-ed-control__switch-arrows">
          <EditorIcon
            className="brz-ed-control__switch--check"
            icon="nc-check-small"
          />
          <EditorIcon
            className="brz-icon-svg brz-ed-control__switch--un-check"
            icon="nc-remove"
          />
          <span className="brz-span brz-ed-control__switch--handle" />
        </span>
      </label>
    </div>
  );
}
