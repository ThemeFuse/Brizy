import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import Prompts from "visual/component/Prompts";
import { rolesHOC } from "visual/component/Roles";
import RoundPlus from "visual/component/RoundPlus";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { t } from "visual/utils/i18n";

class LastBlockAdder extends React.Component {
  static defaultProps = {
    blocks: []
  };

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
    const className = classnames(
      "brz-ed-container-adder",
      this.props.className
    );

    return (
      <div className={className}>
        <span className="brz-span brz-ed-block-adder-title">
          {t("Add a new block")}
        </span>
        <RoundPlus onClick={this.handleOpen} />
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
