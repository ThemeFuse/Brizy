import React, { Component } from "react";
import { Provider } from "react-redux";
import { readPageData } from "visual/bootstraps/common/adapter";
import getMiddleware from "visual/bootstraps/editor/utils/middleware";
import { hydrate } from "visual/redux/actions";
import { editorRendered } from "visual/redux/actions";
import { updateConfigId } from "visual/redux/actions2";
import { Store, createStore } from "visual/redux/store";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import { getAuthorized } from "visual/utils/user/getAuthorized";
import { Props } from "./types";

class InitStore extends Component<Props> {
  private readonly store: Store;

  constructor(props: Props) {
    super(props);
    const { configId, renderType } = props;
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

    const { isSyncAllowed = false } = config.cloud || {};

    const store = createStore({
      middleware: getMiddleware(config, renderType)
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
        configId
      })
    );

    if (typeof window !== "undefined") {
      // think about putting it only in development mode later
      window.brzStore = store;
      window.parent.brzStore = store;
    }

    // For External API
    config.onUpdate = (res) => {
      store.dispatch({
        type: "PUBLISH",
        payload: {
          status: store.getState().page.status,
          type: "external",
          res
        }
      });
    };
    this.store = store;
  }

  componentDidMount() {
    // @ts-expect-error: Actions types to ts
    this.store.dispatch(editorRendered());
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { configId: prevConfigId } = prevProps;
    const { configId } = this.props;

    if (prevConfigId !== configId) {
      this.store.dispatch(updateConfigId(configId));
    }
  }

  render() {
    return <Provider store={this.store}>{this.props.children}</Provider>;
  }
}

export { InitStore };
