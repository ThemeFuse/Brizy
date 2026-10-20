import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../../application/interfaces/i-project-repository";
import { componentConfigs } from "../tool-configs";
import {
  createBrizyToolHandlers,
  getBrizyToolDefinitions
} from "../tool-registry";

const t = (key: string): string => key;

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

interface AddArg {
  containerId: string;
  elementType: string;
  insertIndex?: number;
  initialProperties?: Record<string, unknown>;
}

interface UpdateArg {
  elementId: string;
  elementType?: string;
  changes: Record<string, unknown>;
}

const handlersWith = (pageRepository: unknown) =>
  createBrizyToolHandlers(
    pageRepository as IPageRepository,
    {} as IProjectRepository,
    {} as ISharedStore
  );

describe("addShape / updateShape registration", () => {
  it("exposes the Shape through an add tool and several update tools", () => {
    const catalog = getBrizyToolDefinitions(t);

    expect(catalog.map((d) => d.name)).toContain("addShape");
    expect(
      catalog.filter((d) => d.alias === "updateShape").length
    ).toBeGreaterThan(1);
  });

  it("offers no argument the element's own schema would drop", () => {
    // The catalog and the handlers are written separately; this is what keeps
    // them honest. Zod strips keys it does not declare, so a tool advertising
    // one would silently do nothing.
    const byAlias = new Map(
      componentConfigs.map((config) => [config.alias, config])
    );

    const undeclared: string[] = [];
    for (const tool of getBrizyToolDefinitions(t)) {
      const config = byAlias.get(tool.alias);
      if (config === undefined || !("schema" in config)) continue;

      const shape = (config.schema as unknown as { shape: object }).shape;
      const declared = new Set(Object.keys(shape));
      for (const property of Object.keys(tool.parameters.properties)) {
        if (property === "elementId" || property === "containerId") continue;
        if (property === "insertIndex" || property === "formId") continue;
        if (!declared.has(property)) {
          undeclared.push(`${tool.name}.${property}`);
        }
      }
    }

    expect(undeclared).toEqual([]);
  });

  it("adds a StoryShape and pins the unit keys the CSS needs", () => {
    const addElement = jest.fn((_arg: AddArg) => ({
      success: true,
      data: {}
    }));
    const handlers = handlersWith({ addElement });

    handlers.addShape({
      containerId: "slide-1",
      width: 40,
      height: 30,
      borderRadius: 50,
      bgColorHex: "#FF0000",
      borderWidth: 2,
      borderColorHex: "#FFFFFF",
      offsetX: 70,
      offsetY: 10
    });

    expect(addElement).toHaveBeenCalledWith(
      expect.objectContaining({
        containerId: "slide-1",
        // StoryShape resolves to StoryWrapper > Shape; a plain "Shape"
        // shortcode key does not exist.
        elementType: "StoryShape",
        initialProperties: expect.objectContaining({
          width: 40,
          widthSuffix: "%",
          height: 30,
          heightSuffix: "%",
          borderRadius: 50,
          borderRadiusSuffix: "%",
          borderRadiusType: "grouped",
          bgColorHex: "#FF0000",
          bgColorPalette: "",
          bgColorType: "solid",
          borderWidth: 2,
          borderWidthType: "grouped",
          borderColorHex: "#FFFFFF",
          borderColorPalette: "",
          // stored borderColorOpacity is 0 — without this the border is invisible
          borderColorOpacity: 1,
          offsetX: 70,
          offsetXSuffix: "%",
          // pinned: a "right"/"bottom" alignment shifts the shape the wrong way
          offsetXAlignment: "left",
          offsetY: 10,
          offsetYSuffix: "%",
          offsetYAlignment: "top"
        })
      })
    );
  });

  it("rejects adding a Shape outside a Story slide", () => {
    // Guarded by REQUIRED_PARENT in the repository, so exercise the real one.
    const { correctContainerForElement } = jest.requireActual<
      typeof import("../../infrastructure/repositories/utils/element")
    >("../../infrastructure/repositories/utils/element");

    const result = correctContainerForElement(
      { type: ElementTypes.Column, value: { _id: "col-1", items: [] } },
      ["block-1", "value", "items", "0"],
      ElementTypes.StoryShape
    );

    expect(result.success).toBe(false);
    expect(result.success === false && result.error).toContain("StoryItem");
  });

  it("anchors bottom-right using the shape's own size, not offset 100", () => {
    const addElement = jest.fn((_arg: AddArg) => ({ success: true, data: {} }));
    const handlers = handlersWith({ addElement });

    // width 50 => 50% of slide width; height 60 => 60% of the shape's WIDTH,
    // which on a 400x800 slide is 50 * 0.6 * 0.5 = 15% of slide height.
    handlers.addShape({
      containerId: "slide-1",
      width: 50,
      height: 60,
      anchor: "bottom-right"
    });

    // Resolved as offsets from left/top, NEVER by flipping the alignment to
    // right/bottom — tools/Draggable ignores alignment, so a right-aligned
    // shape would drag inverted for the user afterwards.
    // width 50 => offsetX 100-50. height 60 of a 50-wide shape on a 400x800
    // slide => 50 * 0.6 * 0.5 = 15% of slide height => offsetY 100-15.
    const props = addElement.mock.calls[0]![0].initialProperties!;
    expect(props.offsetX).toBe(50);
    expect(props.offsetY).toBe(85);
    expect(props.offsetXAlignment).toBe("left");
    expect(props.offsetYAlignment).toBe("top");
    // `anchor` is a tool-level convenience, never a Shape model key.
    expect(props).not.toHaveProperty("anchor");
  });

  it("centres on update using the stored size when the call omits it", () => {
    const updateElement = jest.fn((_arg: UpdateArg) => ({
      success: true,
      data: {}
    }));
    const getElementById = jest.fn(() => ({
      success: true,
      data: { type: "Shape", value: { width: 20, height: 100 } }
    }));
    const handlers = handlersWith({ updateElement, getElementById });

    handlers.updateShapeLayout({ elementId: "shape-1", anchor: "center" });

    // Centring is the one case that needs the stored size:
    // width 20 => offsetX (100-20)/2 = 40; height 100 of a 20-wide shape on a
    // 400x800 slide => 20 * 1.0 * 0.5 = 10% of slide height => (100-10)/2 = 45.
    const changes = updateElement.mock.calls[0]![0].changes;
    expect(changes.offsetX).toBe(40);
    expect(changes.offsetY).toBe(45);
    expect(changes).not.toHaveProperty("anchor");
  });

  it("updates a Shape and restores a transparent stored fill opacity", () => {
    const updateElement = jest.fn((_arg: UpdateArg) => ({
      success: true,
      data: {}
    }));
    const getElementById = jest.fn(() => ({
      success: true,
      data: {
        type: "Shape",
        value: { bgColorOpacity: 0 }
      }
    }));
    const handlers = handlersWith({ updateElement, getElementById });

    handlers.updateShapeBackground({
      elementId: "shape-1",
      bgColorHex: "#0000FF"
    });

    expect(updateElement).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: "shape-1",
        elementType: "Shape",
        changes: expect.objectContaining({
          bgColorHex: "#0000FF",
          bgColorPalette: "",
          bgColorType: "solid",
          bgColorOpacity: 1
        })
      })
    );
  });

  it("rejects a non-Shape elementId with an actionable message", async () => {
    const updateElement = jest.fn();
    const getElementById = jest.fn(() => ({
      success: true,
      data: { type: "Image", value: {} }
    }));
    const handlers = handlersWith({ updateElement, getElementById });

    const result = await handlers.updateShapeBackground({
      elementId: "image-1",
      bgColorHex: "#0000FF"
    });

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("is a Image, not a Shape")
    });
    expect(updateElement).not.toHaveBeenCalled();
  });
});
