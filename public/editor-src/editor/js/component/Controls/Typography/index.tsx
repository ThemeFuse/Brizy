import classnames from "classnames";
import React, { PureComponent } from "react";
import { FontFamily } from "visual/component/Controls/FontFamily";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import Stepper from "visual/component/Controls/Stepper";
import { Label } from "visual/component/Label";
import { WithValue } from "visual/types/attributes";
import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { FontStyle } from "./Components/FontStyle";
import { FontTransform } from "./Components/FontTransform";
import { FontWeight } from "./Components/FontWeight";
import { Icon } from "./Components/TabIcon";
import { Font } from "./types/FontFamily";
import { TypographyProps as Props } from "./types/Props";
import { Value } from "./types/Value";

export class Typography extends PureComponent<Props> {
  onFontFamily = (v: Font): void =>
    this.props.onChange(v, { isChanged: "fontFamily" });

  onFontStyle = (v: Value["fontStyle"]): void =>
    this.props.onChange(v, { isChanged: "fontStyle" });

  onFontSize = (v: Value["fontSize"]): void =>
    this.props.onChange(v, { isChanged: "fontSize" });

  onFontSizeSuffix = (v: Value["fontSizeSuffix"]): void =>
    this.props.onChange(v, { isChanged: "fontSizeSuffix" });

  onFontWeight = (v: Value["fontWeight"]): void =>
    this.props.onChange(v, { isChanged: "fontWeight" });

  onLineHeight = (v: Value["lineHeight"]): void =>
    this.props.onChange(v, { isChanged: "lineHeight" });

  onLetterSpacing = (v: Value["letterSpacing"]): void =>
    this.props.onChange(v, { isChanged: "letterSpacing" });

  onVariableWeight = (v: Value["variableFontWeight"]): void =>
    this.props.onChange(v, { isChanged: "variableFontWeight" });

  onFontWidth = (v: Value["fontWidth"]): void =>
    this.props.onChange(v, { isChanged: "fontWidth" });

  onSoftness = (v: Value["fontSoftness"]): void =>
    this.props.onChange(v, { isChanged: "fontSoftness" });

  onBold = (v: Value["bold"]): void =>
    this.props.onChange(v, { isChanged: "bold" });

  onItalic = (v: Value["italic"]): void =>
    this.props.onChange(v, { isChanged: "italic" });

  onUnderline = (v: Value["underline"]): void =>
    this.props.onChange(v, { isChanged: "underline" });

  onStrike = (v: Value["strike"]): void =>
    this.props.onChange(v, { isChanged: "strike" });

  onUppercase = (v: Value["uppercase"]): void =>
    this.props.onChange(v, { isChanged: "uppercase" });

  onLowercase = (v: Value["lowercase"]): void =>
    this.props.onChange(v, { isChanged: "lowercase" });

  onScript = ({ value }: WithValue<Value["script"]>): void => {
    this.props.onChange(value, { isChanged: "script" });
  };

  render() {
    const {
      font,
      fonts,
      fontAdd,
      fontAddLabel,
      showFontFamily,
      styleLabel,
      style,
      styles,
      styleOpenSettings,
      sizeLabel,
      sizeSuffix,
      sizeSuffixes,
      sizeMin,
      sizeMax,
      sizeStep,
      size,
      weight,
      weights,
      weightLabel,
      lineHeight,
      lineHeightMax,
      lineHeightMin,
      lineHeightStep,
      lineHeightLabel,
      letterSpacing,
      letterSpacingMax,
      letterSpacingMin,
      letterSpacingStep,
      letterSpacingLabel,
      variableFontWeight,
      fontWidth,
      fontSoftness,
      bold,
      italic,
      underline,
      strike,
      uppercase,
      lowercase,
      script,
      scriptChoices,
      className,
      icons,
      activeIcon,
      variations,
      showTextTransform,
      onIconClick,
      showFontSize,
      showFontStyles,
      isFontStyleSettingsDisabled,
      label,
      disabledFields
    } = this.props;

    const typographyStyleClassName = classnames(
      "brz-ed-control__typography-styles",
      { "brz-ed-control__typography--tab-icon": icons }
    );

    const _className = classnames(
      "brz-ed-control__typography",
      {
        "brz-ed-control__typography--style-only": !showFontFamily,
        "brz-ed-control__typography--tabs-icon": icons,
        "brz-ed-control__typography--lg": showTextTransform
      },
      className
    );

    const fontSizeLabelClassName = classnames({
      "brz-ed-control__typography--disabled-field":
        disabledFields?.includes("fontSize")
    });

    const fontSizeSuffixClassName = classnames(
      "brz-control__typography-suffix",
      {
        "brz-ed-control__typography--disabled-field":
          disabledFields?.includes("fontSizeSuffix")
      }
    );

    const stepperFontSizeClassName = classnames({
      "brz-ed-control__typography--disabled-field":
        disabledFields?.includes("fontSize")
    });

    const fontWeightClassName = classnames({
      "brz-ed-control__typography--disabled-field":
        disabledFields?.includes("fontWeight")
    });

    const lineHeightClassName = classnames(
      "brz-ed__col brz-ed__col-1-2 brz-ed-control__typography-line-height",
      {
        "brz-ed-control__typography--disabled-field":
          disabledFields?.includes("lineHeight")
      }
    );

    const letterSpacingClassName = classnames(
      "brz-ed__col brz-ed__col-1-2 brz-ed-control__typography-letter-spacing",
      {
        "brz-ed-control__typography--disabled-field":
          disabledFields?.includes("letterSpacing")
      }
    );

    return (
      <>
        {label}
        <div className={_className}>
          {showFontFamily && (
            <FontFamily
              onChange={this.onFontFamily}
              value={font}
              fonts={fonts}
              addFont={fontAdd}
              addFontLabel={fontAddLabel}
            />
          )}

          {showTextTransform && (
            <FontTransform
              onBoldChange={this.onBold}
              onItalicChange={this.onItalic}
              onUppercaseChange={this.onUppercase}
              onUnderlineChange={this.onUnderline}
              onLowercaseChange={this.onLowercase}
              onStrikeChange={this.onStrike}
              onScriptChange={this.onScript}
              script={script}
              scriptChoices={scriptChoices}
              bold={bold}
              italic={italic}
              underline={underline}
              strike={strike}
              uppercase={uppercase}
              lowercase={lowercase}
              disabledFields={disabledFields}
            />
          )}

          <div className={typographyStyleClassName}>
            <div className="brz-ed__col brz-ed__col-1-1">
              {icons?.length && showFontStyles ? (
                <div className="brz-ed-control__typography-styles_icon">
                  {icons?.map((icon, index) => (
                    <Icon
                      key={index}
                      icon={icon}
                      active={icon === activeIcon}
                      onClick={onIconClick}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <Label title={styleLabel}>{styleLabel}</Label>
                  <FontStyle
                    styles={styles}
                    openSettings={styleOpenSettings}
                    onChange={this.onFontStyle}
                    value={style}
                    disabled={disabledFields?.includes("fontStyle")}
                    isFontStyleSettingsDisabled={isFontStyleSettingsDisabled}
                  />
                </>
              )}
            </div>
            <div className="brz-ed__col brz-ed__col-1-2 brz-ed-control__typography-size">
              {showFontSize ? (
                <Label title={sizeLabel} className={fontSizeLabelClassName}>
                  {sizeLabel}
                </Label>
              ) : (
                <div className={fontSizeSuffixClassName}>
                  <Label title={sizeLabel}>{sizeLabel}</Label>
                  <Select2<SizeSuffix>
                    value={sizeSuffix}
                    onChange={this.onFontSizeSuffix}
                    editable={false}
                    size="short"
                  >
                    {sizeSuffixes.map(({ value, title }) => (
                      <Item<SizeSuffix> key={value} value={value}>
                        {title}
                      </Item>
                    ))}
                  </Select2>
                </div>
              )}
              <Stepper
                min={sizeMin}
                max={sizeMax}
                step={sizeStep}
                value={size}
                onChange={this.onFontSize}
                className={stepperFontSizeClassName}
              />
            </div>
            <FontWeight
              label={weightLabel}
              weight={weight}
              variableFontWeight={variableFontWeight}
              fontWidth={fontWidth}
              fontSoftness={fontSoftness}
              onFontWeightChange={this.onFontWeight}
              onVariableFontWeightChange={this.onVariableWeight}
              onFontWidthChange={this.onFontWidth}
              onSoftnessChange={this.onSoftness}
              variations={variations}
              weights={weights}
              className={fontWeightClassName}
            />
            <div className={lineHeightClassName}>
              <Label title={lineHeightLabel}>{lineHeightLabel}</Label>
              <Stepper
                min={lineHeightMin}
                max={lineHeightMax}
                step={lineHeightStep}
                value={lineHeight}
                onChange={this.onLineHeight}
              />
            </div>
            <div className={letterSpacingClassName}>
              <Label title={letterSpacingLabel}>{letterSpacingLabel}</Label>
              <Stepper
                min={letterSpacingMin}
                max={letterSpacingMax}
                step={letterSpacingStep}
                value={letterSpacing}
                onChange={this.onLetterSpacing}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
