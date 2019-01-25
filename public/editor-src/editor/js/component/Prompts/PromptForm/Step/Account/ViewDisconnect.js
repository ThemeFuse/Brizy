import React, { Component } from "react";
import _ from "underscore";
import Button from "../../Components/Button";

class ViewAccount extends Component {
  static defaultProps = {
    title: "",
    nextLoading: false,
    prevLoading: false,
    error: null,
    handleNext: _.noop,
    handlePrev: _.noop
  };

  renderError() {
    const { error } = this.props;

    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{error}</span>
      </div>
    );
  }

  render() {
    const {
      title,
      img,
      error,
      nextLoading,
      prevLoading,
      handleNext,
      handlePrev
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations__connect">
        <div className="brz-ed-popup-integrations__connect-head">
          <img className="brz-img" src={img} title={title} />
          <p className="brz-p">
            Subscribers are automatically synced to your {title} list
          </p>
        </div>
        <div className="brz-ed-popup-integrations__connect-body">
          {error && this.renderError()}
          <Button type="red" loading={nextLoading} onClick={handleNext}>
            Disconnect
          </Button>
          <Button type="default" loading={prevLoading} onClick={handlePrev}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default ViewAccount;
