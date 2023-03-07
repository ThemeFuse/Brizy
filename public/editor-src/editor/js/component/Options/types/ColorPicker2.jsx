import classnames from "classnames";
import React from "react";
import _ from "underscore";
import ColorPicker2 from "visual/component/Controls/ColorPicker2";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import ColorPalette2 from "./ColorPalette2";
import Range2 from "./Range2";

const config = Config.getAll();
const disablePalette = isCloud(config) && isShopify(config);

class ColorPicker2OptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    picker: {
      showOpacity: true
    },
    palette: {
      show: true,
      choices: []
    },
    select: {
      show: true,
      itemHeight: 24,
      choices: []
    },
    gradient: {
      show: false,
      min: 0,
      max: 100,
      step: 1
    },
    value: {
      select: "",

      hex: "#000000",
      opacity: 1,
      palette: "",

      gradientColorHex: "#000000",
      gradientColorOpacity: 1,
      gradientColorPalette: "",

      startPointer: 0,
      finishPointer: 100,
      activePointer: "startPointer"
    },
    onChange: _.noop
  };

  enabledGlobalStyle() {
    const config = Config.getAll();
    const { bottomTabsOrder = [], topTabsOrder = [] } =
      config.ui?.leftSidebar ?? {};

    return [...bottomTabsOrder, ...topTabsOrder].includes(
      LeftSidebarOptionsIds.globalStyle
    );
  }

  handleChange = (value) => {
    const { value: _value, onChange } = this.props;
    const gradientChanged =
      _value.select === "gradient" && _value.activePointer === "finishPointer";

    let newHex = {};
    if (value.isChanged === "hex") {
      const { hex } = value;

      newHex = gradientChanged ? { gradientColorHex: hex } : { hex };
    }

    let newOpacity = {};
    if (value.isChanged === "opacity") {
      const { opacity } = value;

      newOpacity = gradientChanged
        ? { gradientColorOpacity: opacity }
        : { opacity };
    }

    onChange({
      ..._value,
      ...value,
      ...newHex,
      ...newOpacity
    });
  };

  renderPalette() {
    const {
      palette: { choices },
      value: { palette, gradientColorPalette, select, activePointer }
    } = this.props;

    const value =
      select === "gradient" && activePointer === "finishPointer"
        ? gradientColorPalette
        : palette;

    return (
      <ColorPalette2
        choices={choices}
        value={value}
        globalStyle={this.enabledGlobalStyle()}
        onChange={(value) => {
          this.handleChange({
            palette: value,
            isChanged: "palette"
          });
        }}
      />
    );
  }

  renderGradient() {
    const {
      // eslint-disable-next-line no-unused-vars
      gradient: { show, ...config },
      value: {
        startPointer,
        finishPointer,
        activePointer,
        hex,
        gradientColorHex
      }
    } = this.props;

    return (
      <Range2
        config={{
          range: config
        }}
        value={{
          startPointer,
          finishPointer,
          activePointer,
          hex,
          gradientColorHex
        }}
        onChange={this.handleChange}
      />
    );
  }

  renderSelectChoices(choices) {
    return choices.map((item, index) => {
      const { title, icon: _icon, optgroup, value } = item;
      let icon;

      if (_.isObject(_icon)) {
        const iconClassName = classnames(
          "brz-control__select-option__bg",
          _icon.className
        );
        icon = <div {..._icon} className={iconClassName} />;
      } else if (_icon) {
        icon = <EditorIcon icon={_icon} />;
      }

      if (optgroup && optgroup.length) {
        return (
          <SelectOptgroup
            key={index}
            title={title}
            items={this.renderSelectChoices(optgroup)}
          >
            {icon}
            {title && <span className="brz-span">{title}</span>}
          </SelectOptgroup>
        );
      }

      return (
        <SelectItem key={index} value={value} title={title}>
          {icon}
          {title && <span className="brz-span">{title}</span>}
        </SelectItem>
      );
    });
  }

  renderSelect() {
    const { select, value } = this.props;

    return (
      <Select
        className="brz-control__select--dark brz-control__select__auto"
        defaultValue={value.select}
        itemHeight={select.itemHeight || 24}
        onChange={(value) => {
          this.handleChange({
            select: value,
            isChanged: "select"
          });
        }}
      >
        {this.renderSelectChoices(select.choices)}
      </Select>
    );
  }

  render() {
    const {
      className: _className,
      picker: { showOpacity = true },
      palette: { show: showPalette = true },
      gradient: { show: showGradient = true },
      select: { show: showSelect = true },
      attr,
      value: {
        hex,
        opacity,
        select,
        activePointer,
        gradientColorHex,
        gradientColorOpacity
      }
    } = this.props;

    const className = classnames(
      "brz-ed-option__colorPicker2",
      _className,
      attr.className
    );

    const value =
      select === "gradient" && activePointer === "finishPointer"
        ? {
            hex: gradientColorHex,
            opacity: gradientColorOpacity
          }
        : {
            hex,
            opacity
          };

    return (
      <div {...attr} className={className}>
        {showGradient && this.renderGradient()}
        {showSelect && this.renderSelect()}
        <ColorPicker2
          value={value}
          disableOpacity={!showOpacity}
          onChange={this.handleChange}
        />
        {!disablePalette && showPalette && this.renderPalette()}
      </div>
    );
  }
}

export default ColorPicker2OptionType;
