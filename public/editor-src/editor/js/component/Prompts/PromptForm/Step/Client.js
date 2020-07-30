import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import { updateIntegration } from "../api";
import { Context } from "../../common/GlobalApps/Context";
import { RadioFields } from "../../common/GlobalApps/StepsView";
import { pendingRequest } from "visual/utils/api/editor";

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
    const { usedFolder, folders } = app;
    const useFirsFolder = folders.length ? folders[0].id : "";

    return usedFolder || useFirsFolder;
  }

  handleActive = active => {
    this.setState({
      active
    });
  };

  handleNext = async () => {
    const {
      app: { id, data: appData },
      formId,
      onChange,
      onChangeNext
    } = this.context;

    const { active } = this.state;

    this.setState({
      nextLoading: true,
      error: null
    });

    if (active !== appData.usedFolder) {
      const { status, data } = await updateIntegration({
        ...appData,
        formId,
        usedFolder: active
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: t("Something went wrong")
        });
      } else {
        onChange(id, { ...appData, ...data });
        onChangeNext();
      }
    } else {
      // Emitted fake request
      await pendingRequest();
      onChangeNext();
    }
  };

  handlePrev = async prev => {
    this.setState({
      prevLoading: true,
      error: null
    });

    // Emitted fake request
    await pendingRequest();

    if (prev && typeof prev === "string") {
      this.context.onChangePrev(prev);
    } else {
      this.context.onChangePrev();
    }
  };

  render() {
    const { app } = this.context;
    const { folders, accountPro } = app.data;

    return (
      <RadioFields
        {...this.state}
        listPro={accountPro}
        lists={folders}
        onActive={this.handleActive}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    );
  }
}

export default Client;
