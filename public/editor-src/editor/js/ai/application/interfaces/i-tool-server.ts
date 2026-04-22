import type { ToolDefinition, ToolExecutionResponse } from "../../entities/models";

/**
 * Tool call request
 */
export interface ToolCallRequest {
  readonly name: string;
  readonly arguments: Record<string, unknown>;
}

/**
 * Interface for a tool server (MCP-like pattern)
 *
 * The editor implements this interface. The AI chat package
 * consumes it to discover and execute tools.
 */
export interface IToolServer {
  listTools(): ToolDefinition[];
  callTool(request: ToolCallRequest): Promise<ToolExecutionResponse>;
}
