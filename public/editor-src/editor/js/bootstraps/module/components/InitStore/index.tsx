import React, { Component } from "react";
import { Provider } from "react-redux";
import { readPageData } from "visual/bootstraps/common/adapter";
import { PublishData } from "visual/global/Config/types/configs/ConfigCommon";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { editorRendered, hydrate } from "visual/redux/actions";
import { fetchPageSuccess } from "visual/redux/actions2";
import { Store, createStore } from "visual/redux/store";
import { addFilter } from "visual/utils/filters";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import { getAuthorized } from "visual/utils/user/getAuthorized";
import { getMiddleware } from "./getMiddleware";
import { Props } from "./types";

class InitStore extends Component<Props> {
  private readonly store: Store;

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
      const onDone = (r: PublishData) => {
        store.dispatch(fetchPageSuccess());
        res(r);
      };

      store.dispatch({
        type: "PUBLISH",
        payload: {
          status: store.getState().page.status,
          type: "external",
          editorMode: this.props.editorMode,
          config,
          res: onDone
        }
      });
    };

    // For External API
    config.onCompile = (res) => {
      const onDone = (r: PublishData) => {
        store.dispatch(fetchPageSuccess());
        res(r);
      };

      store.dispatch({
        type: "PUBLISH",
        payload: {
          status: store.getState().page.status,
          type: "externalForce",
          editorMode: this.props.editorMode,
          config,
          res: onDone
        }
      });
    };

    // Add the getConfig filter to retrieve the configuration
    addFilter("getConfig", () => config);
    this.store = store;
  }

  componentDidMount() {
    // @ts-expect-error: Actions types to ts
    this.store.dispatch(editorRendered());
  }

  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

export { InitStore };
