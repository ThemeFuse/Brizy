import { noop } from "es-toolkit";
import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { Button } from "../../Button";

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
    onActive: noop,
    onPrev: noop,
    onNext: noop,
    onConnect: noop,
    onDisconnect: noop
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
        {name ? name : `Account ${id}`}
        {id === usedAccount && completed && (
          <div
            title={t("Disconnect")}
            className="brz-ed-popup-integrations--delete"
            onClick={onDisconnect}
          >
            <EditorIcon
              icon={disconnectLoading ? "nc-circle-02" : "nc-connection"}
              className={disconnectLoading ? "brz-ed-animated--spin" : ""}
            />
          </div>
        )}
      </RadioItem>
    ));

    return (
      <Scrollbars
        autoHeight={true}
        autoHeightMax="100%"
        style={{ height: "auto" }}
      >
        <Radio
          className="brz-ed-popup-integrations-option__radio"
          name="list"
          defaultValue={active}
          onChange={onActive}
        >
          {options}
        </Radio>
      </Scrollbars>
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
            t(
              "Accounts are empty. Please connect a new account and try again."
            )}
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
        <div className="brz-ed-popup-integrations-step__head">
          <p className="brz-p">
            <strong className="brz-strong">{t("SELECT ACCOUNT")}</strong>
          </p>
        </div>
        <div className="brz-ed-popup-integrations-step__body">
          {(!hasAccounts || error) && this.renderError()}
          {hasAccounts && this.renderOptions()}
          <div
            className="brz-ed-popup-integrations-new__option"
            onClick={onConnect}
          >
            <EditorIcon
              icon={connectLoading ? "nc-circle-02" : "nc-add"}
              className={connectLoading ? "brz-ed-animated--spin" : ""}
            />
            {t("Connect a new account")}
          </div>
          <div className="brz-ed-popup-integrations-step__buttons">
            <Button
              size={3}
              leftIcon="nc-arrow-left"
              loading={prevLoading}
              onClick={onPrev}
            >
              {t("Back")}
            </Button>
            <Button
              color="teal"
              rightIcon="nc-arrow-right"
              loading={nextLoading}
              onClick={onNext}
            >
              {t("Continue")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
