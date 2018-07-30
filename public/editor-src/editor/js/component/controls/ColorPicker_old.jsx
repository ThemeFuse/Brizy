import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import classnames from "classnames";
import jQuery from "jquery";

const hexRegex = /(^(?:#|)[0-9A-F]{6}$)/i;

export default class ColorPicker extends Component {
  static defaultProps = {
    className: "",
    value: {
      hex: "#000000",
      opacity: null
    },
    onPreview: _.noop,
    onChange: _.noop
  };

  changedManually = false;

  constructor(props) {
    super(props);
    const { opacity } = props.value;

    this.settings = {
      useOpacity: opacity || opacity === 0
    };
  }

  componentDidMount() {
    this.$hexEl = jQuery(this.hex);
    this.$opacityEl = jQuery(this.opacity);

    this.value = this.props.value;

    this.initPlugin(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    const { hex: oldHex, opacity: oldOpacity } = this.getPluginValue();
    const { hex, opacity } = nextProps.value;

    if (oldHex !== hex || Number(oldOpacity) !== Number(opacity)) {
      this.updatePluginValue({
        color: hex,
        opacity
      });
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.$hexEl = null;
    this.$opacityEl = null;

    jQuery(this.colorpicker).minicolors("destroy");
  }

  getPluginValue = () => {
    const $node = jQuery(this.colorpicker);
    const hex = $node.minicolors("value") || null;
    const opacity = $node.minicolors("opacity") || null;

    return { hex, opacity };
  };

  handleInputChange = (event, type) => {
    const $node = jQuery(this.colorpicker);
    let { value } = event.target;
    let { hex, opacity } = this.getPluginValue();

    if (type === "hex") {
      if (!hexRegex.test(value)) return;
      hex = value[0] === "#" ? value : "#" + value;

      $node.minicolors("value", hex);
    }

    if (type === "opacity") {
      value = Number(value) / 100;
      if (!_.isNumber(value)) return;
      opacity = Math.min(Math.max(0, value), 1);

      $node.minicolors("opacity", value);
    }
  };

  handlePluginChange = (hex, opacity) => {
    if (this.changedManually) {
      this.changedManually = false;
      return;
    }
    this.changedManually = false;

    const { hex: oldHex, opacity: oldOpacity } = this.value;
    const isChanged = hex !== oldHex ? "hex" : "opacity";
    if (hex === oldHex && opacity === oldOpacity) return;
    this.value = { hex, opacity };

    if (isChanged === "hex") {
      this.$hexEl.val(hex);
    } else {
      this.$opacityEl.val(opacity * 100);
    }

    if (this.settings.useOpacity) {
      jQuery(this.colorpicker)
        .find(".minicolors-opacity-slider")
        .css("background-color", hex);
    }

    const newValue = this.settings.useOpacity
      ? { hex, opacity: Number(opacity) }
      : { hex };
    this.props.onChange(newValue, { isChanged });
  };

  // plugin
  initPlugin = ({ hex, opacity }) => {
    jQuery(this.colorpicker).minicolors({
      inline: true,
      control: "hue",
      defaultValue: hex,
      format: "hex",
      opacity: this.settings.useOpacity ? opacity : false,
      change: _.throttle(this.handlePluginChange, 300)
    });
  };

  updatePluginValue = ({ opacity, color }) => {
    this.changedManually = true;

    jQuery(this.colorpicker).minicolors("value", { opacity, color });

    this.$hexEl.val(color);
    if (opacity) {
      this.$opacityEl.val(opacity * 100);
    }
  };

  renderOpacity = () => {
    const { opacity } = this.props.value;
    const newOpacity = Math.round(Number(opacity) * 100);

    return (
      <div className="brz-ed-control__colorPicker__group">
        <label htmlFor="opacity" className="brz-label brz-ed-control__colorPicker__label">
          Op:{" "}
        </label>
        <input
          defaultValue={newOpacity}
          ref={input => {
            this.opacity = input;
          }}
          name="opacity"
          type="text"
          className="brz-input brz-ed-control__colorPicker__input"
          onChange={e => this.handleInputChange(e, "opacity")}
        />
      </div>
    );
  };

  render() {
    const { className: _className, value: { hex, opacity } } = this.props;
    const className = classnames("brz-ed-control__colorPicker", _className);

    return (
      <div className={className}>
        <div
          ref={input => {
            this.colorpicker = input;
          }}
          className="brz-ed-control__colorPicker__color"
          data-default-color="#c41f97"
          data-opacity={this.settings.useOpacity ? opacity : ""}
        />
        <div className="brz-ed-control__colorPicker__footer">
          <div className="brz-ed-control__colorPicker__group">
            <label htmlFor="hex" className="brz-label brz-ed-control__colorPicker__label">
              Hex:{" "}
            </label>
            <input
              defaultValue={hex}
              ref={input => {
                this.hex = input;
              }}
              name="hex"
              type="text"
              className="brz-input brz-ed-control__colorPicker__input"
              onChange={e => this.handleInputChange(e, "hex")}
            />
          </div>
          {this.settings.useOpacity && this.renderOpacity()}
        </div>
      </div>
    );
  }
}
