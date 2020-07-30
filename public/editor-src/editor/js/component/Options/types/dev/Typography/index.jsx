import React, { PureComponent } from "react";
import T from "prop-types";
import Prompts from "visual/component/Prompts";
import { Typography as Control } from "visual/component/Controls/Typography";
import * as FontType from "visual/utils/fonts/familyType";
import * as FontWeight from "visual/utils/fonts/weight";
import { fromGlobal, getModel, patchFontFamily } from "./componentUtils";
import { projectSelector, unDeletedFontSelector } from "visual/redux/selectors";
import { connect } from "react-redux";
import {
  fontTransform,
  getFontStyles,
  getWeightChoices
} from "visual/utils/fonts";
import { currentUserRole } from "visual/component/Roles";
import { t } from "visual/utils/i18n";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";
import * as Model from "visual/component/Options/types/dev/Typography/model";
import { getConfig } from "visual/component/Options/types/dev/BoxShadow/utils";

const openFontsUploader = () => {
  Prompts.open({
    prompt: "fonts",
    mode: "single"
  });
};

const openFontStyle = () => {
  getStore().dispatch(
    updateUI("leftSidebar", {
      isOpen: true,
      drawerContentType: "styling"
    })
  );
};

export class TypographyComponent extends PureComponent {
  onChange = (v, meta = {}) => {
    let newValue;
    const isFontStyle = meta.isChanged === "fontStyle";
    const value = isFontStyle ? this.props.value : fromGlobal(this.props.value);

    switch (meta.isChanged) {
      case "fontFamily":
        newValue = patchFontFamily(v, value);
        break;
      case "fontStyle":
        newValue = Model.patchFontStyle(v, value);
        break;
      case "fontSize":
        newValue = Model.patchFontSize(v, value);
        break;
      case "fontWeight":
        newValue = Model.patchFontWeight(v, value);
        break;
      case "letterSpacing":
        newValue = Model.patchLetterSpacing(v, value);
        break;
      case "lineHeight":
        newValue = Model.patchLineHeight(v, value);
        break;
    }

    this.props.onChange(newValue, meta);
  };

  render() {
    const props = this.props;
    const value = fromGlobal(this.props.value);
    const styles = [{ id: "", title: t("Custom") }, ...getFontStyles()];
    const weights = getWeightChoices({
      type: value.fontFamilyType,
      family: value.fontFamily
    });

    return (
      <Control
        onChange={this.onChange}
        fontFamily={config(props.config, "fontFamily")}
        fonts={props.fonts}
        font={value.fontFamily}
        fontAdd={currentUserRole() === "admin" ? openFontsUploader : undefined}
        fontAddLabel={t("Add New Font")}
        styles={styles}
        style={value.fontStyle}
        styleOpenSettings={openFontStyle}
        size={value.fontSize}
        weights={weights}
        weight={value.fontWeight}
        lineHeight={value.lineHeight}
        letterSpacing={value.letterSpacing}
      />
    );
  }
}

TypographyComponent.getModel = getModel;

const FontPropType = T.shape({
  id: T.string,
  family: T.string,
  title: T.string,
  size: T.string
});

TypographyComponent.propTypes = {
  value: T.shape({
    fontFamily: T.string,
    fontFamilyType: T.oneOf(FontType.types),
    fontStyle: T.string,
    fontSize: T.number,
    fontWeight: T.oneOf(FontWeight.weights),
    letterSpacing: T.number,
    lineHeight: T.number
  }).isRequired,
  fonts: T.shape({
    config: T.arrayOf(FontPropType),
    blocks: T.arrayOf(FontPropType),
    google: T.arrayOf(FontPropType),
    upload: T.arrayOf(FontPropType)
  }),
  onChange: T.func.isRequired,
  config: T.shape({
    fontFamily: T.bool
  })
};

TypographyComponent.defaultProps = {
  config: {
    fontFamily: true
  }
};

const config = getConfig.bind(null, TypographyComponent.defaultProps.config);

const mapStateToProps = state => ({
  fonts: Object.entries(unDeletedFontSelector(state)).reduce(
    (acc, [k, { data }]) => {
      acc[k] = data.map(fontTransform[k]);
      return acc;
    },
    {}
  ),
  defaultFont: projectSelector(state).data.font
});

export const Typography = connect(mapStateToProps, null)(TypographyComponent);
