import classNames from "classnames";
import React, { Component, SyntheticEvent } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar } from "visual/component/Scrollbar";
import { FontFamilyType } from "visual/types/Fonts";
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

const getSystemFont = () => [
  {
    id: FONT_INITIAL,
    family: FONT_INITIAL,
    title: t("Default system font"),
    weights: [400]
  }
];

export class FontFamily extends Component<Props> {
  scrollbarRef: React.RefObject<ScrollbarType>;

  constructor(props: Props) {
    super(props);
    this.scrollbarRef = React.createRef();
  }

  handleOpenFonts = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (this.props.addFont) {
      this.props.addFont();
    }
  };

  componentDidMount(): void {
    scrollToActiveFont(this.scrollbarRef);
  }

  renderFontList({ fonts, type }: FontList) {
    const { value, onChange } = this.props;

    return fonts.map((font: FontObject) => {
      const { id, family, title, variations } = font;

      const fontId = id as keyof FontSizes;
      const fontWithType: FontWithType = { ...font, type };

      const isActive = id === value;
      const className = classNames("brz-ed-font__name", {
        active: isActive
      });
      const style = {
        fontFamily: family,
        fontSize: fontSizeMap[fontId] || fontSizeMap.default
      };

      const needVariableBadge = variations?.length;
      return (
        <div
          key={id}
          className={className}
          style={style}
          onClick={() => onChange(fontWithType)}
        >
          {title}
          {needVariableBadge && (
            <span className="brz-ed-font-variable-badge" title={t("VARIABLE")}>
              {t("VARIABLE")}
            </span>
          )}
        </div>
      );
    });
  }

  render() {
    const {
      fonts: { normalFonts, variableFonts }
    } = this.props;

    const {
      config: configFonts = [],
      blocks: blocksFonts = [],
      google: googleFonts = [],
      upload: uploadFonts = [],
      adobe: adobeFonts = [],
      system: systemFonts = getSystemFont()
    } = normalFonts;

    const needSeparator =
      uploadFonts.length > 0 || googleFonts.length > 0 || adobeFonts.length > 0;

    const needSeparatorForVariable = variableFonts.length > 0;

    const className = classNames(
      "brz-ed-font__typography",
      this.props.className
    );

    return (
      <div className={className}>
        <Scrollbar theme="dark" ref={this.scrollbarRef}>
          {variableFonts.length > 0 &&
            this.renderFontList({
              fonts: variableFonts,
              type: FontFamilyType.upload
            })}

          {needSeparatorForVariable && (
            <hr className="brz-hr brz-ed-font__separator" />
          )}

          {adobeFonts.length > 0 &&
            this.renderFontList({
              fonts: adobeFonts,
              type: FontFamilyType.adobe
            })}

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
