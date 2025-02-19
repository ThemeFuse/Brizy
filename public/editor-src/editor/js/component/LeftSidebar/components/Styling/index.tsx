import { isEqual } from "es-toolkit";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { LabelWithButton } from "visual/component/Controls/LeftSidebar/Styling/LabelWithButton";
import { ToastNotification } from "visual/component/Notifications";
import Options from "visual/component/Options";
import { OnChangeActionTypes } from "visual/component/Options/types/dev/EditableSelect/types";
import { getConfigById } from "visual/global/Config/InitConfig";
import {
  ConfigCommon,
  LeftSidebarOptionsIds
} from "visual/global/Config/types/configs/ConfigCommon";
import {
  addNewGlobalStyle,
  editGlobalStyleName,
  getRegenerateColors,
  getRegenerateTypography,
  removeGlobalStyle,
  updateCurrentStyle,
  updateCurrentStyleId,
  updateExtraFontStyles
} from "visual/redux/actions2";
import {
  REGENERATED_STYLE_TITLE,
  REGENERATED_STYLE_UID
} from "visual/redux/reducers/currentStyleId";
import {
  configIdSelector,
  currentStyleSelector,
  extraFontStylesSelector,
  extraStylesSelector,
  stylesSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { ExtraFontStyle, FontStyles, Palette, Style } from "visual/types/Style";
import { isExtraFontStyle } from "visual/types/utils";
import { getGlobalColors } from "visual/utils/api";
import { getGlobalTypography } from "visual/utils/api/common";
import { brizyToBranding } from "visual/utils/branding";
import { t } from "visual/utils/i18n";
import { uuid } from "visual/utils/uuid";

interface StateProps {
  styles: Style[];
  currentStyle: ReduxState["currentStyle"];
  extraFontStyles: ExtraFontStyle[];
  extraStyles: Style[];
  config: ConfigCommon;
}

interface DispatchProps {
  dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

interface State {
  loadingColor: boolean;
  loadingTypography: boolean;
}

class DrawerComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingColor: false,
      loadingTypography: false
    };
  }

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
        const newStyle = {
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

  getRegeneratedStyle = (styles: Style[]): Style => {
    return (
      styles.find((style) => style.id === REGENERATED_STYLE_UID) || {
        ...styles[0],
        id: REGENERATED_STYLE_UID,
        title: REGENERATED_STYLE_TITLE
      }
    );
  };

  handleRegenerateColors = async () => {
    try {
      this.setState({ loadingColor: true });
      const { dispatch, styles, config } = this.props;

      const colorPalette = await getGlobalColors(config);

      const style = this.getRegeneratedStyle(styles);

      this.setState({ loadingColor: false });

      dispatch(getRegenerateColors({ ...style, colorPalette }));
    } catch (e) {
      this.setState({ loadingColor: false });
      ToastNotification.error(t("Missing regenerate methods in config.api"));
    }
  };

  handleRegenerateTypography = async () => {
    try {
      this.setState({ loadingTypography: true });
      const { dispatch, styles, config } = this.props;

      const fontStyles = await getGlobalTypography(config);

      const style = this.getRegeneratedStyle(styles);

      this.setState({ loadingTypography: false });

      dispatch(getRegenerateTypography({ ...style, fontStyles }));
    } catch (e) {
      this.setState({ loadingTypography: false });
      ToastNotification.error(t("Missing regenerate methods in config.api"));
    }
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
          if (isEqual(fs, fs2)) {
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

  labelWithButton = (
    label: string,
    onClick: VoidFunction,
    loading: boolean
  ): JSX.Element => (
    <LabelWithButton
      label={label}
      loading={loading}
      onClick={onClick}
      tooltip={
        this.props.config?.ui?.leftSidebar?.styles?.label ?? t("Regenerate")
      }
    />
  );

  render() {
    const {
      styles,
      extraStyles,
      currentStyle: { id, colorPalette, fontStyles },
      extraFontStyles,
      config
    } = this.props;

    const { loadingTypography, loadingColor } = this.state;
    const stylesChoices = styles.map((style) => ({
      title: brizyToBranding(style.title, config),
      value: style.id,
      allowRemove: false,
      allowEdit: false,
      allowDuplicate: true
    }));
    const extraChoices = extraStyles.map((style) => ({
      title: brizyToBranding(style.title, config),
      value: style.id,
      allowRemove: true,
      allowEdit: true,
      allowDuplicate: true
    }));

    const finalChoices = [...stylesChoices, ...extraChoices];

    const showColorsRegenerate: boolean =
      typeof config?.ui?.leftSidebar?.styles?.regenerateColors === "function";
    const showTypographyRegenerate: boolean =
      typeof config?.ui?.leftSidebar?.styles?.regenerateTypography ===
      "function";

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
        type: "colorPaletteEditor",
        attr: {
          className: "brz-ed-sidebar-option__color-palette-editor"
        },
        label: showColorsRegenerate
          ? this.labelWithButton(
              t("COLORS"),
              this.handleRegenerateColors,
              loadingColor
            )
          : undefined,
        value: colorPalette,
        onChange: this.handleColorPaletteChange
      },
      {
        id: "fontStyles",
        type: "fontStyleEditor",
        className: "brz-ed-sidebar-option__font-style-editor",
        value: { extraFontStyles, fontStyles },
        label: showTypographyRegenerate
          ? this.labelWithButton(
              t("TYPOGRAPHY"),
              this.handleRegenerateTypography,
              loadingTypography
            )
          : undefined,
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
  extraFontStyles: extraFontStylesSelector(state),
  config: getConfigById(configIdSelector(state))
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
