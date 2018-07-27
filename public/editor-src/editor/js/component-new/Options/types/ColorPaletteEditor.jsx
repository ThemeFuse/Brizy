import React from "react";
import classnames from "classnames";
import Toolbar from "visual/component-new/Toolbar";

class ColorPalette extends React.Component {
  static defaultProps = {
    className: "",
    helperContent: "",
    helper: false,
    attr: {},
    value: []
  };

  state = {
    active: null
  };

  handleToolbarOpen = index => {
    this.setState({ active: index });
  };

  handleToolbarClose = () => {
    this.setState({ active: null });
  };

  handleColorChange(newValue, itemIndex) {
    const value = this.props.value.map(
      (el, index) => (index === itemIndex ? { ...el, hex: newValue.hex } : el)
    );

    this.props.onChange(value);
  }

  renderLabel = () => {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div className="brz-ed-option__helper__content">{helperContent}</div>
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label brz-ed-option__color-palette-editor__label">
        {label}
        {helper}
      </div>
    );
  };

  render() {
    const { className: _className, attr, label, helper, value } = this.props;
    const colors = value.map((color, index) => {
      const className = classnames(
        "brz-ed-option__color-palette-editor__item",
        { active: index === this.state.active }
      );
      const style = {
        backgroundColor: color.hex
      };
      const getToolbarItems = () => [
        {
          id: "settings",
          type: "popover",
          icon: "nc-cog",
          display: "inside",
          size: "auto",
          onOpenDirect: true,
          position: 90,
          options: [
            {
              id: "backgroundColor",
              type: "colorPicker",
              label: "Color HEX",
              disableOpacity: true,
              value: {
                hex: color.hex,
                opacity: 1
              },
              onChange: value => this.handleColorChange(value, index)
            },
            {
              id: "backgroundColorFields",
              type: "colorFields",
              disableOpacity: true,
              value: {
                hex: color.hex,
                opacity: 1
              },
              onChange: value => this.handleColorChange(value, index)
            }
          ]
        }
      ];

      return (
        <Toolbar
          key={index}
          getItems={getToolbarItems}
          onOpen={() => this.handleToolbarOpen(index)}
          onClose={this.handleToolbarClose}
        >
          <div className={className} style={style} />
        </Toolbar>
      );
    });

    const className = classnames(
      "brz-ed-option__color-palette-editor",
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        {colors}
      </div>
    );
  }
}

export default ColorPalette;
