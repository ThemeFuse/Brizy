import React, { Component } from "react";
import _ from "underscore";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import Button from "../../Components/Button";
import { substrString } from "../../utils";

class ViewList extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    form: {},
    data: {},
    active: "",
    apiKeyValue: {},
    createLoading: false,
    nextLoading: false,
    prevLoading: false,
    handleActive: _.noop,
    handleConfirm: _.noop,
    handleCreateList: _.noop,
    handlePrev: _.noop,
    handleNext: _.noop
  };

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">{this.props.error}</span>
      </div>
    );
  }

  renderList() {
    const {
      active,
      data: { lists, hasConfirmation },
      handleActive
    } = this.props;
    const options = lists.map(({ name, id }) => {
      return (
        <RadioItem value={id} key={id}>
          {name ? substrString(name) : `List ${id}`}
        </RadioItem>
      );
    });

    return (
      <ScrollPane
        style={{ maxHeight: hasConfirmation ? 203 : 255 }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations__scroll-pane"
      >
        <Radio
          className="brz-ed-popup-integrations-option__radio"
          name="list"
          defaultValue={active}
          onChange={handleActive}
        >
          {options}
        </Radio>
      </ScrollPane>
    );
  }

  renderConfirmation() {
    const {
      data: { confirmationNeeded },
      handleConfirm
    } = this.props;

    return (
      <div className="brz-ed-popup-integrations__confirmation">
        <p className="brz-p">Email confirmation to join the list</p>
        <Select
          defaultValue={confirmationNeeded}
          className="brz-control__select--white"
          maxItems="6"
          itemHeight="30"
          onChange={handleConfirm}
        >
          <SelectItem value={false}>Not Required</SelectItem>
          <SelectItem value={true}>Required</SelectItem>
        </Select>
      </div>
    );
  }

  renderCreateList() {
    const { createLoading, handleCreateList } = this.props;

    return (
      <div
        className="brz-ed-popup-integrations-new__option"
        onClick={handleCreateList}
      >
        <EditorIcon
          icon={createLoading ? "nc-circle-02" : "nc-add"}
          className={createLoading ? "brz-ed-animated--spin" : ""}
        />
        Create a new list
      </div>
    );
  }

  renderProList() {
    // Render e fake List

    return (
      <Radio
        className="brz-ed-popup-integrations-option__radio"
        name="proList"
        defaultValue="none"
      >
        <RadioItem value="none">None</RadioItem>
      </Radio>
    );
  }

  render() {
    const {
      data: { lists, listApiKeys, hasConfirmation, accountPro },
      error,
      nextLoading,
      prevLoading,
      handlePrev,
      handleNext
    } = this.props;
    const hasLists = lists.length > 0;
    const hasApiKeys = listApiKeys && listApiKeys.length > 0;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__lists">
        {error && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">SELECT LIST</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {hasLists && this.renderList()}
          {accountPro && this.renderProList()}
          {hasApiKeys && this.renderCreateList()}
          {hasConfirmation && this.renderConfirmation()}

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
              type={hasLists || accountPro ? "tail" : "gray"}
              rightIcon="nc-arrow-right"
              loading={nextLoading}
              onClick={hasLists || accountPro ? handleNext : null}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewList;
