import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import { BrizyToolServer } from "../brizy-tool-server";

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

const makeServer = (pageRepository: Partial<IPageRepository>) =>
  new BrizyToolServer(
    pageRepository as IPageRepository,
    {} as IProjectRepository,
    {} as ISharedStore,
    (key: string) => key
  );

describe("BrizyToolServer.callTool result envelope", () => {
  it("surfaces a handler-returned failure at the top level", async () => {
    // getElementById requires elementId; the schema rejects {} and the
    // handler returns { success: false, error }. That failure must not be
    // buried under a second envelope.
    const response = await makeServer({}).callTool({
      name: "getElementById",
      arguments: {}
    });

    expect(response.success).toBe(false);
    expect(typeof response.error).toBe("string");
    expect(response.error).toEqual(expect.stringContaining("elementId"));
  });

  it("does not wrap an envelope-returning handler a second time", async () => {
    const getElementById = jest.fn(() => ({
      success: true,
      data: { id: "el1", type: "Button" }
    }));

    const response = await makeServer({
      getElementById
    } as unknown as Partial<IPageRepository>).callTool({
      name: "getElementById",
      arguments: { elementId: "el1" }
    });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ id: "el1", type: "Button" });
  });

  // The originally reported payload: a batch tool nested four envelopes deep.
  // Only the batch level and the per-entry level are meaningful — an entry can
  // fail on its own — so the result must bottom out at exactly those two.
  it("flattens a batch tool result to one level of results", async () => {
    const addBlock = jest.fn(() => ({
      success: true,
      data: { blockId: "eC6azVmkkgHH", insertedAt: 2 }
    }));

    const response = await makeServer({
      addBlock
    } as unknown as Partial<IPageRepository>).callTool({
      name: "addBlocks",
      arguments: { blocks: [{ blockType: "Section", insertIndex: 2 }] }
    });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({
      results: [
        { success: true, data: { blockId: "eC6azVmkkgHH", insertedAt: 2 } }
      ]
    });
  });

  it("reports a thrown handler as a transport failure", async () => {
    const getElementById = jest.fn(() => {
      throw new Error("boom");
    });

    const response = await makeServer({
      getElementById
    } as unknown as Partial<IPageRepository>).callTool({
      name: "getElementById",
      arguments: { elementId: "el1" }
    });

    expect(response.success).toBe(false);
    expect(response.error).toBe("boom");
  });

  // Regression guard: getPageStructure's repository method returns a raw
  // PageStructure, not a BrizyToolResult. Flattening callTool without
  // wrapping this handler destructures the PageStructure into undefined and
  // ships `pageStructure: null` to the LLM on every request.
  it("returns the page structure unchanged", async () => {
    const structure = {
      blocksOrder: ["b1"],
      blocks: [{ id: "b1", type: "Section", children: [] }]
    };
    const getPageStructure = jest.fn(() => structure);

    const response = await makeServer({
      getPageStructure
    } as unknown as Partial<IPageRepository>).callTool({
      name: "getPageStructure",
      arguments: {}
    });

    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty("blocksOrder");
    expect(response.data).toEqual(structure);
  });
});

describe("BrizyToolServer.listTools confirmation metadata", () => {
  it("gates setPageStatus on an explicit user decision", () => {
    const tool = makeServer({})
      .listTools()
      .find((tool) => tool.name === "setPageStatus");

    expect(tool?.requiresConfirmation).toBe(true);
    // The card falls back to "This cannot be undone.", which is wrong here —
    // the status can be flipped back — so it must carry its own message.
    expect(tool?.confirmationMessage).toEqual(
      expect.stringContaining("live website")
    );
    expect(tool?.confirmLabel).toBe("Change page status");
  });

  // Every tool that deletes more than one entity at a time now lives in
  // `@brizy/ai-chat`, which carries their confirmation metadata and the tests
  // for it. Nothing else this bundle exposes should be gated: a prompt on a
  // single-element edit would train the user to click through the one that
  // matters. setPageStatus is the exception because it is the only editor tool
  // that changes what visitors see on the live site.
  it("gates nothing else this bundle owns", () => {
    const flagged = makeServer({})
      .listTools()
      .filter((tool) => tool.requiresConfirmation)
      .map((tool) => tool.name);

    expect(flagged).toEqual(["setPageStatus"]);
  });
});
