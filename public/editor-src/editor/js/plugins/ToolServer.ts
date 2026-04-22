/**
 * Wraps BrizyToolServer behind IToolServer interface.
 * Creates the page and project repositories and tool server internally from Redux state.
 */
import { createBrizyToolServer } from "visual/ai/adapters/brizy-tool-server";
import type {
  IToolServer,
  ToolCallRequest
} from "visual/ai/application/interfaces/i-tool-server";
import type {
  ToolDefinition,
  ToolExecutionResponse
} from "visual/ai/entities/models";
import { createPageRepository } from "visual/ai/infrastructure/repositories/page.repository";
import { createProjectRepository } from "visual/ai/infrastructure/repositories/project.repository";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { ISharedStore } from "./SharedStore";

export class ToolServerImpl implements IToolServer {
  private readonly server: IToolServer;

  constructor(
    getState: () => ReduxState,
    dispatch: TypedDispatch,
    config: ConfigCommon,
    store: ISharedStore
  ) {
    const pageRepository = createPageRepository(getState, dispatch, config);
    const projectRepository = createProjectRepository(
      getState,
      dispatch,
      config
    );
    this.server = createBrizyToolServer(
      pageRepository,
      projectRepository,
      store
    );
  }

  listTools(): ToolDefinition[] {
    return this.server.listTools();
  }

  callTool(request: ToolCallRequest): Promise<ToolExecutionResponse> {
    return this.server.callTool(request);
  }
}
