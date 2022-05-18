import React, { ReactElement } from "react";
import Toolbar from "visual/component/Toolbar";
import classnames from "classnames";
import { ThemeIcon } from "visual/component/ThemeIcon";
import EditorIcon from "visual/component/EditorIcon";
import { CheckGroupItem as CheckboxControlsItem } from "visual/component/Controls/CheckGroup";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

const renderIconForEdit = (
  className: string,
  toolbarConfig: PortalToolbarProps
): ReactElement => {
  return (
    <Toolbar {...toolbarConfig}>
      <div className={className}>
        <EditorIcon className="brz-d-block" icon={"nc-check-square-off"} />
      </div>
    </Toolbar>
  );
};

const renderIconForView = (className: string): ReactElement => {
  return (
    <>
      <div className={`${className} brz-control__check-group--check`}>
        <ThemeIcon
          className="brz-d-block"
          name="check-square-on"
          type="editor"
        />
      </div>
      <div className={`${className} brz-control__check-group--uncheck`}>
        <ThemeIcon
          className="brz-d-block"
          name="check-square-off"
          type="editor"
        />
      </div>
    </>
  );
};

type Props = {
  showCounter: string;
  checkboxType: "style-1" | "style-2" | "style-3" | "style-4";
  toolbarConfig: PortalToolbarProps;
  label: string;
  className: string;
  toolbarConfigIcon: PortalToolbarProps;
  min: string;
  max: string;
};

export const CheckrangeFilters = ({
  showCounter,
  checkboxType,
  toolbarConfig,
  label = "",
  className = "brz-filters__option",
  toolbarConfigIcon,
  min,
  max
}: Props): ReactElement => {
  const style1: boolean = checkboxType === "style-1";
  const style2: boolean = checkboxType === "style-2";

  const classNameIcon: string = classnames(
    "brz-control__check-group-icon",
    style2 && "brz-hidden"
  );

  const count: Array<number> = [4, 13, 7, 1];

  const lbl: string = label.length
    ? label.replace("[min]", min).replace("[max]", max)
    : "$0 - 100$";

  return (
    <>
      {new Array(1).fill("").map((_, i) => (
        <Toolbar {...toolbarConfig} key={`key-${i}`}>
          <div className={className}>
            <CheckboxControlsItem
              key={`key-${i}`}
              className={"brz-filters__checkbox-option"}
              name={`example${i}`}
              value={`example${i}`}
              renderIcons={
                IS_EDITOR
                  ? (): ReactElement =>
                      renderIconForEdit(classNameIcon, toolbarConfigIcon)
                  : (): ReactElement => renderIconForView(classNameIcon)
              }
            >
              {lbl.length ? (
                <span className="brz-filters__checkbox-option-name">{lbl}</span>
              ) : null}

              {showCounter === "on" && (style1 || style2) ? (
                <span className={"brz-filters__counter"}>({count[i]})</span>
              ) : null}
            </CheckboxControlsItem>
          </div>
        </Toolbar>
      ))}
    </>
  );
};
