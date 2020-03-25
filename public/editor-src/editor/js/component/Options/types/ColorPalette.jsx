import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { getColorPaletteColors } from "visual/utils/color";
import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";

class ColorPalettePicker extends React.Component {
  static defaultProps = {
    className: "",
    colors: null,
    value: "",
    onChange: () => console.log("ColorPalette default onChange")
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
    const { className, colors: propColors, value, onChange } = this.props;
    const wrapperClassName = classnames(
      "brz-ed-option__color-palette",
      className
    );
    const colors = propColors || getColorPaletteColors();
    const squares = colors.map(color => {
      const className = classnames("brz-ed-option__color-palette__item", {
        active: color.id === value
      });
      const styles = {
        backgroundColor: color.hex
      };

      return (
        <div
          key={color.id}
          className={className}
          style={styles}
          onClick={() => onChange(color.id)}
        />
      );
    });

    return (
      <div className={wrapperClassName}>
        {squares}
        <div
          className="brz-ed-option__color-palette__icon"
          onClick={this.handleSidebarOpen}
        >
          <EditorIcon icon="nc-cog" />
        </div>
      </div>
    );
  }
}

export default ColorPalettePicker;
