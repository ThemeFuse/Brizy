import React from "react";
import _ from "underscore";
import Model from "visual/Model";
import Config from "visual/global/Config";
import Fixed from "visual/component/Prompts/Fixed";
import ScrollPane from "visual/component/ScrollPane";
import { hideBar } from "visual/component/bar/BarManager";

class PromptPopup extends React.Component {
  static defaultProps = {
    onChange: _.noop
  };

  handleClose = () => {
    this.props.onClose();
  };

  handleItemClick = blockType => {
    this.props.onClose();
    setTimeout(() => {
      this.props.onChange(blockType);
    }, 0);
  };

  renderItems = () => {
    return _.map(Config.get("popups"), (blockType, index) => {
      const { screenshot } = Model[blockType].visual;

      return (
        <div key={index}>
          <div onClick={this.handleItemClick.bind(null, blockType)}>
            <img className="brz-img" src={screenshot} />
          </div>
        </div>
      );
    });
  };

  render() {
    return (
      <Fixed
        ref={el => {
          this.fixed = el;
        }}
        onClose={this.handleClose}
      >
        <div className="brz-ed-popup-wrapper brz-ed-popup-blocks">
          <div className="brz-ed-popup-header">
            <div className="brz-ed-popup-tab-item">
              <div className="brz-ed-popup-tab-icon">
                <div className="brz-ed-popup-tab-icon brz-ed-icon-images-old" />
              </div>
              <div className="brz-ed-popup-tab-name">Popups</div>
            </div>
            <div
              className="brz-ed-popup-btn-close"
              onClick={this.handleClose}
            />
          </div>
          <div className="brz-ed-popup-content brz-ed-popup-pane">
            <div className={"brz-ed-popup-body"}>
              <ScrollPane className="brz-ed-scroll-pane">
                <div>{this.renderItems()}</div>
              </ScrollPane>
            </div>
          </div>
        </div>
      </Fixed>
    );
  }
}

export default PromptPopup;
