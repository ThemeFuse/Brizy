import React from "react";
import _ from "underscore";
import Option from "visual/component-new/Options/Option";

class ToolbarItem extends React.Component {
  static defaultProps = {
    data: null,
    toolbar: null,
    onChange: _.noop
  };

  render() {
    const { data, toolbar } = this.props;

    return (
      <div className="brz-ed-toolbar__item">
        <Option
          className="brz-ed-toolbar__option"
          data={data}
          toolbar={toolbar}
          location="toolbar"
          onChange={data.onChange}
        />
      </div>
    );
  }
}

export default ToolbarItem;
