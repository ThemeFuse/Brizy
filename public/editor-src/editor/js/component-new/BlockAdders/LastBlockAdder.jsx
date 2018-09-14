import React from "react";
import classnames from "classnames";
import UIState from "visual/global/UIState";
import RoundPlus from "visual/component-new/RoundPlus";
import { rolesHOC } from "visual/component-new/Roles";
import { t } from "visual/utils/i18n";
import { getBlocksConfig } from "./utils";

class LastBlockAdder extends React.Component {
  static defaultProps = {
    blocks: []
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
    const className = classnames(
      "brz-ed-container-adder",
      this.props.className
    );

    return (
      <div className={className}>
        <span className="brz-span brz-ed-block-adder-title">
          {t("Add a new block")}
        </span>
        <RoundPlus onClick={this.open} />
        <span className="brz-span brz-ed-block-adder-desc">
          {t("Press the button to add blocks")}
        </span>
      </div>
    );
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: LastBlockAdder
});
