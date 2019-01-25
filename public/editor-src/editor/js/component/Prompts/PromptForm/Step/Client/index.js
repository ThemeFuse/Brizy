import React, { Component } from "react";
import { Context } from "../../Context";
import { updateIntegration, fakeLoading } from "../../utils";
import ViewClient from "./ViewClient";

/**
 * @info
 * Client => Represent Folder from backend
 * */

class Client extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);

    this.state = {
      active: this.getActiveClient(context.app.data),
      nextLoading: false,
      prevLoading: false
    };
  }

  getActiveClient(app) {
    const { usedAccount, accounts } = app;
    const { folders } = accounts.find(({ id }) => id == usedAccount);
    const useFirsFolder = folders.length ? folders[0].id : "";

    return app.usedFolder || useFirsFolder;
  }

  handleActive = active => {
    this.setState({
      active
    });
  };

  handleNext = async () => {
    const {
      app: { data },
      formId,
      onChange
    } = this.context;

    const { active } = this.state;

    this.setState({
      nextLoading: true
    });

    if (active !== data.usedFolder) {
      const integrationData = await updateIntegration({
        appId: data.id,
        formId,
        body: {
          ...data,
          usedFolder: active
        }
      });

      onChange(data.id, { data: { ...data, ...integrationData } });
    } else {
      // Emitted fake request
      await fakeLoading();
    }

    this.props.onChangeNext();
  };

  handlePrev = async prev => {
    this.setState({
      prevLoading: true
    });

    // Emitted fake request
    await fakeLoading();

    if (prev && typeof prev === "string") {
      this.context.onChangePrev(prev);
    } else {
      this.context.onChangePrev();
    }
  };

  render() {
    const { app } = this.context;

    return (
      <ViewClient
        {...app}
        {...this.state}
        handleActive={this.handleActive}
        handlePrev={this.handlePrev}
        handleNext={this.handleNext}
      />
    );
  }
}

export default Client;
