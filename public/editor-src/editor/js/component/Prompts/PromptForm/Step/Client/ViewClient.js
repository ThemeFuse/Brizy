import React, { Component } from "react";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import Button from "../../Components/Button";
import { substrString } from "../../utils";

class ViewClient extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    form: {},
    data: {},
    active: "",
    nextLoading: false,
    prevLoading: false,
    handleActive: _.noop,
    handlePrev: _.noop,
    handleNext: _.noop
  };

  renderOptions() {
    const {
      active,
      data: { accounts, usedAccount },
      handleActive
    } = this.props;
    const { folders } = accounts.find(({ id }) => id === usedAccount);
    const options = folders.map(({ name, id }) => (
      <RadioItem value={id} key={id}>
        {name ? substrString(name) : `Folder ${id}`}
      </RadioItem>
    ));

    return (
      <ScrollPane
        style={{ maxHeight: 205 }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations__scroll-pane"
      >
        <Radio
          className="brz-ed-popup-integrations-option__radio"
          name="folder"
          defaultValue={active}
          onChange={handleActive}
        >
          {options}
        </Radio>
      </ScrollPane>
    );
  }

  render() {
    const { nextLoading, prevLoading, handlePrev, handleNext } = this.props;

    return (
      <div className="brz-ed-popup-integrations-step">
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">SELECT CLIENT</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {this.renderOptions()}
          <div className="brz-ed-popup-integrations-step__buttons">
            <Button
              type="gray"
              leftIcon="nc-arrow-left"
              loading={prevLoading}
              onClick={handlePrev}
            >
              Back
            </Button>
            <Button
              type="tail"
              rightIcon="nc-arrow-right"
              loading={nextLoading}
              onClick={handleNext}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewClient;
