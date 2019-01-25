import React, { Component } from "react";
import { Context } from "../../Context";
import { getAuthIntegrationUrl, getIntegration } from "../../utils";

class AuthConnect extends Component {
  static contextType = Context;

  static async onBeforeLoad(context, props) {
    const { account, accounts } = context.app;

    if ((account && account.id) || (accounts && accounts.length)) {
      props.onChangeNext();
    }
  }

  state = {
    nextLoading: false
  };

  handleConnect = async event => {
    event.preventDefault();

    this.setState({
      nextLoading: true
    });

    const { app, formId } = this.context;
    const url = await getAuthIntegrationUrl({ appId: app.id, formId });

    const makeUrl = () => url;
    const makeDimensions = () => {
      const windowWidth = 600;
      const windowHeight = 600;
      const left = screen.width / 2 - windowWidth / 2;
      const top = 100;

      return `width=${windowWidth},height=${windowHeight},top=${top},left=${left}`;
    };

    const win = window.open(makeUrl(), "", makeDimensions());
    const timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        this.handleNext();
      }
    }, 500);
  };

  handlePrev = () => {
    this.props.onChangePrev();
  };

  async handleNext() {
    const { app, formId, onChange } = this.context;
    const integrationData = await getIntegration({ appId: app.id, formId });

    onChange(app.id, { ...app, ...integrationData });
    this.props.onChangeNext();
  }

  render() {
    const { app } = this.context;
    const { nextLoading } = this.state;

    return (
      <ViewConnect
        {...app}
        nextLoading={nextLoading}
        handlePrev={this.handlePrev}
        handleNext={this.handleConnect}
      />
    );
  }
}

export default AuthConnect;
