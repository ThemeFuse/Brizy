import classnames from "classnames";
import React, { FC, ReactElement, useCallback } from "react";
import { IconsName } from "../EditorIcon/types";
import { EditorIcon } from "../index";
import { Props } from "./types";

export const Switch: FC<Props> = ({
  className,
  value,
  theme,
  onChange
}): ReactElement => {
  const toggle = useCallback((): void => onChange(!value), [onChange, value]);
  const _className = classnames(className, "brz-ed-control__switch", {
    "brz-ed-control__switch--on": value,
    "brz-ed-control__switch--light": theme === "light"
  });

  return (
    <div className={_className} onClick={toggle}>
      <span className="brz-span brz-ed-control__switch-arrows">
        <EditorIcon
          className="brz-ed-control__switch--check"
          icon={IconsName.CheckSmall}
        />
        <EditorIcon
          className="brz-icon-svg brz-ed-control__switch--un-check"
          icon={IconsName.Close}
        />
        <span className="brz-span brz-ed-control__switch--handle" />
      </span>
    </div>
  );
};
