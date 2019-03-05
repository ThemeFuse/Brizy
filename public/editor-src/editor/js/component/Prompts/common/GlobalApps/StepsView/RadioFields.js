import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import Button from "../../Button";
import { substrString } from "../../utils";

class RadioFields extends Component {
  static defaultProps = {
    id: "",
    title: "",
    shortTitle: "",
    description: "",
    img: "",
    active: "",
    lists: [],
    listApiKeys: [],
    apiKeyValue: {},
    pro: false,
    hasConfirmation: false,
    createLoading: false,
    confirmationNeeded: false,
    nextLoading: null,
    prevLoading: null,
    error: null,
    onActive: _.noop,
    onConfirm: _.noop,
    onCreateList: _.noop,
    onPrev: _.noop,
    onNext: _.noop
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
      lists,
      listApiKeys,
      hasConfirmation,
      onActive
    } = this.props;
    const hasApiKeys = listApiKeys && listApiKeys.length > 0;
    const className = classnames(
      "brz-ed-scroll-pane brz-ed-popup-integrations__scroll-pane",
      { "brz-ed-popup-integrations__scroll-pane--big": hasConfirmation },
      { "brz-ed-popup-integrations__scroll-pane--small": !hasApiKeys }
    );
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
        className={className}
      >
        <Radio
          className="brz-ed-popup-integrations-option__radio"
          name="list"
          defaultValue={active}
          onChange={onActive}
        >
          {options}
        </Radio>
      </ScrollPane>
    );
  }

  renderConfirmation() {
    const { confirmationNeeded, onConfirm } = this.props;

    return (
      <div className="brz-ed-popup-integrations__confirmation">
        <p className="brz-p">Email confirmation to join the list</p>
        <Select
          defaultValue={confirmationNeeded}
          className="brz-control__select--white"
          maxItems="6"
          itemHeight="30"
          onChange={onConfirm}
        >
          <SelectItem value={false}>Not Required</SelectItem>
          <SelectItem value={true}>Required</SelectItem>
        </Select>
      </div>
    );
  }

  renderCreateList() {
    const { createLoading, onCreateList } = this.props;

    return (
      <div
        className="brz-ed-popup-integrations-new__option"
        onClick={onCreateList}
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
      lists,
      listApiKeys,
      hasConfirmation,
      pro,
      error,
      nextLoading,
      prevLoading,
      onPrev,
      onNext
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
          {pro && this.renderProList()}
          {hasApiKeys && this.renderCreateList()}
          {hasConfirmation && this.renderConfirmation()}

          <div className="brz-ed-popup-integrations-step__buttons">
            {prevLoading !== null && (
              <Button
                type="gray"
                leftIcon="nc-arrow-left"
                loading={prevLoading}
                onClick={onPrev}
              >
                Back
              </Button>
            )}
            {nextLoading !== null && (
              <Button
                type={hasLists || pro ? "tail" : "gray"}
                rightIcon="nc-arrow-right"
                loading={nextLoading}
                onClick={hasLists || pro ? onNext : null}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default RadioFields;
