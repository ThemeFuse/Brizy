import React, { Component } from "react";
import { t } from "visual/utils/i18n";
import {
  getIntegrationLists,
  getIntegrationListApiKeys,
  updateIntegration,
  createIntegrationList
} from "../../api";
import { Context } from "../../../common/GlobalApps/Context";
import { RadioFields } from "../../../common/GlobalApps/StepsView";
import { fakeRequest } from "../../../common/utils";
import CreateList from "./CreateList";

const getError = (type, app) => {
  if (type === "server") {
    return t("List are not created please connect the support");
  }

  const {
    data: { accountPro, lists },
    title
  } = app;

  if (accountPro) {
    return `Please upgrade your ${title} account to access your lists`;
  } else if (lists.length === 0) {
    return t("Lists are empty. Please add a new list and try again.");
  }
};

class List extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);

    const { data } = context.app;

    this.state = {
      active: this.getActiveList(data),
      apiKeyValue: this.getApiKeyValue(data),
      mode: "view",
      error: getError("application", context.app),
      createLoading: false,
      prevLoading: false,
      nextLoading: false
    };
  }

  static async onBeforeLoad(context) {
    const {
      app: { data: appData },
      formId,
      onChange
    } = context;
    let { status, data } = await getIntegrationLists({
      appId: appData.id,
      formId
    });
    let accountPro = false;
    let listApiKeys = [];

    if (status !== 200) {
      if (status === 403) {
        accountPro = true;
      }

      data = [];
    } else {
      const { status, data } = await getIntegrationListApiKeys({
        appId: appData.id,
        formId
      });

      if (status === 200) {
        listApiKeys = data;
      }
    }

    onChange(appData.id, { ...appData, lists: data, listApiKeys, accountPro });
  }

  getActiveList(app) {
    const usedList = app.lists.find(({ id }) => id === app.usedList) || {};
    const list = app.lists.length ? app.lists[0].id : "";

    return usedList.id || list;
  }

  getApiKeyValue(data) {
    return data.listApiKeys.reduce(
      (acc, { name }) => ({ ...acc, [`${name}`]: "" }),
      {}
    );
  }

  handleActive = active => {
    this.setState({
      active
    });
  };

  handleKeysChange = (type, value) => {
    this.setState(state => ({
      apiKeyValue: {
        ...state.apiKeyValue,
        [`${type}`]: value
      }
    }));
  };

  handleConfirm = async confirmed => {
    const {
      app: { data: appData },
      formId,
      onChange
    } = this.context;

    const { status, data } = await updateIntegration({
      appId: appData.id,
      formId,
      body: {
        ...appData,
        confirmationNeeded: confirmed
      }
    });

    if (status !== 200) {
      this.setState({
        error: t("Something went wrong")
      });
    } else {
      onChange(appData.id, { ...appData, ...data });
    }
  };

  handleCreateMode = async () => {
    this.setState({
      createLoading: true
    });

    // Emitted fake request
    await fakeRequest();

    this.setState({
      mode: "create",
      createLoading: false,
      error: null
    });
  };

  handleViewMode = async () => {
    this.setState({
      prevLoading: true,
      error: null
    });

    // Emitted fake request
    await fakeRequest();

    this.setState({
      prevLoading: false,
      mode: "view"
    });
  };

  handleCreateList = async () => {
    const {
      app: { data: appData },
      formId,
      onChange
    } = this.context;
    const { apiKeyValue } = this.state;
    const keysValue = Object.values(apiKeyValue);

    this.setState({
      nextLoading: true,
      error: null
    });

    if (!keysValue.some(key => !key)) {
      const { status, data } = await createIntegrationList({
        appId: appData.id,
        formId,
        body: apiKeyValue
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: getError("server")
        });
      } else {
        onChange(appData.id, { ...appData, lists: [...appData.lists, data] });

        this.setState({
          active: data.id,
          apiKeyValue: this.getApiKeyValue(appData),
          mode: "view",
          nextLoading: false,
          error: null
        });
      }
    } else {
      // Emitted fake request
      await fakeRequest();

      this.setState({
        nextLoading: false,
        error: t("All fields cannot be empty")
      });
    }
  };

  handleNext = async () => {
    const {
      app: { data: appData },
      formId,
      onChange,
      onChangeNext
    } = this.context;
    const { active } = this.state;

    this.setState({
      nextLoading: true,
      error: null
    });

    if (active !== appData.usedList) {
      const { status, data } = await updateIntegration({
        appId: appData.id,
        formId,
        body: {
          ...appData,
          usedList: active
        }
      });

      if (status !== 200) {
        this.setState({
          nextLoading: false,
          error: t("Something went wrong")
        });
      } else {
        onChange(appData.id, { ...appData, ...data });
        onChangeNext();
      }
    } else {
      // Emitted fake request
      await fakeRequest();

      onChangeNext();
    }
  };

  handlePrev = async () => {
    this.setState({
      prevLoading: true,
      error: null
    });

    // Emitted fake request
    await fakeRequest();

    this.context.onChangePrev();
  };

  render() {
    const { app } = this.context;
    const {
      lists,
      listApiKeys,
      hasConfirmation,
      accountPro,
      confirmationNeeded
    } = app.data;

    return this.state.mode === "view" ? (
      <RadioFields
        {...this.state}
        lists={lists}
        listsCreate={listApiKeys}
        listPro={accountPro}
        hasConfirmation={hasConfirmation}
        confirmationNeeded={confirmationNeeded}
        onActive={this.handleActive}
        onConfirm={this.handleConfirm}
        onCreateList={this.handleCreateMode}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    ) : (
      <CreateList
        {...this.state}
        listsCreate={listApiKeys}
        onChange={this.handleKeysChange}
        onPrev={this.handleViewMode}
        onNext={this.handleCreateList}
      />
    );
  }
}

export default List;
