import classnames from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import Prompts from "visual/component/Prompts";
import { Roles } from "visual/component/Roles";
import { Scrollbar } from "visual/component/Scrollbar";
import { projectSelector } from "visual/redux/selectors";
import { unDeletedFontsSelector } from "visual/redux/selectors-new";
import { fontTransform } from "visual/utils/fonts";
import { scrollToActiveFont } from "visual/utils/fonts/scrollHelpers";
import { t } from "visual/utils/i18n";

const fontSizeMap = {
  default: "17px", // 16
  great_vibes: "18px", // 18
  alex_brush: "18px",
  allura: "18px",
  parisienne: "18px"
};

class FontFamily extends Component {
  static defaultProps = {
    defaultFont: "",
    value: "lato",
    fonts: {},
    onChange: _.noop
  };

  constructor(props) {
    super(props);
    this.scrollbarRef = React.createRef();
  }

  componentDidMount() {
    scrollToActiveFont(this.scrollbarRef);
  }

  checkCurrentFont() {
    const { fonts, value } = this.props;

    return Object.entries(fonts).some((item) => {
      const [type, fonts] = item;

      return fonts.data.some((font) => fontTransform[type](font).id === value);
    });
  }

  handleOpenFonts = (event) => {
    event.preventDefault();

    Prompts.open({
      prompt: "fonts",
      mode: "single"
    });
  };

  renderFontList(fonts, type, existedFonts) {
    const { value, defaultFont, onChange } = this.props;

    return fonts.map((font) => {
      const normalizeFont = fontTransform[type](font);
      const { id, family, title } = normalizeFont;
      const className = classnames("brz-ed-font__name", {
        active: existedFonts ? id === value : id === defaultFont
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
          onClick={() => onChange({ ...normalizeFont, type })}
        >
          {title}
        </div>
      );
    });
  }

  render() {
    const {
      config: configFonts = {},
      blocks: blocksFonts = {},
      google: googleFonts = {},
      upload: uploadFonts = {}
    } = this.props.fonts;
    const existedFonts = this.checkCurrentFont();
    const needSeparator =
      (uploadFonts.data && uploadFonts.data.length > 0) ||
      (googleFonts.data && googleFonts.data.length > 0);

    return (
      <div className="brz-ed-font__typography">
        <Scrollbar theme="dark" ref={this.scrollbarRef}>
          {uploadFonts.data &&
            uploadFonts.data.length > 0 &&
            this.renderFontList(uploadFonts.data, "upload", existedFonts)}

          {googleFonts.data &&
            googleFonts.data.length > 0 &&
            this.renderFontList(googleFonts.data, "google", existedFonts)}

          {needSeparator && <hr className="brz-hr brz-ed-font__separator" />}

          {blocksFonts.data &&
            this.renderFontList(blocksFonts.data, "google", existedFonts)}
          {this.renderFontList(configFonts.data, "google", existedFonts)}
        </Scrollbar>
        <Roles allow={["admin"]}>
          <div
            className="brz-ed-font__typography-adder"
            onClick={this.handleOpenFonts}
          >
            <EditorIcon icon="nc-add" />
            {t("Add New Font")}
          </div>
        </Roles>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fonts: unDeletedFontsSelector(state),
  defaultFont: projectSelector(state).data.font
});

export default connect(mapStateToProps, null)(FontFamily);
