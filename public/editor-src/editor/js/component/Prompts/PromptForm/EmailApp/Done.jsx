import React, { Component } from "react";

class Done extends Component {
  static get title() {
    return "Done";
  }
  static get id() {
    return "done";
  }

  handleClose = e => {
    e.preventDefault();
    this.props.onClose();
  };

  renderButtons() {
    return (
      <div className="brz-ed-form-apps__finish-button">
        <button
          onClick={this.handleClose}
          className="brz-button brz-ed-btn brz-ed-btn-rounded brz-ed-btn-width-1 brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-teal"
        >
          <span className="brz-span">Done</span>
        </button>
      </div>
    );
  }

  render() {
    const { title } = this.props;

    return (
      <div className="brz-ed-form-apps__finish">
        <div className="brz-ed-form-apps__finish-icon">
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
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                d="M13.423 6.999A6.5 6.5 0 1 1 10 2.232"
                datacap="butt"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                datacap="butt"
                datacolor="color-2"
                d="M4 6.5l3 3 8-8"
              />
            </g>
          </svg>
        </div>
        <div className="brz-ed-form-apps__finish-content">
          <p className="brz-p">
            You have successfully connect the form with {title}
          </p>
        </div>
      </div>
    );
  }
}

export default Done;
