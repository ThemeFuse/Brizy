import type { ToolExecutionResponse } from "visual/ai/entities/models";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { ISharedStore } from "../SharedStore";
import { ToolServerImpl } from "../ToolServer";

const mockCallTool = jest.fn();
const mockListTools = jest.fn(() => []);

jest.mock("visual/ai/adapters/brizy-tool-server", () => ({
  createBrizyToolServer: () => ({
    listTools: mockListTools,
    callTool: mockCallTool
  })
}));

jest.mock("visual/ai/infrastructure/repositories/page.repository", () => ({
  createPageRepository: jest.fn()
}));

jest.mock("visual/ai/infrastructure/repositories/project.repository", () => ({
  createProjectRepository: jest.fn()
}));

jest.mock("visual/ai/infrastructure/repositories/global-block.repository", () => ({
  createGlobalBlockRepository: jest.fn()
}));

const makeResponse = (
  overrides: Partial<ToolExecutionResponse> = {}
): ToolExecutionResponse => ({
  requestId: "req-1",
  success: true,
  data: { pageId: "/collection_items/1" },
  duration: 5,
  ...overrides
});

const makeServer = (config: Partial<ConfigCommon> = {}): ToolServerImpl =>
  new ToolServerImpl(
    (() => ({})) as unknown as () => ReduxState,
    jest.fn() as unknown as TypedDispatch,
    config as ConfigCommon,
    {} as ISharedStore,
    (key: string) => key
  );

describe("ToolServerImpl", () => {
  beforeEach(() => {
    mockCallTool.mockReset();
    mockListTools.mockReset().mockReturnValue([]);
  });

  it("delegates callTool to the tool server it wires up", async () => {
    const response = makeResponse();
    mockCallTool.mockResolvedValue(response);

    const result = await makeServer().callTool({
      name: "createGlobalBlock",
      arguments: { position: "top" }
    });

    expect(mockCallTool).toHaveBeenCalledWith({
      name: "createGlobalBlock",
      arguments: { position: "top" }
    });
    expect(result).toBe(response);
  });

  it("delegates listTools", () => {
    const tools = [{ name: "addBlocks" }];
    mockListTools.mockReturnValue(tools as never);

    expect(makeServer().listTools()).toBe(tools);
  });
});
