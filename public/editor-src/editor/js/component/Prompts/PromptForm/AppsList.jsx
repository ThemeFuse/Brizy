import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

class AppsList extends Component {
  static get title() {
    return "Apps";
  }
  static get id() {
    return "apps";
  }

  static defaultProps = {
    apps: [],
    connectedApps: "",
    currentAppLoading: null,
    onChange: _.noop
  };

  renderApps = () => {
    const { apps, connectedApps, currentAppLoading, onChange } = this.props;

    return apps.map(({ id, img, shortTitle }, index) => {
      const isConnected = connectedApps.includes(id);
      const isLoading = index === currentAppLoading;
      const className = classnames("brz-ed-popup-apps-item", {
        "brz-ed-popup-apps-item--connected": isConnected,
        "brz-ed-popup-apps-item--loading": isLoading
      });

      return (
        <div key={id} className={className} onClick={() => onChange(index)}>
          <div className="brz-ed-popup-app-logo">
            <img src={img} />
            {isConnected && (
              <span className="brz-ed-popup-app-active-icon">
                <svg
                  className="brz-icon-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <g className="nc-icon-wrapper" fill="currentColor">
                    <path
                      fill="currentColor"
                      d="M12.4 6L11 4.6l-4 4-2-2L3.6 8 7 11.4z"
                    />
                  </g>
                </svg>
              </span>
            )}
            {isLoading && (
              <span className="brz-ed-popup-app-active-icon">
                <EditorIcon
                  icon="nc-circle-02"
                  className="brz-ed-animated--spin"
                />
              </span>
            )}
          </div>
          <div className="brz-ed-popup-app-title">{shortTitle}</div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className="brz-ed-form-apps brz-d-xs-flex brz-flex-xs-wrap">
        {this.renderApps()}
      </div>
    );
  }
}

export default AppsList;
