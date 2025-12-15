import { isEqual } from "es-toolkit";
import React, { JSX } from "react";
import { ConnectedProps, connect } from "react-redux";
import { LabelWithButton } from "visual/component/Controls/LeftSidebar/Styling/LabelWithButton";
import { ToastNotification } from "visual/component/Notifications";
import Options from "visual/component/Options";
import { OnChangeActionTypes } from "visual/component/Options/types/dev/EditableSelect/types";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
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
  currentStyleSelector,
  extraFontStylesSelector,
  extraStylesSelector,
  stylesSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { FontStyles, Palette, Style } from "visual/types/Style";
import { isExtraFontStyle } from "visual/types/utils";
import { getGlobalColors, getGlobalTypography } from "visual/utils/api";
import { brizyToBranding } from "visual/utils/branding";
import { t } from "visual/utils/i18n";
import { uuid } from "visual/utils/uuid";
import { Action, OwnProps, State, StateProps } from "./types";

const mapStateToProps = (state: ReduxState): StateProps => ({
  styles: stylesSelector(state),
  extraStyles: extraStylesSelector(state),
  currentStyle: currentStyleSelector(state),
  extraFontStyles: extraFontStylesSelector(state)
});

const mapDispatchToProps = {
  addNewGlobalStyle,
  removeGlobalStyle,
  editGlobalStyleName,
  updateCurrentStyleId,
  updateCurrentStyle,
  getRegenerateColors,
  getRegenerateTypography,
  updateExtraFontStyles
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & OwnProps;

class _DrawerComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingColor: false,
      loadingTypography: false
    };
  }

  handleCurrentStyleChange = ({ type, payload }: Action) => {
    const {
      currentStyle,
      addNewGlobalStyle,
      removeGlobalStyle,
      editGlobalStyleName,
      updateCurrentStyleId
    } = this.props;

    switch (type) {
      case OnChangeActionTypes.duplicate: {
        const newStyle = {
          ...currentStyle,
          id: uuid(),
          title: payload
        };

        addNewGlobalStyle(newStyle);
        break;
      }
      case OnChangeActionTypes.remove: {
        removeGlobalStyle(payload);
        break;
      }
      case OnChangeActionTypes.edit: {
        editGlobalStyleName(payload);
        break;
      }
      case OnChangeActionTypes.change: {
        updateCurrentStyleId(payload);
        break;
      }
    }
  };

  handleColorPaletteChange = (value: Palette[]) => {
    const { currentStyle, updateCurrentStyle } = this.props;
    updateCurrentStyle({ ...currentStyle, colorPalette: value });
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
      const { styles, config, getRegenerateColors } = this.props;

      const colorPalette = await getGlobalColors(config);

      const style = this.getRegeneratedStyle(styles);

      this.setState({ loadingColor: false });

      getRegenerateColors({ ...style, colorPalette });
    } catch (_) {
      this.setState({ loadingColor: false });
      ToastNotification.error(t("Missing regenerate methods in config.api"));
    }
  };

  handleRegenerateTypography = async () => {
    try {
      this.setState({ loadingTypography: true });
      const { styles, config, getRegenerateTypography } = this.props;

      const fontStyles = await getGlobalTypography(config);

      const style = this.getRegeneratedStyle(styles);

      this.setState({ loadingTypography: false });

      getRegenerateTypography({ ...style, fontStyles });
    } catch (_) {
      this.setState({ loadingTypography: false });
      ToastNotification.error(t("Missing regenerate methods in config.api"));
    }
  };

  handleFontStylesChange = (value: FontStyles[]) => {
    const {
      currentStyle,
      extraFontStyles,
      updateExtraFontStyles,
      updateCurrentStyle
    } = this.props;
    const { fontStyles } = currentStyle;
    const mergedFontStyles = [...fontStyles, ...extraFontStyles];

    if (value.length > mergedFontStyles.length) {
      const extraFontStyles = value.filter(isExtraFontStyle);
      updateExtraFontStyles(extraFontStyles);

      return;
    }

    for (const fs of value) {
      for (const fs2 of mergedFontStyles) {
        if (fs.id === fs2.id) {
          if (isEqual(fs, fs2)) {
            continue;
          }

          if (fs.deletable === "off") {
            updateCurrentStyle({
              ...currentStyle,
              fontStyles: value.filter((fs) => fs.deletable === "off")
            });
          } else {
            const extraFontStyles = value.filter(isExtraFontStyle);
            updateExtraFontStyles(extraFontStyles);
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
        parentClassName: "brz-ed--scrollable",
        className: "brz-ed-sidebar-option__font-style-editor",
        value: { extraFontStyles, fontStyles },
        label: showTypographyRegenerate
          ? this.labelWithButton(
              t("TYPOGRAPHY"),
              this.handleRegenerateTypography,
              loadingTypography
            )
          : undefined,
        wrapOptions: false,
        onChange: this.handleFontStylesChange
      }
    ];

    return (
      <Options
        className="brz-ed-sidebar__styling brz-ed-sidebar-options"
        data={options}
      />
    );
  }
}

const DrawerComponent = (props: Omit<Props, "config">): JSX.Element => {
  const config = useConfig();

  return <_DrawerComponent {...props} config={config} />;
};

export const getStyling = (() => {
  const drawerComponent = connector(DrawerComponent);

  return () => ({
    id: LeftSidebarOptionsIds.globalStyle,
    type: "drawer",
    icon: "nc-brush",
    drawerTitle: t("Styling"),
    drawerComponent
  });
})();
