import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../application/interfaces/i-project-repository";
import type {
  IToolServer,
  ToolCallRequest
} from "../application/interfaces/i-tool-server";
import type {
  ToolDefinition,
  ToolExecutionResponse,
  ToolHandler
} from "../entities/models";
import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "./tool-registry";

/**
 * Brizy Tool Server
 *
 * Implements IToolServer by combining tool definitions and handlers.
 * The editor acts as the "server" that owns the tool catalog
 * and executes tool calls on behalf of the AI chat "client".
 */
export class BrizyToolServer implements IToolServer {
  private readonly definitions: ToolDefinition[];
  private readonly handlers: Record<string, ToolHandler>;

  constructor(
    pageRepository: IPageRepository,
    projectRepository: IProjectRepository,
    store: ISharedStore
  ) {
    this.definitions = getBrizyToolDefinitions();
    this.handlers = createBrizyToolHandlers(
      pageRepository,
      projectRepository,
      store
    );
  }

  listTools(): ToolDefinition[] {
    return this.definitions;
  }

  async callTool(request: ToolCallRequest): Promise<ToolExecutionResponse> {
    const handler = this.handlers[request.name];

    if (!handler) {
      return {
        requestId: "",
        success: false,
        error: `Unknown tool: ${request.name}`,
        duration: 0
      };
    }

    const startTime = performance.now();

    try {
      const result = await handler(request.arguments);
      const duration = performance.now() - startTime;

      return {
        requestId: "",
        success: true,
        data: result,
        duration
      };
    } catch (error) {
      const duration = performance.now() - startTime;

      return {
        requestId: "",
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration
      };
    }
  }
}

/**
 * Create a BrizyToolServer instance
 */
export function createBrizyToolServer(
  pageRepository: IPageRepository,
  projectRepository: IProjectRepository,
  store: ISharedStore
): BrizyToolServer {
  return new BrizyToolServer(pageRepository, projectRepository, store);
}
