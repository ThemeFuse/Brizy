import React from "react";
import { connect } from "react-redux";
import Prompts from "visual/component/Prompts";
import { rolesHOC } from "visual/component/Roles";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";

class MiddleBlockAdder extends React.Component {
  handleOpen = () => {
    const { onAddBlock, onAddTemplate } = this.props;
    const config = Config.getAll();
    ///// TODO: https://github.com/bagrinsergiu/blox-editor/issues/24123
    const showGlobal = !(isCloud(config) && isShopify(config));

    Prompts.open({
      prompt: "blocks",
      mode: "single",
      props: {
        type: "normal",
        showGlobal,
        onChangeBlocks: onAddBlock,
        onChangeTemplate: onAddTemplate,
        onChangeSaved: onAddTemplate,
        onChangeGlobal: onAddBlock
      }
    });
  };

  render() {
    return (
      <div className="brz-ed-container-plus">
        <div
          className="brz-ed-container-trigger brz-ed-container-trigger--small"
          onClick={this.handleOpen}
        />
      </div>
    );
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: connect()(MiddleBlockAdder)
});
