import React from "react";
import { connect } from "react-redux";
import Prompts from "visual/component/Prompts";
import { rolesHOC } from "visual/component/Roles";

class MiddleBlockAdder extends React.Component {
  handleOpen = () => {
    const { onAddBlock, onAddTemplate } = this.props;

    Prompts.open({
      prompt: "blocks",
      mode: "single",
      props: {
        type: "normal",
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
