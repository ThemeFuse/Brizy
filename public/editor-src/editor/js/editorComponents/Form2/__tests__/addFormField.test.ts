import { buildHandler } from "visual/ai/adapters/handler-factory";
import type { HandlerDeps } from "visual/ai/adapters/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { addFormFieldConfig } from "../definitions";

jest.mock("visual/ai/utils/logger", () => ({ log: { tools: jest.fn() } }));

const field = (id: string) => ({
  type: ElementTypes.Form2Field,
  value: { _id: id }
});

// Form2 → items[0] Form2Fields → two fields. getElementById answers per id.
const elements: Record<string, unknown> = {
  "form-1": {
    id: "form-1",
    type: ElementTypes.Form2,
    value: {
      _id: "form-1",
      items: [
        {
          type: ElementTypes.Form2Fields,
          value: { _id: "fields-1", items: [field("f1"), field("f2")] }
        },
        { type: ElementTypes.Button, value: { _id: "btn-1" } }
      ]
    }
  },
  "fields-1": {
    id: "fields-1",
    type: ElementTypes.Form2Fields,
    value: { _id: "fields-1", items: [field("f1"), field("f2")] }
  },
  "step-1": {
    id: "step-1",
    type: ElementTypes.Form2Step,
    value: {
      _id: "step-1",
      items: [
        {
          type: ElementTypes.Form2Fields,
          value: { _id: "sfields-1", items: [field("sf1")] }
        }
      ]
    }
  },
  "col-1": { id: "col-1", type: ElementTypes.Column, value: { _id: "col-1" } }
};

function makeDeps() {
  const getElementById = jest.fn((id: string) =>
    elements[id]
      ? { success: true, data: elements[id] }
      : { success: false, error: `Element with ID "${id}" not found` }
  );
  const duplicateElement = jest.fn(() => ({
    success: true,
    data: { elementId: "new-field", containerId: "fields-1", duplicatedAt: 2 }
  }));
  const updateElement = jest.fn(() => ({ success: true, data: {} }));
  const deps = {
    pageRepository: { getElementById, duplicateElement, updateElement },
    projectRepository: {},
    store: {}
  } as unknown as HandlerDeps;

  return { deps, getElementById, duplicateElement, updateElement };
}

describe("addFormField", () => {
  it("clones the last field of the form's field group and applies the props", () => {
    const { deps, duplicateElement, updateElement } = makeDeps();
    const handler = buildHandler(addFormFieldConfig, deps);

    const result = handler({
      formId: "form-1",
      type: "Phone",
      label: "Phone number"
    }) as { success: boolean; data: { elementId: string } };

    expect(duplicateElement).toHaveBeenCalledWith({
      elementId: "f2",
      insertAfter: true
    });
    expect(updateElement).toHaveBeenCalledWith({
      elementId: "new-field",
      elementType: ElementTypes.Form2Field,
      changes: {
        type: "Phone",
        label: "Phone number",
        required: "off",
        defaultValue: ""
      }
    });
    expect(result.success).toBe(true);
    expect(result.data.elementId).toBe("new-field");
  });

  it("accepts a Form2Fields id directly", () => {
    const { deps, duplicateElement } = makeDeps();
    const handler = buildHandler(addFormFieldConfig, deps);

    handler({ formId: "fields-1", type: "Text", label: "Company" });

    expect(duplicateElement).toHaveBeenCalledWith({
      elementId: "f2",
      insertAfter: true
    });
  });

  it("accepts a Form2Step id and targets that step's fields", () => {
    const { deps, duplicateElement } = makeDeps();
    const handler = buildHandler(addFormFieldConfig, deps);

    handler({ formId: "step-1", type: "Text", label: "Company" });

    expect(duplicateElement).toHaveBeenCalledWith({
      elementId: "sf1",
      insertAfter: true
    });
  });

  it("keeps explicitly passed required and defaultValue", () => {
    const { deps, updateElement } = makeDeps();
    const handler = buildHandler(addFormFieldConfig, deps);

    handler({
      formId: "form-1",
      type: "Email",
      label: "Email",
      required: "on",
      width: 50
    });

    expect(updateElement).toHaveBeenCalledWith({
      elementId: "new-field",
      elementType: ElementTypes.Form2Field,
      changes: {
        type: "Email",
        label: "Email",
        required: "on",
        defaultValue: "",
        width: 50
      }
    });
  });

  it("accepts an existing field's id and adds alongside it", () => {
    const { deps, duplicateElement } = makeDeps();
    // getElementById("f1") answers with a field that knows its parent group
    (
      deps.pageRepository.getElementById as unknown as jest.Mock
    ).mockImplementationOnce(() => ({
      success: true,
      data: {
        id: "f1",
        type: ElementTypes.Form2Field,
        value: { _id: "f1" },
        parentId: "fields-1"
      }
    }));
    const handler = buildHandler(addFormFieldConfig, deps);

    handler({ formId: "f1", type: "Text", label: "Company" });

    expect(duplicateElement).toHaveBeenCalledWith({
      elementId: "f2",
      insertAfter: true
    });
  });

  it("rejects a container that is not part of a form", () => {
    const { deps, duplicateElement } = makeDeps();
    const handler = buildHandler(addFormFieldConfig, deps);

    const result = handler({
      formId: "col-1",
      type: "Text",
      label: "Company"
    }) as { success: boolean; error: string };

    expect(result.success).toBe(false);
    expect(result.error).toContain("Form");
    expect(duplicateElement).not.toHaveBeenCalled();
  });

  it("rejects an unknown field type without touching the page", () => {
    const { deps, duplicateElement } = makeDeps();
    const handler = buildHandler(addFormFieldConfig, deps);

    const result = handler({
      formId: "form-1",
      type: "Rating",
      label: "Stars"
    }) as { success: boolean };

    expect(result.success).toBe(false);
    expect(duplicateElement).not.toHaveBeenCalled();
  });
});
