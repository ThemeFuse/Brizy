import React, { PureComponent } from "react";
import T from "prop-types";
import classNames from "classnames";
import { t } from "visual/utils/i18n";
import Select from "visual/component/Controls/Select";
import Stepper from "visual/component/Controls/Stepper";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { FontStyle } from "./FontStyle";
import { Label } from "visual/component/Label";
import { FontFamily } from "visual/component/Controls/FontFamily";
import { IS_STORY } from "visual/utils/models";

export class Typography extends PureComponent {
  onFontFamily = v => this.props.onChange(v, { isChanged: "fontFamily" });
  onFontStyle = v => this.props.onChange(v, { isChanged: "fontStyle" });
  onFontSize = v => this.props.onChange(v, { isChanged: "fontSize" });
  onFontSizeSuffix = v =>
    this.props.onChange(v, { isChanged: "fontSizeSuffix" });
  onFontWeight = v => this.props.onChange(v, { isChanged: "fontWeight" });
  onLineHeight = v => this.props.onChange(v, { isChanged: "lineHeight" });
  onLetterSpacing = v => this.props.onChange(v, { isChanged: "letterSpacing" });

  render() {
    const props = this.props;

    const _className = classNames(
      "brz-ed-control__typography",
      props.className
    );

    return (
      <div className={_className}>
        {props.fontFamily && (
          <FontFamily
            onChange={this.onFontFamily}
            value={props.font}
            fonts={props.fonts}
            addFont={props.fontAdd}
            addFontLabel={props.fontAddLabel}
          />
        )}
        <div className="brz-ed-control__typography-styles">
          <div className="brz-ed__col brz-ed__col-1-1">
            <Label>{props.styleLabel}</Label>
            <FontStyle
              styles={props.styles}
              openSettings={props.styleOpenSettings}
              onChange={this.onFontStyle}
              value={props.style}
            />
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
            {IS_STORY ? (
              <Label>{props.sizeLabel}</Label>
            ) : (
              <div className="brz-control__typography-suffix">
                <Label>{props.sizeLabel}</Label>
                <Select
                  className="brz-control__select--dark"
                  defaultValue={props.sizeSuffix}
                  itemHeight={30}
                  onChange={this.onFontSizeSuffix}
                >
                  {props.sizeSuffixes.map(({ value, title }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      title={title}
                      active={value === props.sizeSuffix}
                    >
                      {title}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
            <Stepper
              min={props.sizeMin}
              max={props.sizeMax}
              step={props.sizeStep}
              value={props.size}
              onChange={this.onFontSize}
            />
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
            <Label>{props.weightLabel}</Label>
            <Select
              className="brz-control__select--dark"
              defaultValue={props.weight}
              itemHeight={30}
              onChange={this.onFontWeight}
            >
              {props.weights.map(({ value, title }) => (
                <SelectItem
                  key={value}
                  value={value}
                  title={title}
                  active={value === props.weight}
                >
                  {title}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
            <Label>{props.lineHeightLabel}</Label>
            <Stepper
              min={props.lineHeightMin}
              max={props.lineHeightMax}
              step={props.lineHeightStep}
              value={props.lineHeight}
              onChange={this.onLineHeight}
            />
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
            <Label>{props.letterSpacingLabel}</Label>
            <Stepper
              min={props.letterSpacingMin}
              max={props.letterSpacingMax}
              step={props.letterSpacingStep}
              value={props.letterSpacing}
              onChange={this.onLetterSpacing}
            />
          </div>
        </div>
      </div>
    );
  }
}

Typography.propTypes = {
  className: T.string,
  onChange: T.func.isRequired,
  fontFamily: T.bool,
  fonts: FontFamily.propTypes.fonts,
  font: T.string.isRequired,
  fontAdd: FontFamily.propTypes.addFont,
  fontAddLabel: FontFamily.propTypes.addFontLabel,
  styles: FontStyle.propTypes.styles,
  style: T.string.isRequired,
  styleLabel: FontStyle.propTypes.label,
  styleOpenSettings: FontStyle.propTypes.openSettings,
  size: T.number.isRequired,
  sizeSuffix: T.string.isRequired,
  sizeMin: T.number,
  sizeMax: T.number,
  sizeStep: T.number,
  sizeLabel: T.string,
  weights: T.arrayOf(
    T.shape({
      value: T.number,
      title: T.string
    })
  ).isRequired,
  weight: T.number.isRequired,
  weightLabel: T.string,
  lineHeight: T.number.isRequired,
  lineHeightMin: T.number,
  lineHeightMax: T.number,
  lineHeightStep: T.number,
  lineHeightLabel: T.string,
  letterSpacing: T.number.isRequired,
  letterSpacingMin: T.number,
  letterSpacingMax: T.number,
  letterSpacingStep: T.number,
  letterSpacingLabel: T.string
};

Typography.defaultProps = {
  className: "",
  styleLabel: t("Typography"),
  sizeLabel: t("Size"),
  weightLabel: t("Weight"),
  lineHeightLabel: t("Line Hgt."),
  letterSpacingLabel: t("Letter Sp."),
  fontFamily: true,
  sizeMin: 0,
  sizeMax: 100,
  sizeStep: 1,
  lineHeightMin: 1,
  lineHeightMax: 10,
  lineHeightStep: 0.1,
  letterSpacingMin: -20,
  letterSpacingMax: 20,
  letterSpacingStep: 0.5
};
