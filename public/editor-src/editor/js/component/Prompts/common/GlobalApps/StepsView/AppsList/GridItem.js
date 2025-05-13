import classnames from "classnames";
import { noop } from "es-toolkit";
import React, { Component } from "react";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { ProInfo } from "visual/component/ProInfo";
import { t } from "visual/utils/i18n";

export default class GridItem extends Component {
  static defaultProps = {
    img: "",
    pro: false,
    shortTitle: "",
    loading: false,
    active: false,
    onClick: noop
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

  renderPro() {
    const { img, title, upgradeToPro } = this.props;
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
          overlay={
            <ProInfo
              text={t("Upgrade to PRO to use this integration")}
              url={upgradeToPro}
            />
          }
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
    const {
      img,
      title,
      loading,
      active,
      onClick,
      isDeletable,
      handleDelete,
      id,
      idx
    } = this.props;

    const handleDeleteEmail = (evt) => {
      evt.stopPropagation();
      handleDelete({ type: id, id: idx });
    };

    const className = classnames(
      "brz-ed-popup-integrations__app",
      active && "brz-ed-popup-integrations__app--connected",
      loading && "brz-ed-popup-integrations__app--loading",
      isDeletable && "brz-ed-popup-integrations__app--deletable"
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
          {isDeletable && !loading && (
            <span
              className="brz-span brz-ed-popup-integrations__delete-icon"
              onClick={handleDeleteEmail}
            >
              <EditorIcon icon="nc-trash" />
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
    const { projectIsPro, pro } = this.props;

    return !projectIsPro && pro ? this.renderPro() : this.renderFree();
  }
}
