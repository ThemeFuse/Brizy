import React, { Component } from "react";
import Button from "../../Components/Button";

class ViewConnect extends Component {
  static defaultProps = {
    img: "",
    title: "",
    description: "",
    nextLoading: false
  };

  render() {
    const {
      img,
      title,
      description,
      nextLoading,
      handleNext,
      handlePrev
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations__connect brz-ed-popup-integrations__connect-auth">
        <div className="brz-ed-popup-integrations__connect-head">
          <img className="brz-img" src={img} title={title} />
          <p className="brz-p">{description}</p>
        </div>
        <div className="brz-ed-popup-integrations__connect-body">
          <Button type="tail" loading={nextLoading} onClick={handleNext}>
            Connect
          </Button>
          <Button type="default" onClick={handlePrev}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default ViewConnect;
