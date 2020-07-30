import React from "react";
import { connect } from "react-redux";
import Options from "visual/component/Options";
import { updateCurrentStyleId, updateCurrentStyle } from "visual/redux/actions";
import { updateExtraFontStyles } from "visual/redux/actions2";
import { currentStyleSelector, stylesSelector } from "visual/redux/selectors";
import { extraFontStylesSelector } from "visual/redux/selectors2";
import { t } from "visual/utils/i18n";
import { branding } from "visual/utils/branding";

class DrawerComponent extends React.Component {
  handleCurrentStyleIdChange = value => {
    this.props.dispatch(updateCurrentStyleId(value));
  };

  handleColorPaletteChange = value => {
    const { currentStyle, dispatch } = this.props;

    dispatch(updateCurrentStyle({ ...currentStyle, colorPalette: value }));
  };

  handleFontStylesChange = value => {
    const { currentStyle, extraFontStyles, dispatch } = this.props;
    const { fontStyles } = currentStyle;
    const mergedFontStyles = [...fontStyles, ...extraFontStyles];

    if (value.length > mergedFontStyles.length) {
      dispatch(
        updateExtraFontStyles(value.filter(fs => fs.deletable === "on"))
      );

      return;
    }

    for (const fs of value) {
      for (const fs2 of mergedFontStyles) {
        if (fs.id === fs2.id && fs !== fs2) {
          if (fs.deletable === "off") {
            dispatch(
              updateCurrentStyle({
                ...currentStyle,
                fontStyles: value.filter(fs => fs.deletable === "off")
              })
            );
          } else {
            dispatch(
              updateExtraFontStyles(value.filter(fs => fs.deletable === "on"))
            );
          }

          return;
        }
      }
    }
  };

  render() {
    const {
      styles,
      currentStyle: { id, colorPalette, fontStyles },
      extraFontStyles
    } = this.props;
    const stylesChoices = styles.map(style => ({
      title: branding(style.title),
      value: style.id
    }));

    const options = [
      {
        id: "currentStyle",
        label: "Current Style",
        type: "select",
        choices: stylesChoices,
        display: "block",
        value: id,
        onChange: this.handleCurrentStyleIdChange
      },
      {
        id: "colorPalette",
        type: "colorPaletteEditor",
        attr: {
          className: "brz-ed-sidebar-option__color-palette-editor"
        },
        value: colorPalette,
        onChange: this.handleColorPaletteChange
      },
      {
        id: "fontStyles",
        type: "fontStyleEditor",
        value: [...fontStyles, ...extraFontStyles],
        onChange: this.handleFontStylesChange
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
  styles: stylesSelector(state),
  currentStyle: currentStyleSelector(state),
  extraFontStyles: extraFontStylesSelector(state)
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
