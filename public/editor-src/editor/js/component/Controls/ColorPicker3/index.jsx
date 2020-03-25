import React, { PureComponent } from "react";
import T from "prop-types";
import ColorPicker2 from "visual/component/Controls/ColorPicker2";
import classNames from "classnames";
import { ColorPalette } from "visual/component/Controls/ColorPalette";

export const paletteHex = (id, palettes) =>
  (palettes.find(p => p.id === id) || {}).hex;

const getHex = (hex, palette, palettes) => paletteHex(palette, palettes) || hex;

export class ColorPicker3 extends PureComponent {
  static propTypes = {
    className: T.string,
    opacity: T.bool,
    hexInput: T.bool,
    palette: ColorPalette.propTypes.palette,
    paletteOpenSettings: ColorPalette.propTypes.openSettings,
    value: T.shape({
      hex: T.string.isRequired,
      opacity: T.number.isRequired,
      palette: T.string.isRequired
    }).isRequired,
    onChange: T.func.isRequired
  };

  static defaultProps = {
    className: "",
    opacity: true,
    hexInput: true,
    palette: []
  };

  onColorChange = ({ hex, opacity, isChanged, opacityDragEnd }) => {
    this.props.onChange(
      { hex, opacity, palette: this.props.value.palette },
      { isChanged, opacityDragEnd }
    );
  };

  onPaletteChange = id => {
    this.props.onChange(
      { ...this.props.value, palette: id },
      { isChanged: "palette" }
    );
  };

  render() {
    const {
      className: _className,
      value,
      opacity,
      palette,
      paletteOpenSettings
    } = this.props;
    const className = classNames("brz-ed-control__colorPicker3", _className);

    const colorValue = {
      opacity: value.opacity,
      hex: getHex(value.hex, value.palette, this.props.palette)
    };

    return (
      <div className={className}>
        <ColorPicker2
          value={colorValue}
          disableOpacity={!opacity}
          onChange={this.onColorChange}
        />
        <ColorPalette
          palette={palette}
          onChange={this.onPaletteChange}
          openSettings={paletteOpenSettings}
          value={value.palette}
        />
      </div>
    );
  }
}
