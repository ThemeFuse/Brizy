import React from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";

export default class extends React.Component {
  static defaultProps = {
    className: "",
    arrowCheck: "nc-check-small",
    arrowUnCheck: "nc-remove",
    defaultValue: false,
    valueMap: null
  };

  onChange = event => {
    const { valueMap, onChange } = this.props;
    const value = _.isObject(valueMap)
      ? valueMap[event.target.checked]
      : event.target.checked;

    setTimeout(onChange, 200, value);
  };

  render() {
    const {
      className: _className,
      defaultValue,
      valueMap,
      arrowCheck,
      arrowUnCheck
    } = this.props;
    const defaultChecked = _.isObject(valueMap)
      ? _.findKey(valueMap, item => item === defaultValue) == "true"
      : defaultValue;
    const className = classnames("brz-ed-control__switch", _className);

    return (
      <div className={className}>
        <label className="brz-label brz-ed-control__switch-label">
          <input
            type="checkbox"
            className="brz-input brz-ed-control__switch-input"
            defaultChecked={defaultChecked}
            onChange={this.onChange}
          />
          <span className="brz-span brz-ed-control__switch-arrows">
            <EditorIcon
              className="brz-ed-control__switch--check"
              icon={arrowCheck}
            />
            <EditorIcon
              className="brz-icon-svg brz-ed-control__switch--un-check"
              icon={arrowUnCheck}
            />
          </span>
          <span className="brz-span brz-ed-control__switch--handle" />
        </label>
      </div>
    );
  }
}
