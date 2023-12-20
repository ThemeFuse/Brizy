import classnames from "classnames";
import React, { PureComponent } from "react";
import { FontFamily } from "visual/component/Controls/FontFamily";
import { Select2 } from "visual/component/Controls/Select2";
import { Item } from "visual/component/Controls/Select2/Item";
import Stepper from "visual/component/Controls/Stepper";
import { Label } from "visual/component/Label";
import Config from "visual/global/Config";
import { SizeSuffix } from "visual/utils/fonts/SizeSuffix";
import { Weight } from "visual/utils/fonts/Weight";
import { isStory } from "visual/utils/models";
import { FontStyle } from "./FontStyle";
import { Icon } from "./TabIcon";
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
      className,
      icons,
      activeIcon,
      onIconClick
    } = this.props;

    const IS_STORY = isStory(Config.getAll());

    const typographyStyleClassName = classnames(
      "brz-ed-control__typography-styles",
      { "brz-ed-control__typography--tab-icon": icons }
    );

    const _className = classnames(
      "brz-ed-control__typography",
      {
        "brz-ed-control__typography--style-only": !showFontFamily,
        "brz-ed-control__typography--tabs-icon": icons
      },
      className
    );

    return (
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
        <div className={typographyStyleClassName}>
          <div className="brz-ed__col brz-ed__col-1-1">
            {icons?.length && !IS_STORY ? (
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
                />
              </>
            )}
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
            {IS_STORY ? (
              <Label title={sizeLabel}>{sizeLabel}</Label>
            ) : (
              <div className="brz-control__typography-suffix">
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
            />
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
            <Label title={weightLabel}>{weightLabel}</Label>
            <Select2<Weight>
              value={weight}
              onChange={this.onFontWeight}
              editable={false}
              size="auto"
            >
              {weights.map(({ value, title }) => (
                <Item key={value} value={value}>
                  {title}
                </Item>
              ))}
            </Select2>
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
            <Label title={lineHeightLabel}>{lineHeightLabel}</Label>
            <Stepper
              min={lineHeightMin}
              max={lineHeightMax}
              step={lineHeightStep}
              value={lineHeight}
              onChange={this.onLineHeight}
            />
          </div>
          <div className="brz-ed__col brz-ed__col-1-2">
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
    );
  }
}
