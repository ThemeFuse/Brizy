import _ from "underscore";
import React from "react";
import UIState from "visual/global/UIState";
import { rolesHOC } from "visual/component/Roles";
import { getBlocksConfig } from "./utils";

class MiddleBlockAdder extends React.Component {
  static defaultProps = {
    onAddBlocks: _.noop()
  };

  shouldComponentUpdate() {
    return false;
  }

  open = () => {
    UIState.set("prompt", {
      prompt: "blocks",
      blocksConfig: getBlocksConfig(),
      onAddBlocks: this.props.onAddBlocks
    });
  };

  render() {
    return (
      <div className="brz-ed-container-plus">
        <div className="brz-ed-container-wrap">
          <div
            className="brz-ed-container-trigger brz-ed-container-trigger--small"
            onClick={this.open}
          />
        </div>
      </div>
    );
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: MiddleBlockAdder
});
