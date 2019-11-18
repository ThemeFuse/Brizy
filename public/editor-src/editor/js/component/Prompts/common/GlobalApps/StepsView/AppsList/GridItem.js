import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import Config from "visual/global/Config";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

const IS_PRO = Config.get("pro");
const ConfigUrl = Config.get("urls");

export default class GridItem extends Component {
  static defaultProps = {
    img: "",
    pro: false,
    shortTitle: "",
    loading: false,
    active: false,
    onClick: _.noop
  };

  state = {
    tooltipOpen: false
  };

  iconRef = React.createRef();

  handleTooltipOpen = () => {
    this.setState({
      tooltipOpen: true
    });
  };

  handleTooltipClose = () => {
    this.setState({
      tooltipOpen: false
    });
  };

  renderProInfo() {
    return (
      <div className="brz-ed-tooltip-content__pro">
        <p className="brz-p brz-ed-tooltip-content__pro-title">
          {t("You’ll need Brizy PRO to use this integration")}
        </p>
        <p className="brz-p brz-ed-tooltip-content__pro-body">
          <a className="brz-a" href={ConfigUrl.upgradeToPro} target="_blank">
            <EditorIcon icon="nc-lock" />
            {t("Get Brizy PRO")}
          </a>
        </p>
      </div>
    );
  }

  renderPro() {
    const { img, title } = this.props;
    const className = classnames(
      "brz-ed-popup-integrations__app-logo",
      this.state.tooltipOpen && "brz-ed-popup-integrations__app-logo--open"
    );

    return (
      <div className="brz-ed-popup-integrations__app brz-ed-popup-integrations__app--pro">
        <Tooltip
          overlayClassName="brz-ed-tooltip--delay-2"
          size="small"
          offset="5"
          openOnClick={false}
          nodeRef={this.iconRef}
          overlay={this.renderProInfo()}
          onOpen={this.handleTooltipOpen}
          onClose={this.handleTooltipClose}
        >
          <div className={className}>
            <img className="brz-img" src={img} alt={title} />
            <span
              ref={this.iconRef}
              className="brz-span brz-ed-popup-integrations__app-icon brz-ed-popup-integrations__app-icon--pro"
            >
              <EditorIcon icon="nc-lock" />
            </span>
            <p className="brz-p brz-ed-badge brz-ed-badge--pro">pro</p>
          </div>
          <div className="brz-ed-popup-integrations__app-title">{title}</div>
        </Tooltip>
      </div>
    );
  }

  renderFree() {
    const { img, title, loading, active, onClick } = this.props;
    const className = classnames(
      "brz-ed-popup-integrations__app",
      active && "brz-ed-popup-integrations__app--connected",
      loading && "brz-ed-popup-integrations__app--loading"
    );

    return (
      <div className={className} onClick={onClick}>
        <div className="brz-ed-popup-integrations__app-logo">
          <img className="brz-img" src={img} alt={title} />
          {active && !loading && (
            <span className="brz-span brz-ed-popup-integrations__app-icon">
              <EditorIcon icon="nc-check-small" />
            </span>
          )}
          {loading && (
            <span className="brz-span brz-ed-popup-integrations__app-icon">
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            </span>
          )}
        </div>
        <div className="brz-ed-popup-integrations__app-title">{title}</div>
      </div>
    );
  }

  render() {
    return !IS_PRO && this.props.pro ? this.renderPro() : this.renderFree();
  }
}
