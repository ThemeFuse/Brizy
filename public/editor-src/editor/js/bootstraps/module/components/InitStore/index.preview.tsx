import React, { Component } from "react";
import { Provider } from "react-redux";
import { readPageData } from "visual/bootstraps/common/adapter";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { editorRendered, hydrate } from "visual/redux/actions";
import { Store, createStore } from "visual/redux/store";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import { getAuthorized } from "visual/utils/user/getAuthorized";
import { getMiddleware } from "./getMiddleware";
import { Props } from "./types";

class InitStore extends Component<Props> {
  private readonly store: Store;

  getConfig: GetConfig = () => this.props.config;

  constructor(props: Props) {
    super(props);
    const { editorMode, config } = props;
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
      middleware: getMiddleware({ editorMode, getConfig: this.getConfig })
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
        editorMode
      })
    );

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
