import classnames from "classnames";
import classNames from "classnames";
import React from "react";
import _ from "underscore";
import ClickOutside from "visual/component/ClickOutside";
import ColorPickerFields from "visual/component/Controls/ColorPicker2/BrizyFields";
import EditorIcon from "visual/component/EditorIcon";
import { EyeDropper } from "visual/component/EyeDropper";
import Config from "visual/global/Config";
import { pipe } from "visual/utils/fp";
import { isStory } from "visual/utils/models";

class ColorPickerOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    value: {
      hex: "#000000",
      opacity: 1
    },
    onChange: _.noop
  };

  state = {
    eyeDropperStatus: false
  };

  render() {
    const { className: _className, attr: _attr, value, onChange } = this.props;
    const { eyeDropperStatus } = this.state;
    const is_story = isStory(Config.getAll());

    const className = classnames(
      "brz-ed-option__color-picker__hex",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");
    const eyeChange = (v) => onChange({ hex: v, isChanged: "hex" });

    const handleOutsideClick = () => this.setState({ eyeDropperStatus: false });
    const handleDropper = pipe(eyeChange, () =>
      this.setState({ eyeDropperStatus: false })
    );
    const onEyeDropClick = () =>
      !eyeDropperStatus && this.setState({ eyeDropperStatus: true });

    return (
      <div className={className} {...attr}>
        {is_story ? (
          ""
        ) : (
          <EditorIcon
            className={classNames(
              "brz-ed-control__color-picker-inputs__eye-dropper",
              {
                "brz-ed-control__color-picker-inputs__eye-dropper--active":
                  eyeDropperStatus
              }
            )}
            icon="eye-dropper"
            onClick={onEyeDropClick}
          />
        )}
        <ColorPickerFields value={value} onChange={onChange} />
        {eyeDropperStatus && (
          <ClickOutside onClickOutside={handleOutsideClick}>
            <EyeDropper onPick={handleDropper} />
          </ClickOutside>
        )}
      </div>
    );
  }
}

export default ColorPickerOptionType;
