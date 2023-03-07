import classNames from "classnames";
import React, { Component, SyntheticEvent } from "react";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPanel from "visual/component/ScrollPane";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import { FontList, FontObject, FontSizes, FontWithType, Props } from "./types";

const fontSizeMap: FontSizes = {
  default: "17px", // 16
  great_vibes: "18px", // 18
  alex_brush: "18px",
  allura: "18px",
  parisienne: "18px"
};

export class FontFamily extends Component<Props> {
  handleOpenFonts = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (this.props.addFont) {
      this.props.addFont();
    }
  };

  renderFontList({ fonts, type }: FontList) {
    const { value, onChange } = this.props;

    return fonts.map((font: FontObject) => {
      const { id, family, title } = font;

      const fontId = id as keyof FontSizes;
      const fontWithType: FontWithType = { ...font, type };

      const className = classNames("brz-ed-font__name", {
        active: id === value
      });
      const style = {
        fontFamily: family,
        fontSize: fontSizeMap[fontId] || fontSizeMap.default
      };

      return (
        <div
          key={id}
          className={className}
          style={style}
          onClick={() => onChange(fontWithType)}
        >
          {title}
        </div>
      );
    });
  }

  render() {
    const {
      config: configFonts = [],
      blocks: blocksFonts = [],
      google: googleFonts = [],
      upload: uploadFonts = []
    } = this.props.fonts;

    const needSeparator = uploadFonts.length > 0 || googleFonts.length > 0;
    const className = classNames(
      "brz-ed-font__typography",
      this.props.className
    );

    return (
      <div className={className}>
        <ScrollPanel
          className="brz-ed-scroll--dark brz-ed-scroll--small"
          style={{ height: "100%" }}
        >
          {uploadFonts.length > 0 &&
            this.renderFontList({
              fonts: uploadFonts,
              type: FontFamilyType.upload
            })}

          {googleFonts.length > 0 &&
            this.renderFontList({
              fonts: googleFonts,
              type: FontFamilyType.google
            })}

          {needSeparator && <hr className="brz-hr brz-ed-font__separator" />}

          {blocksFonts &&
            this.renderFontList({
              fonts: blocksFonts,
              type: FontFamilyType.google
            })}
          {this.renderFontList({
            fonts: configFonts,
            type: FontFamilyType.google
          })}
        </ScrollPanel>
        {this.props.addFont && (
          <div
            className="brz-ed-font__typography-adder"
            onClick={this.handleOpenFonts}
          >
            <EditorIcon icon="nc-add" />
            {this.props.addFontLabel}
          </div>
        )}
      </div>
    );
  }
}
