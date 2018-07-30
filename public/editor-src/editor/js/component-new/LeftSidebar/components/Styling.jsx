import React from "react";
import { connect } from "react-redux";
import Options from "visual/component-new/Options";
import { getColorPaletteColors } from "visual/utils/color";
import { getFontStyles } from "visual/utils/fonts";
import { updateGlobals } from "visual/redux/actionCreators";
import { t } from "visual/utils/i18n";

const currentSkin = "default";

class DrawerComponent extends React.Component {
  handleStylingChange = (key, value) => {
    const { styles, dispatch } = this.props;
    const newStyles = Object.assign({}, styles, { [key]: value });

    dispatch(updateGlobals("styles", { [currentSkin]: newStyles }));
  };

  handleFontAdd = font => {
    const { extraFonts, dispatch } = this.props;
    const newExtraFonts = [...extraFonts, font];
    const meta = { addedFont: font };

    dispatch(updateGlobals("extraFonts", newExtraFonts, meta));
  };

  render() {
    const options = [
      {
        id: "colorPalette",
        type: "colorPaletteEditor",
        attr: {
          className: "brz-ed-sidebar-option__color-palette-editor"
        },
        value: getColorPaletteColors(),
        onChange: value => this.handleStylingChange("colorPalette", value)
      },
      {
        id: "extraFonts",
        type: "fontAdder",
        label: t("Add New Google Font"),
        placeholder: t("Type font name"),
        onChange: this.handleFontAdd
      },
      {
        id: "fontStyles",
        type: "fontStyleEditor",
        value: getFontStyles(),
        onChange: value => this.handleStylingChange("fontStyles", value)
      }
    ];

    return (
      <div className="brz-ed-sidebar__styling">
        <Options className="brz-ed-sidebar-options" data={options} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  styles: state.styles,
  extraFonts: state.globals.project.extraFonts || []
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export const Styling = {
  id: "styling",
  icon: "nc-brush",
  drawerTitle: t("Styling"),
  drawerComponent: connect(mapStateToProps, mapDispatchToProps)(DrawerComponent)
};
