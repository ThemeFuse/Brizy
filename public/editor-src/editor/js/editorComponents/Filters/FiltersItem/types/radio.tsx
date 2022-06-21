import React, { ReactElement } from "react";
import Toolbar from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";
import { RadioItem as RadioControlsItem } from "visual/component/Controls/Radio";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";
import Placeholder from "visual/component/Placeholder";

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
  name?: string;
  showPlaceholder?: boolean;
};

export const RadioFilters = ({
  showCounter,
  checkboxType,
  toolbarConfig,
  fake = false,
  value = "value",
  label = "label",
  className = "brz-filters__option",
  selectValue = "",
  toolbarConfigIcon,
  name = "",
  showPlaceholder = true
}: Props): ReactElement => {
  const style1: boolean = checkboxType === "style-1";
  const style2: boolean = checkboxType === "style-2";
  const style3: boolean = checkboxType === "style-3";
  const style4: boolean = checkboxType === "style-4";

  const text: Array<string> = [
    "American Express",
    "MasterCard",
    "Visa",
    "PayPal"
  ];
  const count: Array<number> = [4, 8, 7, 14];

  return (
    <>
      {new Array(fake ? 4 : 1).fill("").map((_, i) => {
        return (
          <Toolbar {...toolbarConfig} key={`key-${i}`}>
            <div className={className}>
              <RadioControlsItem
                key={`key-${i}`}
                className={"brz-filters__radio-option"}
                value={style3 || style4 ? selectValue : value}
                name={name}
                checkIcon={"check-circle-on"}
                unCheckIcon="check-circle-off"
                toolbarIcon={toolbarConfigIcon}
              >
                {style1 || style2 ? (
                  <span className="brz-filters__radio-option-name">
                    {fake ? t(text[i]) : label}
                  </span>
                ) : null}

                {style4 && showPlaceholder ? <Placeholder icon="img" /> : null}

                {showCounter === "on" && (style1 || style2) ? (
                  <span className={"brz-filters__counter"}>({count[i]})</span>
                ) : null}
              </RadioControlsItem>
            </div>
          </Toolbar>
        );
      })}
    </>
  );
};
