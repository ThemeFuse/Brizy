import { noop } from "es-toolkit";
import React, { Component } from "react";
import { ConnectAccount } from "./ConnectAccount";
import { RadioItem } from "./Radio/RadioItem";

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
      data: { accounts, usedAccount, completed },
      disconnectLoading,
      onDisconnect
    } = this.props;

    return accounts.map(({ name, id, title }) => (
      <RadioItem
        key={id}
        accountName={name}
        value={id}
        isCompleted={!!(id === usedAccount && completed)}
        disconnectLoading={disconnectLoading}
        onDisconnect={onDisconnect}
        title={title}
      />
    ));
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
      onNext,
      active,
      onActive
    } = this.props;
    const hasAccounts = accounts.length > 0;

    return (
      <ConnectAccount
        error={error}
        options={this.renderOptions()}
        hasAccounts={hasAccounts}
        onConnect={onConnect}
        connectLoading={connectLoading}
        prevLoading={prevLoading}
        onPrev={onPrev}
        nextLoading={nextLoading}
        onNext={onNext}
        active={active}
        onActive={onActive}
      />
    );
  }
}

export default Account;
