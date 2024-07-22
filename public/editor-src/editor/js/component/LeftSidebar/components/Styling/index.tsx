import { fromJS } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import Options from "visual/component/Options";
import { OnChangeActionTypes } from "visual/component/Options/types/dev/EditableSelect/types";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import {
  addNewGlobalStyle,
  editGlobalStyleName,
  removeGlobalStyle,
  updateCurrentStyle,
  updateCurrentStyleId,
  updateExtraFontStyles
} from "visual/redux/actions2";
import {
  currentStyleSelector,
  extraFontStylesSelector,
  extraStylesSelector,
  stylesSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import {
  ExtraFontStyle,
  FontStyles,
  Palette,
  Style,
  isExtraFontStyle
} from "visual/types";
import { brizyToBranding } from "visual/utils/branding";
import { t } from "visual/utils/i18n";
import { uuid } from "visual/utils/uuid";

interface StateProps {
  styles: Style[];
  currentStyle: ReduxState["currentStyle"];
  extraFontStyles: ExtraFontStyle[];
  extraStyles: Style[];
}

interface DispatchProps {
  dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

class DrawerComponent extends React.Component<Props> {
  handleCurrentStyleChange = ({
    type,
    payload
  }: {
    type: string;
    payload: string;
  }) => {
    const { dispatch } = this.props;

    switch (type) {
      case OnChangeActionTypes.duplicate: {
        const newStyle: Style = {
          ...this.props.currentStyle,
          id: uuid(),
          title: payload
        };

        dispatch(addNewGlobalStyle(newStyle));
        break;
      }
      case OnChangeActionTypes.remove: {
        dispatch(removeGlobalStyle(payload));
        break;
      }
      case OnChangeActionTypes.edit: {
        dispatch(editGlobalStyleName(payload));
        break;
      }
      case OnChangeActionTypes.change: {
        dispatch(updateCurrentStyleId(payload));
        break;
      }
    }
  };

  handleColorPaletteChange = (value: Palette[]) => {
    const { currentStyle, dispatch } = this.props;

    dispatch(updateCurrentStyle({ ...currentStyle, colorPalette: value }));
  };

  handleFontStylesChange = (value: FontStyles[]) => {
    const { currentStyle, extraFontStyles, dispatch } = this.props;
    const { fontStyles } = currentStyle;
    const mergedFontStyles = [...fontStyles, ...extraFontStyles];

    if (value.length > mergedFontStyles.length) {
      const extraFontStyles = value.filter(isExtraFontStyle);
      dispatch(updateExtraFontStyles(extraFontStyles));

      return;
    }

    for (const fs of value) {
      for (const fs2 of mergedFontStyles) {
        if (fs.id === fs2.id) {
          const _fs = fromJS(fs);
          const _fs2 = fromJS(fs2);

          if (_fs.equals(_fs2)) {
            continue;
          }

          if (fs.deletable === "off") {
            dispatch(
              updateCurrentStyle({
                ...currentStyle,
                fontStyles: value.filter((fs) => fs.deletable === "off")
              })
            );
          } else {
            const extraFontStyles = value.filter(isExtraFontStyle);
            dispatch(updateExtraFontStyles(extraFontStyles));
          }
        }
      }
    }
  };

  render() {
    const {
      styles,
      extraStyles,
      currentStyle: { id, colorPalette, fontStyles },
      extraFontStyles
    } = this.props;
    const stylesChoices = styles.map((style) => ({
      title: brizyToBranding(style.title),
      value: style.id,
      allowRemove: false,
      allowEdit: false,
      allowDuplicate: true
    }));
    const extraChoices = extraStyles.map((style) => ({
      title: brizyToBranding(style.title),
      value: style.id,
      allowRemove: true,
      allowEdit: true,
      allowDuplicate: true
    }));

    const finalChoices = [...stylesChoices, ...extraChoices];

    const options = [
      {
        id: "currentStyle",
        label: t("Current Style"),
        type: "editableSelect",
        devices: "desktop",
        display: "block",
        choices: finalChoices,
        value: { value: id },
        onChange: this.handleCurrentStyleChange
      },
      {
        id: "colorPalette",
        type: "legacy-colorPaletteEditor",
        attr: {
          className: "brz-ed-sidebar-option__color-palette-editor"
        },
        value: colorPalette,
        onChange: this.handleColorPaletteChange
      },
      {
        id: "fontStyles",
        type: "legacy-fontStyleEditor",
        value: { extraFontStyles, fontStyles },
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

const mapStateToProps = (state: ReduxState): StateProps => ({
  styles: stylesSelector(state),
  extraStyles: extraStylesSelector(state),
  currentStyle: currentStyleSelector(state),
  extraFontStyles: extraFontStylesSelector(state)
});
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  dispatch
});

export const Styling = {
  id: LeftSidebarOptionsIds.globalStyle,
  type: "drawer",
  icon: "nc-brush",
  drawerTitle: t("Styling"),
  drawerComponent: connect(mapStateToProps, mapDispatchToProps)(DrawerComponent)
};
