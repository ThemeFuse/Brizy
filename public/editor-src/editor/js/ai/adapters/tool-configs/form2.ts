import {
  addFormFieldPropsSchema,
  containerIdSchema,
  formFieldPropsSchema,
  formPropsSchema
} from "@brizy/ai-tools";
import type { ElementModelType2 } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { log } from "../../utils/logger";
import type {
  AddNoPropsToolConfig,
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

export const addFormConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  alias: "addForm",
  elementType: ElementTypes.Form2
};
export const updateFormConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateForm",
  elementType: ElementTypes.Form2,
  schema: formPropsSchema
};
export const updateFormFieldConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateFormField",
  elementType: ElementTypes.Form2Field,
  schema: formFieldPropsSchema
};
type ResolvedFields =
  | { success: true; fieldsId: string; lastFieldId: string }
  | { success: false; error: string };
function toResolvedFields(fields: ElementModelType2): ResolvedFields {
  const items = (fields.value?.items ?? []) as ElementModelType2[];
  const last = items[items.length - 1];

  if (!last) {
    return {
      success: false,
      error: `Form field group "${fields.value?._id}" has no field to copy. Add the field to another group, or add a new Form.`
    };
  }

  return {
    success: true,
    fieldsId: fields.value._id as string,
    lastFieldId: last.value._id as string
  };
}
/**
 * Resolve the Form2Fields group a new field belongs to.
 * Accepts a Form2, a Form2Step, a Form2Fields or a sibling Form2Field id, so
 * the agent never has to know whether the form is single-page or multistep.
 */
function resolveFormFields(
  deps: HandlerDeps,
  targetId: string
): ResolvedFields {
  const found = deps.pageRepository.getElementById(targetId);

  if (!found.success || !found.data) {
    return {
      success: false,
      error: found.error ?? `Element with ID "${targetId}" not found`
    };
  }

  const { type, value, parentId } = found.data;

  if (type === ElementTypes.Form2Field) {
    return parentId
      ? resolveFormFields(deps, parentId)
      : {
          success: false,
          error: `Field "${targetId}" is not inside a Form.`
        };
  }

  if (type === ElementTypes.Form2Fields) {
    return toResolvedFields({ type, value } as ElementModelType2);
  }

  if (type === ElementTypes.Form2 || type === ElementTypes.Form2Step) {
    const first = (value.items as ElementModelType2[] | undefined)?.[0];

    if (!first || first.type !== ElementTypes.Form2Fields) {
      return {
        success: false,
        error: `${type} "${targetId}" has no field group to add the field to.`
      };
    }

    return toResolvedFields(first);
  }

  return {
    success: false,
    error: `"${targetId}" is a ${type}, not a Form. Pass the id of the Form, of one of its steps, or of an existing field in it. Use searchElements({type:'Form2'}) to find the Form.`
  };
}
export const addFormFieldConfig: AddToolConfig = {
  kind: "add",
  alias: "addFormField",
  elementType: ElementTypes.Form2Field,
  schema: addFormFieldPropsSchema,
  // The editor has no "create field" primitive — its own add-field affordance
  // clones an existing field (Form2Fields/Items.jsx), and addElement cannot
  // build a Form2Field at all (no shortcode). So: duplicate, then update.
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addFormField input %o", args);
    const { formId, ...props } = args;

    const formIdParsed = containerIdSchema.safeParse(formId);
    if (!formIdParsed.success) {
      return { success: false, error: formIdParsed.error.message };
    }

    // The clone inherits the source field's stored props, so pin the two that
    // would otherwise leak from the neighbour into the new field.
    const parsed = addFormFieldPropsSchema.safeParse({
      required: "off",
      defaultValue: "",
      ...props
    });
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fields = resolveFormFields(deps, formIdParsed.data);
    if (!fields.success) {
      return { success: false, error: fields.error };
    }

    const duplicated = deps.pageRepository.duplicateElement({
      elementId: fields.lastFieldId,
      insertAfter: true
    });
    if (!duplicated.success || !duplicated.data) {
      return {
        success: false,
        error: duplicated.error ?? "Failed to add the field."
      };
    }

    const { elementId } = duplicated.data;
    const updated = deps.pageRepository.updateElement({
      elementId,
      elementType: ElementTypes.Form2Field,
      changes: parsed.data
    });
    if (!updated.success) {
      return updated;
    }

    const result = {
      success: true,
      data: { elementId, containerId: fields.fieldsId, ...parsed.data }
    };
    log.tools("addFormField output %o", result);
    return result;
  }
};
