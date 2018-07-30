import React from "react";
import _ from "underscore";
import classNames from "classnames";
import Config from "visual/global/Config";
import Portal from "visual/component-new/Portal";
import EditorIcon from "visual/component-new/EditorIcon";

class FormAppsOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-cog",
    value: false
  };

  handleMouseDown = event => {
    event.preventDefault();
    const { apiUrl } = Config.get("applications").form;
    const { value } = this.props;
    const data = {
      ...value,
      apiUrl,
      platforms: "editor"
    };

    UIState.set("prompt", { prompt: "form-integrations", value: data });
  };

  render() {
    const { className: _className, attr: _attr, icon } = this.props;
    const className = classNames(
      "brz-ed-option__button",
      {
        "brz-ed-toolbar--active": false
      },
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} onMouseDown={this.handleMouseDown} {...attr}>
        <EditorIcon icon={icon} />
      </div>
    );
  }
}

export default FormAppsOptionType;
