import React from "react";
import T from "prop-types";
import _ from "underscore";
import classnames from "classnames";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";
import { ColorPicker3 } from "visual/component/Controls/ColorPicker3";
import { getColorPaletteColors as paletteColors } from "visual/utils/color";
import * as Palette from "visual/utils/color/toPalette";
import { toOpacity } from "visual/utils/cssProps/opacity";
import * as Hex from "visual/utils/color/isHex";
import { setHex, setPalette, setOpacity as _setOpacity } from "./model";
import * as Utils from "./utils";
import { ColorPickerInputs } from "visual/component/Controls/ColorPicketInputs";
import { paletteHex } from "./utils";

const setOpacity = Utils.setOpacity.bind(null, _setOpacity);

export class ColorPicker extends React.Component {
  static propTypes = {
    className: T.string,
    attr: T.object,
    value: T.shape({
      hex: T.string,
      opacity: T.number,
      tempOpacity: T.number,
      palette: T.string,
      tempPalette: T.string
    }),
    config: T.shape({
      opacity: T.bool
    }),
    onChange: T.func
  };

  static defaultProps = {
    className: "",
    attr: {},
    value: {
      hex: "#000000",
      opacity: 1,
      tempOpacity: 1,
      palette: "",
      tempPalette: ""
    },
    config: {
      opacity: true
    },
    onChange: _.noop
  };

  /**
   *
   * @param {function(key: string):*} get
   *
   * @return {{
   *   hex: string,
   *   opacity: number,
   *   tempOpacity: number,
   *   palette: string,
   *   tempPalette: string,
   * }}
   */
  static getModel = get => {
    const defaults = ColorPicker.defaultProps.value;
    const palette = Palette.read(get("palette")) ?? defaults.palette;
    return {
      hex:
        paletteHex(palette, paletteColors()) ??
        Hex.read(get("hex")) ??
        defaults.hex,
      opacity: toOpacity(get("opacity"), defaults.opacity),
      palette: palette,
      tempOpacity: toOpacity(get("tempOpacity"), defaults.tempOpacity),
      tempPalette: Palette.read(get("tempPalette")) ?? defaults.tempPalette
    };
  };

  opacity = () =>
    this.props.config.opacity || ColorPicker.defaultProps.config.opacity;

  onChange = (v, meta = {}) => {
    switch (meta.isChanged) {
      case "palette":
        this.props.onChange(setPalette(v.palette, this.props.value), meta);
        break;
      case "hex":
        this.props.onChange(setHex(v.hex, this.props.value), meta);
        break;
      case "opacity":
        this.props.onChange(
          setOpacity(v.opacity, this.props.value, !!meta.opacityDragEnd),
          meta
        );
        break;
    }
  };

  onHexChange = hex => {
    this.props.onChange(setHex(hex, this.props.value), { isChanged: "hex" });
  };

  handleSidebarOpen = () => {
    getStore().dispatch(
      updateUI("leftSidebar", {
        isOpen: true,
        drawerContentType: "styling"
      })
    );
  };

  render() {
    const { className: _className, attr } = this.props;
    const className = classnames(
      "brz-ed-option__colorPicker",
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        <ColorPicker3
          value={this.props.value}
          opacity={this.opacity()}
          onChange={this.onChange}
          palette={paletteColors()}
          paletteOpenSettings={this.handleSidebarOpen}
        />
        <ColorPickerInputs
          value={this.props.value.hex}
          onChange={this.onHexChange}
        />
      </div>
    );
  }
}
