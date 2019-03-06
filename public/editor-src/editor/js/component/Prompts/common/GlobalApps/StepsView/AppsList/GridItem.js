import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

export default class GridItem extends Component {
  static defaultProps = {
    img: "",
    shortTitle: "",
    loading: false,
    active: false,
    onClick: _.noop
  };

  renderStatus() {
    const { loading, active } = this.props;

    return (
      <span className="brz-span brz-ed-popup-integrations__app-icon">
        {active && !loading && <EditorIcon icon="nc-check-small" />}
        {loading && (
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        )}
      </span>
    );
  }

  render() {
    const { img, title, loading, active, onClick } = this.props;
    const className = classnames("brz-ed-popup-integrations__app", {
      "brz-ed-popup-integrations__app--connected": active,
      "brz-ed-popup-integrations__app--loading": loading
    });

    return (
      <div className={className} onClick={onClick}>
        <div className="brz-ed-popup-integrations__app-logo">
          <img className="brz-img" src={img} alt={title} />
          {(loading || active) && this.renderStatus()}
        </div>
        <div className="brz-ed-popup-integrations__app-title">{title}</div>
      </div>
    );
  }
}
