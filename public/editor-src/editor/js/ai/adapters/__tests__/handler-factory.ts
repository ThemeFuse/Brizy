import { z } from "zod";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import type {
  AddElementResult,
  ElementDetails,
  ToolDefinition,
  UpdateElementResult
} from "../../entities/models";
import { buildHandler } from "../handler-factory";
import type { AddToolConfig, HandlerDeps, ToolConfig } from "../types";

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn() }
}));

const schema = z.object({
  height: z.number().optional(),
  width: z.number().optional()
});

function makeDef(name: string): ToolDefinition {
  return {
    name,
    description: `test ${name}`,
    parameters: { type: "object", properties: {} }
  };
}

function makeAddResult(overrides?: Partial<AddElementResult>): {
  success: true;
  data: AddElementResult;
} {
  return {
    success: true,
    data: {
      elementId: "wrapper-1",
      containerId: "c1",
      insertedAt: 0,
      childElementId: "el-1",
      ...overrides
    }
  };
}

function makeUpdateResult(overrides?: Partial<UpdateElementResult>): {
  success: true;
  data: UpdateElementResult;
} {
  return {
    success: true,
    data: {
      elementId: "el-1",
      elementType: "Button",
      ...overrides
    }
  };
}

function makeElementDetails(overrides?: Partial<ElementDetails>): {
  success: true;
  data: ElementDetails;
} {
  return {
    success: true,
    data: {
      id: "el-1",
      type: "Button",
      path: ["block-1", "section-1"],
      value: {},
      ...overrides
    }
  };
}

class MockPageRepository implements IPageRepository {
  getPageStructure = jest.fn();
  addBlock = jest.fn();
  removeBlock = jest.fn();
  moveBlock = jest.fn();
  duplicateBlock = jest.fn();
  clearPage = jest.fn();
  insertTemplate = jest.fn();
  getElementById = jest.fn();
  searchElements = jest.fn();
  addElement = jest.fn();
  removeElement = jest.fn();
  updateElement = jest.fn();
  updateColumn = jest.fn();
  duplicateElement = jest.fn();
  moveElement = jest.fn();
  updateRichText = jest.fn();
  getAvailableIcons = jest.fn();
  isPro = jest.fn();
}

class MockProjectRepository implements IProjectRepository {
  getProjectStyles = jest.fn();
  changeStyle = jest.fn();
  addStyle = jest.fn();
  updateStyle = jest.fn();
  duplicateStyle = jest.fn();
  getProjectFonts = jest.fn();
  getGoogleFonts = jest.fn();
  addFont = jest.fn();
  deleteFont = jest.fn();
  changeDefaultFont = jest.fn();
  fontExists = jest.fn().mockReturnValue(true);
}

function makeDeps(): {
  deps: HandlerDeps;
  repo: MockPageRepository;
} {
  const repo = new MockPageRepository();
  return {
    deps: {
      pageRepository: repo,
      projectRepository: new MockProjectRepository(),
      store: {
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
        clear: jest.fn()
      }
    },
    repo
  };
}

describe("buildHandler", () => {
  it.each<{
    label: string;
    config: ToolConfig;
    args: Record<string, unknown>;
    setup: (repo: MockPageRepository) => void;
    assert: (repo: MockPageRepository, result: unknown) => void;
  }>([
    {
      label: "add — core flow",
      config: {
        kind: "add",
        definition: makeDef("addSpacer"),
        elementType: "Spacer",
        schema
      },
      args: { containerId: "c1", insertIndex: 0, height: 50 },
      setup: (repo) => repo.addElement.mockReturnValue(makeAddResult()),
      assert: (repo, result) => {
        expect(result).toEqual(makeAddResult());
        expect(repo.addElement).toHaveBeenCalledWith({
          containerId: "c1",
          elementType: "Spacer",
          insertIndex: 0,
          initialProperties: { height: 50 }
        });
      }
    },
    {
      label: "add — applies defaults",
      config: {
        kind: "add",
        definition: makeDef("addWidget"),
        elementType: "Widget",
        schema,
        defaults: (props) => ({ height: 100, ...props })
      },
      args: { containerId: "c1" },
      setup: (repo) => repo.addElement.mockReturnValue(makeAddResult()),
      assert: (repo) => {
        expect(repo.addElement).toHaveBeenCalledWith(
          expect.objectContaining({ initialProperties: { height: 100 } })
        );
      }
    },
    {
      label: "add — applies transformProps",
      config: {
        kind: "add",
        definition: makeDef("addVideo"),
        elementType: "Video",
        schema: z.object({ video: z.string().optional() }),
        transformProps: (parsed) => ({ ...parsed, type: "youtube" })
      },
      args: { containerId: "c1", video: "https://y.be/x" },
      setup: (repo) => repo.addElement.mockReturnValue(makeAddResult()),
      assert: (repo) => {
        expect(repo.addElement).toHaveBeenCalledWith(
          expect.objectContaining({
            initialProperties: { video: "https://y.be/x", type: "youtube" }
          })
        );
      }
    },
    {
      label: "addNoProps — only containerId and elementType",
      config: {
        kind: "addNoProps",
        definition: makeDef("addForm"),
        elementType: "Form2"
      },
      args: { containerId: "c1", insertIndex: 2 },
      setup: (repo) => repo.addElement.mockReturnValue(makeAddResult()),
      assert: (repo) => {
        expect(repo.addElement).toHaveBeenCalledWith({
          containerId: "c1",
          elementType: "Form2",
          insertIndex: 2
        });
      }
    },
    {
      label: "update — core flow",
      config: {
        kind: "update",
        definition: makeDef("updateButton"),
        elementType: "Button",
        schema
      },
      args: { elementId: "el-1", height: 20 },
      setup: (repo) => repo.updateElement.mockReturnValue(makeUpdateResult()),
      assert: (repo, result) => {
        expect(result).toEqual(makeUpdateResult());
        expect(repo.updateElement).toHaveBeenCalledWith({
          elementId: "el-1",
          elementType: "Button",
          changes: { height: 20 }
        });
      }
    },
    {
      label: "update — applies defaults",
      config: {
        kind: "update",
        definition: makeDef("updateAlert"),
        elementType: "Alert",
        schema,
        defaults: (props) => ({ height: 100, ...props })
      },
      args: { elementId: "el-1", width: 50 },
      setup: (repo) => repo.updateElement.mockReturnValue(makeUpdateResult()),
      assert: (repo) => {
        expect(repo.updateElement).toHaveBeenCalledWith({
          elementId: "el-1",
          elementType: "Alert",
          changes: { height: 100, width: 50 }
        });
      }
    },
    {
      label: "update — applies transformProps",
      config: {
        kind: "update",
        definition: makeDef("updateVideo"),
        elementType: "Video",
        schema: z.object({ video: z.string().optional() }),
        transformProps: (parsed) => ({ ...parsed, type: "vimeo" })
      },
      args: { elementId: "el-1", video: "https://vimeo.com/1" },
      setup: (repo) => repo.updateElement.mockReturnValue(makeUpdateResult()),
      assert: (repo) => {
        expect(repo.updateElement).toHaveBeenCalledWith({
          elementId: "el-1",
          elementType: "Video",
          changes: { video: "https://vimeo.com/1", type: "vimeo" }
        });
      }
    },
    {
      label: "update — beforeUpdate modifies changes",
      config: {
        kind: "update",
        definition: makeDef("updateTable"),
        elementType: "Table",
        schema,
        beforeUpdate: (_deps, _id, parsed) => ({
          ...parsed,
          items: [1, 2, 3]
        })
      },
      args: { elementId: "el-1", height: 5 },
      setup: (repo) => repo.updateElement.mockReturnValue(makeUpdateResult()),
      assert: (repo) => {
        expect(repo.updateElement).toHaveBeenCalledWith({
          elementId: "el-1",
          elementType: "Table",
          changes: { height: 5, items: [1, 2, 3] }
        });
      }
    },
    {
      label: "update — validateType rejects wrong type",
      config: {
        kind: "update",
        definition: makeDef("updateSectionItem"),
        elementType: "SectionItem",
        schema,
        validateType: {
          expectedType: "SectionItem",
          errorMessage: "Expected SectionItem, got ${type}"
        }
      },
      args: { elementId: "el-1", height: 10 },
      setup: (repo) =>
        repo.getElementById.mockReturnValue(
          makeElementDetails({ type: "Section" })
        ),
      assert: (repo, result) => {
        expect(result).toEqual({
          success: false,
          error: "Expected SectionItem, got Section"
        });
        expect(repo.updateElement).not.toHaveBeenCalled();
      }
    },
    {
      label: "update — updateMethod routes to updateColumn",
      config: {
        kind: "update",
        definition: makeDef("updateColumn"),
        elementType: "Column",
        schema,
        updateMethod: "updateColumn"
      },
      args: { elementId: "el-1", height: 50 },
      setup: (repo) =>
        repo.updateColumn.mockReturnValue(
          makeUpdateResult({ elementType: "Column" })
        ),
      assert: (repo) => {
        expect(repo.updateColumn).toHaveBeenCalledWith({
          elementId: "el-1",
          elementType: "Column",
          changes: { height: 50 }
        });
        expect(repo.updateElement).not.toHaveBeenCalled();
      }
    }
  ])("$label", ({ config, args, setup, assert }) => {
    const { deps, repo } = makeDeps();
    setup(repo);
    const result = buildHandler(config, deps)(args);
    assert(repo, result);
  });

  it("add — calls afterAdd hook", () => {
    const afterAdd = jest.fn();
    const config: AddToolConfig = {
      kind: "add",
      definition: makeDef("addSwitcher"),
      elementType: "Switcher",
      schema,
      afterAdd
    };
    const { deps, repo } = makeDeps();
    const addResult = makeAddResult({ childElementId: "el-4" });
    repo.addElement.mockReturnValue(addResult);

    buildHandler(config, deps)({ containerId: "c1", height: 10 });

    expect(afterAdd).toHaveBeenCalledWith(deps, { height: 10 }, addResult);
  });

  it.each<{
    label: string;
    config: ToolConfig;
    args: Record<string, unknown>;
  }>([
    {
      label: "add",
      config: (() => {
        const handler = jest.fn().mockReturnValue({ success: true });
        return {
          kind: "add",
          definition: makeDef("addText"),
          elementType: "RichText",
          schema,
          handler
        };
      })(),
      args: { containerId: "c1", text: "hello" }
    },
    {
      label: "update",
      config: (() => {
        const handler = jest.fn().mockReturnValue({ success: true });
        return {
          kind: "update",
          definition: makeDef("updateText"),
          elementType: "RichText",
          schema,
          handler
        };
      })(),
      args: { elementId: "el-1", text: "hello" }
    }
  ])(
    "$label — handler escape hatch bypasses standard flow",
    ({ config, args }) => {
      const { deps, repo } = makeDeps();
      buildHandler(config, deps)(args);

      expect(repo.addElement).not.toHaveBeenCalled();
      expect(repo.updateElement).not.toHaveBeenCalled();
    }
  );
});
