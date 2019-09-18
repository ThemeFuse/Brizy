import React from "react";
import { connect } from "react-redux";
import UIState from "visual/global/UIState";
import { rolesHOC } from "visual/component/Roles";
import { addBlock, importTemplate } from "visual/redux/actions";

class MiddleBlockAdder extends React.Component {
  static defaultProps = {
    insertIndex: 0
  };

  shouldComponentUpdate() {
    return false;
  }

  handleTemplateAdd = data => {
    const { insertIndex, dispatch } = this.props;
    const meta = { insertIndex };
    dispatch(importTemplate(data, meta));
  };

  handleBlockAdd = data => {
    const { insertIndex, dispatch } = this.props;
    const meta = { insertIndex };
    dispatch(addBlock(data, meta));
  };

  open = () => {
    UIState.set("prompt", {
      prompt: "blocks",
      tabProps: {
        blocks: {
          categoriesFilter: categories => {
            return TARGET === "WP"
              ? categories
              : categories.filter(
                  ({ slug }) => slug !== "header" && slug !== "footer"
                );
          },
          onAddBlocks: this.handleBlockAdd
        },
        saved: {
          blocksFilter: blocks => {
            return blocks.filter(([_, block]) => block.type !== "SectionPopup");
          },
          onAddBlocks: this.handleBlockAdd
        },
        global: {
          blocksFilter: blocks => {
            return blocks.filter(([_, block]) => block.type !== "SectionPopup");
          },
          onAddBlocks: this.handleBlockAdd
        },
        templates: {
          onAddBlocks: this.handleTemplateAdd
        }
      }
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
  component: connect()(MiddleBlockAdder)
});
