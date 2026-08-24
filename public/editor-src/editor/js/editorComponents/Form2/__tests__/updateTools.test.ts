import { buildHandler } from "visual/ai/adapters/handler-factory";
import type { HandlerDeps } from "visual/ai/adapters/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateFormConfig, updateFormFieldConfig } from "../definitions";

jest.mock("visual/ai/utils/logger", () => ({ log: { tools: jest.fn() } }));

function makeDeps() {
  const updateElement = jest.fn().mockReturnValue({ success: true, data: {} });
  const getElementById = jest.fn();
  const deps = {
    pageRepository: { updateElement, getElementById },
    projectRepository: {},
    store: {}
  } as unknown as HandlerDeps;
  return { deps, updateElement };
}

describe("updateForm", () => {
  it("passes flat parent props to updateElement with elementType Form2", () => {
    const { deps, updateElement } = makeDeps();
    const handler = buildHandler(updateFormConfig, deps);

    const result = handler({
      elementId: "form-1",
      messageSuccess: "Thanks!",
      multistep: "on",
      viewType: "progressBar",
      submitWidth: 60
    });

    expect(result).toEqual({ success: true, data: {} });
    expect(updateElement).toHaveBeenCalledWith({
      elementId: "form-1",
      elementType: ElementTypes.Form2,
      changes: {
        messageSuccess: "Thanks!",
        multistep: "on",
        viewType: "progressBar",
        submitWidth: 60
      }
    });
  });

  it("drops the story-only width and submitHeight props", () => {
    const { deps, updateElement } = makeDeps();
    const handler = buildHandler(updateFormConfig, deps);

    handler({ elementId: "form-1", padding: 20, width: 60, submitHeight: 30 });

    expect(updateElement).toHaveBeenCalledWith({
      elementId: "form-1",
      elementType: ElementTypes.Form2,
      changes: { padding: 20 }
    });
  });

  it("rejects an invalid enum value without calling updateElement", () => {
    const { deps, updateElement } = makeDeps();
    const handler = buildHandler(updateFormConfig, deps);

    const result = handler({ elementId: "form-1", multistep: "maybe" }) as {
      success: boolean;
    };

    expect(result.success).toBe(false);
    expect(updateElement).not.toHaveBeenCalled();
  });
});

describe("updateFormField", () => {
  it("passes flat field props to updateElement with elementType Form2Field", () => {
    const { deps, updateElement } = makeDeps();
    const handler = buildHandler(updateFormFieldConfig, deps);

    const result = handler({
      elementId: "field-1",
      type: "Email",
      label: "Your email",
      required: "on",
      width: 50
    });

    expect(result).toEqual({ success: true, data: {} });
    expect(updateElement).toHaveBeenCalledWith({
      elementId: "field-1",
      elementType: ElementTypes.Form2Field,
      changes: {
        type: "Email",
        label: "Your email",
        required: "on",
        width: 50
      }
    });
  });

  // Tel is retired in the editor (Form2Field/utils.ts omits it from the type
  // picker) — Phone replaced it, so the tool must not offer it either.
  it("rejects the retired Tel type", () => {
    const { deps, updateElement } = makeDeps();
    const handler = buildHandler(updateFormFieldConfig, deps);

    const result = handler({ elementId: "field-1", type: "Tel" }) as {
      success: boolean;
    };

    expect(result.success).toBe(false);
    expect(updateElement).not.toHaveBeenCalled();
  });

  it("rejects an unknown field type without calling updateElement", () => {
    const { deps, updateElement } = makeDeps();
    const handler = buildHandler(updateFormFieldConfig, deps);

    const result = handler({ elementId: "field-1", type: "Rating" }) as {
      success: boolean;
    };

    expect(result.success).toBe(false);
    expect(updateElement).not.toHaveBeenCalled();
  });
});
