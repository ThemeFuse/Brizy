import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import UIState from "visual/global/UIState";
import RoundPlus from "visual/component/RoundPlus";
import { rolesHOC } from "visual/component/Roles";
import { t } from "visual/utils/i18n";
import { addBlock, importTemplate } from "visual/redux/actions";

class LastBlockAdder extends React.Component {
  static defaultProps = {
    insertIndex: 0,
    blocks: []
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
          onAddBlocks: this.handleBlockAdd
        },
        saved: {
          blocksFilter: blocks => {
            return blocks.filter(
              // eslint-disable-next-line no-unused-vars
              ([_, { data: blockData }]) =>
                blockData.type !== "SectionPopup" &&
                blockData.type !== "SectionPopup2"
            );
          },
          onAddBlocks: this.handleBlockAdd
        },
        global: {
          blocksFilter: blocks => {
            return blocks.filter(
              // eslint-disable-next-line no-unused-vars
              ([_, { data: blockData }]) =>
                blockData.type !== "SectionPopup" &&
                blockData.type !== "SectionPopup2"
            );
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
  component: connect(undefined, undefined, undefined, {
    forwardRef: true
  })(LastBlockAdder)
});
