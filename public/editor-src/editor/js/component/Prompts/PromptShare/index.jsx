import React from "react";
import Fixed from "visual/component/Prompts/Fixed";
import Social from "./Social";

class PromptShare extends React.Component {
  render() {
    return (
      <Fixed
        ref={el => {
          this.fixed = el;
        }}
        onClose={this.props.onClose}
      >
        <div className="brz-ed-popup-wrapper brz-ed-popup-share">
          <div className="brz-ed-popup-header">
            <div className="brz-ed-popup-tab-item">
              <div className="brz-ed-popup-tab-icon">
                <div className="brz-ed-popup-tab-icon brz-ed-icon-share" />
              </div>
              <div className="brz-ed-popup-tab-name">Share</div>
            </div>
            <div
              className="brz-ed-popup-btn-close"
              onClick={this.props.onClose}
            />
          </div>
          <Social onChange={this.props.onClose} />
        </div>
      </Fixed>
    );
  }
}

export default PromptShare;
