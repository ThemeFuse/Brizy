import React, { ReactElement } from "react";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import {
  WithClassName,
  WithOnChange,
  WithValue
} from "visual/utils/options/attributes";

export type Props = WithClassName & WithOnChange<boolean> & WithValue<boolean>;

export function Switch({ className, value, onChange }: Props): ReactElement {
  const toggle = (): void => onChange(!value);
  const _className = classNames({
    [className || ""]: true,
    "brz-ed-control__switch2": true,
    "brz-ed-control__switch2--on": value
  });

  return (
    <div className={_className} onClick={toggle}>
      <label className="brz-label brz-ed-control__switch2-label">
        <span className="brz-span brz-ed-control__switch2-arrows">
          <EditorIcon
            className="brz-ed-control__switch2--check"
            icon="nc-check-small"
          />
          <EditorIcon
            className="brz-icon-svg brz-ed-control__switch2--un-check"
            icon="nc-remove"
          />
          <span className="brz-span brz-ed-control__switch2--handle" />
        </span>
      </label>
    </div>
  );
}
