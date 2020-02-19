import React, { Component } from "react";
import T from "prop-types";
import classNames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

const fontSizeMap = {
  default: "17px", // 16
  great_vibes: "18px", // 18
  alex_brush: "18px",
  allura: "18px",
  parisienne: "18px"
};

export class FontFamily extends Component {
  checkCurrentFont() {
    const { fonts, value } = this.props;

    return Object.entries(fonts).some(fontList =>
      fontList.some(font => font.id === value)
    );
  }

  handleOpenFonts = event => {
    event.preventDefault();

    this.props.addFont();
  };

  renderFontList(fonts, type) {
    const { value, onChange } = this.props;

    return fonts.map(font => {
      const { id, family, title } = font;
      const className = classNames("brz-ed-font__name", {
        active: id === value
      });
      const style = {
        fontFamily: family,
        fontSize: fontSizeMap[id] || fontSizeMap.default
      };

      return (
        <div
          key={id}
          className={className}
          style={style}
          onClick={() => onChange({ ...font, type })}
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
    const existedFonts = this.checkCurrentFont();
    const needSeparator = uploadFonts.length > 0 || googleFonts.length > 0;
    const className = classNames(
      "brz-ed-font__typography",
      this.props.className
    );

    return (
      <div className={className}>
        <ScrollPane
          className="brz-ed-scroll--dark brz-ed-scroll--small"
          style={{ height: "100%" }}
        >
          {uploadFonts.length > 0 &&
            this.renderFontList(uploadFonts, "upload", existedFonts)}

          {googleFonts.length > 0 &&
            this.renderFontList(googleFonts, "google", existedFonts)}

          {needSeparator && <hr className="brz-hr brz-ed-font__separator" />}

          {blocksFonts &&
            this.renderFontList(blocksFonts, "google", existedFonts)}
          {this.renderFontList(configFonts, "google", existedFonts)}
        </ScrollPane>
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

const FontType = T.shape({
  id: T.string,
  family: T.string,
  title: T.string,
  size: T.string
});

FontFamily.propTypes = {
  className: T.string,
  addFont: T.func,
  addFontLabel: T.string,
  fonts: T.shape({
    config: T.arrayOf(FontType),
    blocks: T.arrayOf(FontType),
    google: T.arrayOf(FontType),
    upload: T.arrayOf(FontType)
  }).isRequired,
  value: T.string.isRequired,
  onChange: T.func.isRequired
};

FontFamily.defaultProps = {
  className: "",
  addFontLabel: t("Add New Font")
};
