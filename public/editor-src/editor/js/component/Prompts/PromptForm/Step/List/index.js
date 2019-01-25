import React, { Component } from "react";
import {
  fakeLoading,
  getIntegrationLists,
  getIntegrationListApiKeys,
  updateIntegration,
  createIntegrationList
} from "../../utils";
import { Context } from "../../Context";
import ViewList from "./ViewList";
import CreateList from "./CreateList";

const getError = (type, app) => {
  if (type === "server") {
    return "List are not created please connect the support";
  }

  const {
    data: { accountPro, lists },
    title
  } = app;

  if (accountPro) {
    return `Please upgrade your ${title} account to access your lists`;
  } else if (lists.length === 0) {
    return "Lists are empty. Please add a new list and try again.";
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
      app: { data },
      formId,
      onChange
    } = context;
    let lists = await getIntegrationLists({
      appId: data.id,
      formId
    });
    let accountPro = false;
    let listApiKeys = [];

    if (lists.code && lists.code !== 200) {
      if (lists.code === 403) {
        accountPro = true;
      }

      lists = [];
    } else {
      listApiKeys = await getIntegrationListApiKeys({
        appId: data.id,
        formId
      });
    }

    onChange(data.id, {
      data: {
        ...data,
        lists,
        listApiKeys,
        accountPro
      }
    });
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
      app: { data },
      formId,
      onChange
    } = this.context;

    const integrationData = await updateIntegration({
      appId: data.id,
      formId,
      body: {
        ...data,
        confirmationNeeded: confirmed
      }
    });

    onChange(data.id, {
      data: {
        ...data,
        ...integrationData
      }
    });
  };

  handleCreateMode = async () => {
    this.setState({
      createLoading: true
    });

    // Emitted fake request
    await fakeLoading();

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
    await fakeLoading();

    this.setState({
      prevLoading: false,
      mode: "view"
    });
  };

  handleCreateList = async () => {
    const {
      app: { data },
      formId,
      onChange
    } = this.context;
    const { apiKeyValue } = this.state;
    const keysValue = Object.values(apiKeyValue);

    this.setState({
      error: null,
      nextLoading: true
    });

    if (!keysValue.some(key => !key)) {
      const integrationData = await createIntegrationList({
        appId: data.id,
        formId,
        body: apiKeyValue
      });

      if (integrationData.code && integrationData.code !== 200) {
        this.setState({
          error: getError("server"),
          nextLoading: false
        });
      } else {
        onChange(data.id, {
          data: {
            ...data,
            lists: [...data.lists, integrationData]
          }
        });

        this.setState({
          active: integrationData.id,
          apiKeyValue: this.getApiKeyValue(data),
          mode: "view",
          nextLoading: false,
          error: null
        });
      }
    } else {
      // Emitted fake request
      await fakeLoading();

      this.setState({
        error: "All fields cannot be empty",
        nextLoading: false
      });
    }
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

    if (active !== data.usedList) {
      const integrationData = await updateIntegration({
        appId: data.id,
        formId,
        body: {
          ...data,
          usedList: active
        }
      });

      onChange(data.id, {
        data: {
          ...data,
          ...integrationData
        }
      });
    } else {
      // Emitted fake request
      await fakeLoading();
    }

    this.props.onChangeNext();
  };

  handlePrev = async () => {
    this.setState({
      prevLoading: true
    });

    // Emitted fake request
    await fakeLoading();

    this.context.onChangePrev();
  };

  render() {
    const { app } = this.context;

    return this.state.mode === "view" ? (
      <ViewList
        {...app}
        {...this.state}
        handleActive={this.handleActive}
        handleConfirm={this.handleConfirm}
        handleCreateList={this.handleCreateMode}
        handlePrev={this.handlePrev}
        handleNext={this.handleNext}
      />
    ) : (
      <CreateList
        {...app}
        {...this.state}
        handleChange={this.handleKeysChange}
        handlePrev={this.handleViewMode}
        handleNext={this.handleCreateList}
      />
    );
  }
}

export default List;
