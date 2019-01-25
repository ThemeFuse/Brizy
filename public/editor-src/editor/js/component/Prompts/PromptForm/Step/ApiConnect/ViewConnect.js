import React, { Component } from "react";
import Button from "../../Components/Button";

class ViewConnect extends Component {
  static defaultProps = {
    img: "",
    title: "",
    description: "",
    data: {},
    apiKeyValue: {},
    nextLoading: false,
    prevLoading: false,
    error: null
  };

  renderError() {
    const { error } = this.props;

    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{error}</span>
      </div>
    );
  }

  handleKeyDown = e => {
    // prevent enter
    if (e.which === 13) {
      this.props.handleNext();
    }
  };

  renderInputs() {
    const { data, apiKeyValue, onChange } = this.props;

    return data.accountApiKeys.map((key, index) => {
      const { title, name } = key;

      return (
        <label key={index} className="brz-ed-popup-integrations__connect-label">
          <input
            className="brz-input"
            name={title}
            type="text"
            value={apiKeyValue[name]}
            required
            onClick={this.handleInputClick}
            onChange={e => {
              onChange(e.target.value, name);
            }}
            onKeyDown={this.handleKeyDown}
          />
          <p className="brz-p">
            <strong className="brz-strong">
              {title} <span className="brz-span">(required)</span>
            </strong>
          </p>
        </label>
      );
    });
  }

  render() {
    const {
      img,
      title,
      description,
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
          <p className="brz-p">{description}</p>
        </div>
        <div className="brz-ed-popup-integrations__connect-body">
          {error && this.renderError()}
          {this.renderInputs()}
          <Button type="tail" loading={nextLoading} onClick={handleNext}>
            Connect
          </Button>
          <Button type="default" loading={prevLoading} onClick={handlePrev}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default ViewConnect;
