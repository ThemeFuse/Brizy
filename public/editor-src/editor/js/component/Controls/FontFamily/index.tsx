import classNames from "classnames";
import React, { Component, SyntheticEvent } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import {
  ScrollbarType,
  scrollToActiveFont
} from "visual/utils/fonts/scrollHelpers";
import { FONT_INITIAL } from "visual/utils/fonts/utils";
import { t } from "visual/utils/i18n";
import { FontList, FontObject, FontSizes, FontWithType, Props } from "./types";

const fontSizeMap: FontSizes = {
  default: "17px", // 16
  great_vibes: "18px", // 18
  alex_brush: "18px",
  allura: "18px",
  parisienne: "18px"
};

const systemFont = [
  {
    id: FONT_INITIAL,
    family: FONT_INITIAL,
    title: t("Default system font"),
    weights: [400]
  }
];

export class FontFamily extends Component<Props> {
  scrollbarRef: React.RefObject<ScrollbarType>;

  handleOpenFonts = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (this.props.addFont) {
      this.props.addFont();
    }
  };

  constructor(props: Props) {
    super(props);
    this.scrollbarRef = React.createRef();
  }

  componentDidMount(): void {
    scrollToActiveFont(this.scrollbarRef);
  }

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
      upload: uploadFonts = [],
      system: systemFonts = systemFont
    } = this.props.fonts;

    const needSeparator = uploadFonts.length > 0 || googleFonts.length > 0;
    const className = classNames(
      "brz-ed-font__typography",
      this.props.className
    );

    return (
      <div className={className}>
        <Scrollbar theme="dark" ref={this.scrollbarRef}>
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
            fonts: systemFonts,
            type: FontFamilyType.system
          })}
          {this.renderFontList({
            fonts: configFonts,
            type: FontFamilyType.google
          })}
        </Scrollbar>
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
