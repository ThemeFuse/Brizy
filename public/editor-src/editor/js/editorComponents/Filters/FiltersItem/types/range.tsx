import React, { ReactElement } from "react";
import Toolbar from "visual/component/Toolbar";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

type Props = {
  toolbarConfig: PortalToolbarProps;
  toolbarConfigLabel: PortalToolbarProps;
  showText: string;
  label: string;
  min: number;
  max: number;
  step: number;
};

export const RangeFilters = ({
  toolbarConfig,
  toolbarConfigLabel,
  showText,
  label,
  min,
  max,
  step
}: Props): ReactElement => {
  const customLabel = label.length
    ? label.replace("[min]", `${min}`).replace("[max]", `${max}`)
    : "$0 - 100$";

  const previewLabel = label.length
    ? label
        .replace("[min]", `<span class="brz-filters__range--min">${min}</span>`)
        .replace("[max]", `<span class="brz-filters__range--max">${max}</span>`)
    : "";

  return IS_EDITOR ? (
    <div className="brz-filters__option brz-filters__range">
      <Toolbar {...toolbarConfig}>
        <div className={"brz-filters__range--wrapper"}>
          <div className="brz-filters__range__slider">
            <div className="brz-filters__range__slider--active"></div>
          </div>
          <span className="brz-filters__range__slider-handle brz-filters__range__slider--start"></span>
          <span className="brz-filters__range__slider-handle brz-filters__range__slider--end"></span>
        </div>
      </Toolbar>
      {showText === "on" && (
        <Toolbar {...toolbarConfigLabel}>
          <span className="brz-filters__range__text">{customLabel}</span>
        </Toolbar>
      )}
    </div>
  ) : (
    <div
      className="brz-filters__option brz-filters__range"
      data-show-text={showText}
    >
      <div className="brz-filters__range__wrapper">
        <input
          type="range"
          id="brz-filters__range--input-left"
          className={"brz-filters__range--inputs"}
          min={min}
          max={max}
          step={step}
          value="25"
        />
        <input
          type="range"
          id="brz-filters__range--input-right"
          className={"brz-filters__range--inputs"}
          min={min}
          max={max}
          step={step}
          value="75"
        />

        <div className="brz-filters__range--slider">
          <div className="brz-filters__range--track"></div>
          <div className="brz-filters__range--range"></div>
          <div className="brz-filters__range--thumb brz-filters__range--thumb--left"></div>
          <div className="brz-filters__range--thumb brz-filters__range--thumb--right"></div>
        </div>
      </div>
      {showText === "on" && (
        <span className="brz-filters__range__text">{previewLabel}</span>
      )}
    </div>
  );
};
