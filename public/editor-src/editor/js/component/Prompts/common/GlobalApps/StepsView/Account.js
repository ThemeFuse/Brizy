import React, { Component } from "react";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import Button from "../../Button";
import { substrString } from "../../utils";

class Account extends Component {
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
    connectLoading: false,
    disconnectLoading: false,
    onActive: _.noop,
    onPrev: _.noop,
    onNext: _.noop,
    onConnect: _.noop,
    onDisconnect: _.noop
  };

  renderOptions() {
    const {
      active,
      data: { accounts, usedAccount, completed },
      disconnectLoading,
      onActive,
      onDisconnect
    } = this.props;
    const options = accounts.map(({ name, id }) => (
      <RadioItem value={id} key={id}>
        {name ? substrString(name) : `Account ${id}`}
        {id === usedAccount && completed && (
          <div
            title="Disconnect"
            className="brz-ed-popup-integrations-account--delete"
            onClick={onDisconnect}
          >
            <EditorIcon
              icon={disconnectLoading ? "nc-circle-02" : "nc-lock"}
              className={disconnectLoading ? "brz-ed-animated--spin" : ""}
            />
          </div>
        )}
      </RadioItem>
    ));

    return (
      <ScrollPane
        style={{ maxHeight: 205 }}
        className="brz-ed-scroll-pane brz-ed-popup-integrations__scroll-pane"
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

  renderError() {
    const {
      error,
      data: { accounts }
    } = this.props;

    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">
          {accounts.length === 0 &&
            "Accounts are empty. Please connect a new account and try again."}
          {error}
        </span>
      </div>
    );
  }

  render() {
    const {
      data: { accounts },
      error,
      nextLoading,
      prevLoading,
      connectLoading,
      onConnect,
      onPrev,
      onNext
    } = this.props;
    const hasAccounts = accounts.length > 0;

    return (
      <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__account">
        {(!hasAccounts || error) && this.renderError()}
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">SELECT ACCOUNT</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {hasAccounts && this.renderOptions()}
          <div
            className="brz-ed-popup-integrations-new__option"
            onClick={onConnect}
          >
            <EditorIcon
              icon={connectLoading ? "nc-circle-02" : "nc-add"}
              className={connectLoading ? "brz-ed-animated--spin" : ""}
            />
            Connect a new account
          </div>
          <div className="brz-ed-popup-integrations-step__buttons">
            <Button
              type="gray"
              leftIcon="nc-arrow-left"
              loading={prevLoading}
              onClick={onPrev}
            >
              Back
            </Button>
            <Button
              type="tail"
              rightIcon="nc-arrow-right"
              loading={nextLoading}
              onClick={onNext}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
