import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import { getUsedFontsDetails } from "visual/utils/fonts";

const fontSizeMap = {
  default: "17px", // 16
  great_vibes: "18px", // 18
  alex_brush: "18px",
  allura: "18px",
  parisienne: "18px"
};

class FontFamily extends React.Component {
  static defaultProps = {
    value: "lato"
  };

  handleFontClick = font => {
    this.props.onChange(font);
  };

  renderFontList = fonts => {
    const value = this.props.value;

    return _.map(fonts, font => {
      const { id, family, title } = font;
      const className = classnames("brz-ed-font__name", {
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
          onClick={() => this.handleFontClick(font)}
        >
          {title}
        </div>
      );
    });
  };

  render() {
    const { configFonts, extraFonts } = getUsedFontsDetails();

    return (
      <div className="brz-ed-font__typography">
        <ScrollPane
          className="brz-ed-scroll-pane brz-ed-scroll--dark brz-ed-scroll--small"
          style={{ height: "100%" }}
        >
          {this.renderFontList(extraFonts)}
          {extraFonts.length !== 0 ? (
            <hr className="brz-hr brz-ed-font__separator" />
          ) : null}
          {this.renderFontList(configFonts)}
        </ScrollPane>
      </div>
    );
  }
}

export default FontFamily;
