import React, { Component } from "react";
import { Provider } from "react-redux";
import { readPageData } from "visual/bootstraps/common/adapter";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { editorRendered, hydrate } from "visual/redux/actions";
import { Store, createStore } from "visual/redux/store";
import { makeVariablesColor } from "visual/utils/cssVariables";
import { addFilter } from "visual/utils/filters";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import { getAuthorized } from "visual/utils/user/getAuthorized";
import { getMiddleware } from "./getMiddleware";
import { Props } from "./types";
import { waitForPendingAndDispatch } from "./utils";

class InitStore extends Component<Props> {
  private readonly store: Store;
  private unsubscribeFunctions: VoidFunction[] = [];

  getConfig: GetConfig = () => this.props.config;

  constructor(props: Props) {
    super(props);
    const config = props.config;
    const _page = config.pageData;
    const project = config.projectData;
    const projectStatus = config.project?.status;

    if (!_page) {
      throw new Error("Missing page in config");
    }

    if (!project || !project.data) {
      throw new Error("Missing project data in config");
    }

    const { editorMode } = props;

    const { isSyncAllowed = false } = config.cloud || {};

    const store = createStore({
      middleware: getMiddleware({
        editorMode,
        getConfig: this.getConfig
      })
    });
    const page = readPageData(_page);
    const globalBlocks = parseGlobalBlocksToRecord(config.globalBlocks) ?? {};
    const { fonts } = project.data;

    store.dispatch(
      // @ts-expect-error: to ts
      hydrate({
        project,
        projectStatus,
        page,
        globalBlocks,
        fonts,
        authorized: getAuthorized(config),
        syncAllowed: isSyncAllowed,
        config,
        editorMode,
        symbols: config.symbols
      })
    );

    if (typeof window !== "undefined") {
      // think about putting it only in development mode later
      window.brzStore = store;
      window.parent.brzStore = store;
    }

    // For External API
    config.onUpdate = (res) => {
      const unsubscribe = waitForPendingAndDispatch(
        "external",
        store,
        res,
        editorMode,
        config
      );
      if (unsubscribe) {
        this.unsubscribeFunctions.push(unsubscribe);
      }
    };

    // For External API
    config.onCompile = (res) => {
      const unsubscribe = waitForPendingAndDispatch(
        "externalForce",
        store,
        res,
        editorMode,
        config
      );
      if (unsubscribe) {
        this.unsubscribeFunctions.push(unsubscribe);
      }
    };

    // Add the getConfig filter to retrieve the configuration
    config.onChangeTheme = ({ colors }) => {
      const themeVars = makeVariablesColor(colors);

      const existingStyle = document.getElementById("themeVariables");
      if (existingStyle) {
        existingStyle.remove();
      }

      if (themeVars) {
        const configVariables = document.createElement("style");
        configVariables.setAttribute("type", "text/css");
        configVariables.setAttribute("rel", "stylesheet");
        configVariables.setAttribute("id", "themeVariables");
        configVariables.textContent = themeVars;

        document.head.appendChild(configVariables);

        if (window.parent && window.parent.document && window.parent !== window) {
          const parentExistingStyle =
            window.parent.document.getElementById("themeVariables");
          if (parentExistingStyle) {
            parentExistingStyle.remove();
          }

          const parentHead = window.parent.document.head;
          if (parentHead) {
            parentHead.appendChild(configVariables.cloneNode(true));
          }
        }
      }
    };

    addFilter("getConfig", () => config);
    this.store = store;
  }

  componentDidMount() {
    // @ts-expect-error: Actions types to ts
    this.store.dispatch(editorRendered());
  }

  componentWillUnmount() {
    // Clean up all subscriptions to prevent memory leaks
    this.unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    this.unsubscribeFunctions = [];
  }

  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

export { InitStore };
