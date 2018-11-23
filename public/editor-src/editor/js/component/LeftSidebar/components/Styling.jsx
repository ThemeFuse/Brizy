import React from "react";
import { connect } from "react-redux";
import _ from "underscore";
import Editor from "visual/global/Editor";
import Options from "visual/component/Options";
import { updateGlobals } from "visual/redux/actionCreators";
import { currentStyleSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";

class DrawerComponent extends React.Component {
  handleCurrentStyleChange = value => {
    const { globalStyles, dispatch } = this.props;

    const newStyles = {
      ...globalStyles,
      _selected: value
    };

    dispatch(updateGlobals("styles", newStyles));
  };

  handleStylingChange = (key, value) => {
    const {
      styles: {
        id: currentStyleId,
        colorPalette: _colorPalette,
        fontStyles: _fontStyles,
        extraFontStyles: _extraFontStyles
      },
      globalStyles,
      dispatch
    } = this.props;
    let colorPalette;
    let fontStyles;
    let extraFontStyles;

    if (key === "colorPalette") {
      colorPalette = value;
      fontStyles = _fontStyles;
      extraFontStyles = _extraFontStyles;
    } else if (key === "fontStyles") {
      colorPalette = _colorPalette;
      [extraFontStyles, fontStyles] = _.partition(
        value,
        fs => fs.deletable === "on"
      );
    }

    const newStyles = {
      ...globalStyles,
      _selected: currentStyleId,
      _extraFontStyles: extraFontStyles,
      [currentStyleId]: {
        colorPalette,
        fontStyles
      }
    };

    dispatch(updateGlobals("styles", newStyles));
  };

  handleFontAdd = font => {
    const { extraFonts, dispatch } = this.props;
    const newExtraFonts = [...extraFonts, font];
    const meta = { addedFonts: [font] };

    dispatch(updateGlobals("extraFonts", newExtraFonts, meta));
  };

  render() {
    const {
      styles: { id: currentStyleId, colorPalette, mergedFontStyles }
    } = this.props;
    const currentStyleChoices = Editor.getStyles().map(style => ({
      title: style.title,
      value: style.id
    }));

    const options = [
      {
        id: "currentStyle",
        label: "Current Style",
        type: "select",
        choices: currentStyleChoices,
        value: currentStyleId,
        display: "block",
        onChange: this.handleCurrentStyleChange
      },
      {
        id: "colorPalette",
        type: "colorPaletteEditor",
        attr: {
          className: "brz-ed-sidebar-option__color-palette-editor"
        },
        value: colorPalette,
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
        value: mergedFontStyles,
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
  styles: currentStyleSelector(state),
  globalStyles: state.globals.project.styles || {},
  extraFonts: state.globals.project.extraFonts || []
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export const Styling = {
  id: "styling",
  icon: "nc-brush",
  drawerTitle: t("Styling"),
  drawerComponent: connect(
    mapStateToProps,
    mapDispatchToProps
  )(DrawerComponent)
};
