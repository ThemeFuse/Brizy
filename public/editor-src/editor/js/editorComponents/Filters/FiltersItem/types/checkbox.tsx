import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";
import classnames from "classnames";
import Toolbar from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";
import { CheckGroupItem as CheckboxControlsItem } from "visual/component/Controls/CheckGroup";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";
import Placeholder from "visual/component/Placeholder";

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
  fake?: boolean;
  value?: string;
  label?: string;
  className?: string;
  selectValue?: string;
  toolbarConfigIcon: PortalToolbarProps;
  showPlaceholder?: boolean;
};

export const CheckboxFilters = ({
  showCounter,
  checkboxType,
  toolbarConfig,
  fake = false,
  value = "value",
  label = "label",
  className = "brz-filters__option",
  selectValue = "",
  toolbarConfigIcon,
  showPlaceholder = true
}: Props): ReactElement => {
  const style1: boolean = checkboxType === "style-1";
  const style2: boolean = checkboxType === "style-2";
  const style3: boolean = checkboxType === "style-3";
  const style4: boolean = checkboxType === "style-4";

  const classNameIcon = classnames(
    "brz-control__check-group-icon",
    !style1 && "brz-hidden"
  );

  const text: Array<string> = ["Dress", "Jeans", "Shoes", "Sweatshirt"];
  const count: Array<number> = [4, 13, 7, 1];

  return (
    <>
      {new Array(fake ? 4 : 1).fill("").map(
        (_, i): ReactElement => {
          return (
            <Toolbar {...toolbarConfig} key={`key-${i}`}>
              <div className={className}>
                <CheckboxControlsItem
                  key={`key-${i}`}
                  className={"brz-filters__checkbox-option"}
                  name={`example${i}`}
                  value={style3 || style4 ? selectValue : value}
                  renderIcons={
                    IS_EDITOR
                      ? (): ReactElement =>
                          renderIconForEdit(classNameIcon, toolbarConfigIcon)
                      : (): ReactElement => renderIconForView(classNameIcon)
                  }
                >
                  {style1 || style2 ? (
                    <span className="brz-filters__checkbox-option-name">
                      {fake ? t(text[i]) : label}
                    </span>
                  ) : null}

                  {style4 && showPlaceholder ? (
                    <Placeholder icon="img" />
                  ) : null}

                  {showCounter === "on" && (style1 || style2) ? (
                    <span className={"brz-filters__counter"}>({count[i]})</span>
                  ) : null}
                </CheckboxControlsItem>
              </div>
            </Toolbar>
          );
        }
      )}
    </>
  );
};
