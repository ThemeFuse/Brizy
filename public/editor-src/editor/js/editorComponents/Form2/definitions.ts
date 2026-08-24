import { z } from "zod";
import {
  containerIdSchema,
  onOff
} from "visual/ai/adapters/schema-primitives";
import type {
  AddNoPropsToolConfig,
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import type { ElementModelType2 } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const addFormDefinition: ToolDefinition = {
  name: "addForm",
  strict: true,
  description:
    "Add a Form to an EXISTING Section. For new sections use generateBlock.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      }
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const addFormConfig: AddNoPropsToolConfig = {
  kind: "addNoProps",
  definition: addFormDefinition,
  elementType: ElementTypes.Form2
};

export const formPropsSchema = z.object({
  messageSuccess: z.string().optional(),
  messageError: z.string().optional(),
  messageEmptyRequired: z.string().optional(),
  messageRedirect: z.string().optional(),
  showMessages: onOff.optional(),
  multistep: onOff.optional(),
  viewType: z
    .enum([
      "none",
      "text",
      "icon",
      "number",
      "progressBar",
      "number-text",
      "icon-text"
    ])
    .optional(),
  label: onOff.optional(),
  placeholder: onOff.optional(),
  submitWidth: z.number().min(1).max(100).optional(),
  padding: z.number().min(0).max(100).optional(),
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  msButtonsSpacing: z.number().min(0).max(100).optional()
});

const formPropertyDefinitions = {
  messageSuccess: {
    type: "string",
    description:
      "Text shown after the form is submitted successfully — the thank-you / confirmation message."
  },
  messageError: {
    type: "string",
    description: "Text shown when the submission fails to send."
  },
  messageEmptyRequired: {
    type: "string",
    description:
      "Text shown when the visitor tries to submit with required fields left empty."
  },
  messageRedirect: {
    type: "string",
    description:
      "URL to send the visitor to after a successful submit. Leave empty to stay on the page."
  },
  showMessages: {
    type: "string",
    enum: ["on", "off"],
    description:
      "'on' displays the success / error / empty-field response messages after submit, 'off' hides them."
  },
  multistep: {
    type: "string",
    enum: ["on", "off"],
    description:
      "'on' splits the form's fields into several steps or pages with Next and Back buttons; 'off' is a single-page form."
  },
  viewType: {
    type: "string",
    enum: [
      "none",
      "text",
      "icon",
      "number",
      "progressBar",
      "number-text",
      "icon-text"
    ],
    description:
      "Style of the step indicator shown above a multistep form: 'progressBar' for a progress bar, 'number', 'text' or 'icon' for step markers, 'number-text' / 'icon-text' for the combined markers, 'none' to hide it. Only has an effect while multistep is 'on'."
  },
  label: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Form-wide toggle: 'on' shows every field's label above its input, 'off' hides the labels and uses each field's label text as its placeholder instead. This is not the label text — to rename one field use updateFormField's label."
  },
  placeholder: {
    type: "string",
    enum: ["on", "off"],
    description:
      "Form-wide toggle: 'on' shows placeholder text inside every field, 'off' hides all placeholders. This is not the placeholder text — to set one field's placeholder use updateFormField."
  },
  submitWidth: {
    type: "number",
    description:
      "Width of the submit button as a percent of the form (1-100). Ignored while multistep is 'on', which uses its own Next/Back buttons.",
    minimum: 1,
    maximum: 100
  },
  padding: {
    type: "number",
    description:
      "Spacing around each form field in pixels (0-100) — the gap between the fields. Labelled 'Spacing' in the editor.",
    minimum: 0,
    maximum: 100
  },
  horizontalAlign: {
    type: "string",
    enum: ["left", "center", "right"],
    description:
      "Horizontal alignment of the submit button within the form. Ignored while multistep is 'on', which aligns its own Next/Back buttons."
  },
  msButtonsSpacing: {
    type: "number",
    description:
      "Gap in pixels (0-100) between the Next and Back buttons. Only applies while multistep is 'on'.",
    minimum: 0,
    maximum: 100
  }
};

export const updateFormDefinition: ToolDefinition = {
  name: "updateForm",
  strict: true,
  description:
    "Update an existing Form element's form-wide settings: the success / error / empty-field messages and the redirect URL after submit, multistep on/off and its step-indicator style, whether fields show their labels and placeholders, submit button width, field spacing and alignment. Use searchElements({type:'Form2'}) to find the form's ID. To edit a single field — its input type, label text, placeholder, required flag, default value or width — use updateFormField with that field's ID. For sign-in and registration forms use updateLogin instead.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Form element to update"
      },
      ...formPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateFormConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateFormDefinition,
  elementType: ElementTypes.Form2,
  schema: formPropsSchema
};

const FORM_FIELD_TYPES = [
  "Text",
  "Email",
  "Number",
  "Paragraph",
  "Select",
  "Radio",
  "Checkbox",
  "UserAgreementCheckbox",
  "Date",
  "Url",
  "Time",
  "FileUpload",
  "Hidden",
  "Password",
  "Calculated",
  "Phone"
] as const;

export const formFieldPropsSchema = z.object({
  type: z.enum(FORM_FIELD_TYPES).optional(),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: onOff.optional(),
  defaultValue: z.string().optional(),
  width: z.number().min(1).max(100).optional()
});

const formFieldPropertyDefinitions = {
  type: {
    type: "string",
    enum: FORM_FIELD_TYPES,
    description:
      "Input type for this field: 'Text', 'Email', 'Number', 'Phone' for phone numbers, 'Paragraph' for a multi-line textarea, 'Select' for a dropdown, 'Radio', 'Checkbox', 'UserAgreementCheckbox' for a terms-consent box, 'Date', 'Time', 'Url', 'FileUpload', 'Password', 'Hidden', 'Calculated'. Changing the type leaves the field's existing label and placeholder untouched, so send matching label (and placeholder) values in the same call unless the visitor-facing wording should stay as it is. Changing the type also does not create the choices for a Select, Radio or Checkbox field. If the request does not make the wanted type clear, ask which type is intended instead of guessing."
  },
  label: {
    type: "string",
    description:
      "This field's label text, e.g. 'Your email'. Shown above the input while the form's label toggle is 'on'; used as the field's placeholder while it is 'off'."
  },
  placeholder: {
    type: "string",
    description:
      "Placeholder text shown inside this field. Only visible when the form's placeholder toggle is 'on' AND its label toggle is 'on' — otherwise this field's label text is shown as the placeholder instead."
  },
  required: {
    type: "string",
    enum: ["on", "off"],
    description:
      "'on' means the visitor must fill this field before the form can be submitted."
  },
  defaultValue: {
    type: "string",
    description: "Value this field is prefilled with when the page loads."
  },
  width: {
    type: "number",
    description:
      "This field's width as a percent of the form row (1-100). Use 50 for two fields side by side, 100 for a full-width field.",
    minimum: 1,
    maximum: 100
  }
};

export const updateFormFieldDefinition: ToolDefinition = {
  name: "updateFormField",
  strict: true,
  description:
    "Update a single field inside an existing Form: its input type (text, email, phone, number, dropdown, checkbox, date, file upload and so on), its label text, its placeholder text, its prefilled default value, whether it is required, and how wide it is. Use searchElements({type:'Form2Field', textRegex:'<the label>'}) to find a field by what it says on screen — textRegex, not containsText, which matches every field. Every field is its own element, so call this once per field; the search result's parentId is the field group, which moveElement needs to reorder fields. When converting a field to a different type, update its label and placeholder in the same call so the wording matches the new type: a field switched to 'Phone' but still labelled 'Email' misleads the visitor. Call getElementById first if the field's current label is not already known. When the request does not say which type is wanted, ask before calling rather than guessing. For settings that apply to the whole form (response messages, multistep, showing labels or placeholders at all, submit button) use updateForm.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the Form2Field element to update"
      },
      ...formFieldPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateFormFieldConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateFormFieldDefinition,
  elementType: ElementTypes.Form2Field,
  schema: formFieldPropsSchema
};

// `type` and `label` are what make a new field meaningful, so both are required
// here even though updateFormField leaves every prop optional.
export const addFormFieldPropsSchema = formFieldPropsSchema.extend({
  type: z.enum(FORM_FIELD_TYPES),
  label: z.string().min(1)
});

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
function resolveFormFields(deps: HandlerDeps, targetId: string): ResolvedFields {
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

export const addFormFieldDefinition: ToolDefinition = {
  name: "addFormField",
  strict: true,
  description:
    "Add a new field — an input, box or question — to an existing Form: a text box, an email or phone number box, a number, a multi-line message box, a dropdown, radio buttons, a checkbox, a terms-consent box, a date, a time, a URL or a file upload. Use this whenever the user wants a form to collect something it does not collect yet ('add a phone number box to my contact form', 'ask for their company', 'add a message field'). Pass the Form's ID as formId — use searchElements({type:'Form2'}) to find it. The new field is added after the form's existing fields and copies their styling; use moveElement to place it elsewhere. For a multistep form, pass the ID of the step (Form2Step) the field belongs in — searchElements({type:'Form2Step'}) — otherwise the field goes into the form's first field group. To change a field that already exists use updateFormField, and to add a whole new form use addForm. If the request does not make the wanted field type clear, ask which type is intended instead of guessing.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      formId: {
        type: "string",
        description:
          "ID of the Form (Form2) to add the field to, or of the step (Form2Step) in a multistep form, or of an existing field (Form2Field) to add the new one alongside."
      },
      ...formFieldPropertyDefinitions,
      // formFieldPropertyDefinitions.type is written for updateFormField
      // ("changing the type leaves the label untouched"), which does not apply
      // when the field is being created — override it here.
      type: {
        type: "string",
        enum: FORM_FIELD_TYPES,
        description:
          "Input type for the new field: 'Text', 'Email', 'Number', 'Phone' for phone numbers, 'Paragraph' for a multi-line message box, 'Select' for a dropdown, 'Radio', 'Checkbox', 'UserAgreementCheckbox' for a terms-consent box, 'Date', 'Time', 'Url', 'FileUpload', 'Password', 'Hidden', 'Calculated'. This does not create the choices of a Select, Radio or Checkbox field."
      }
    },
    required: ["formId", "type", "label"],
    additionalProperties: false
  }
};

export const addFormFieldConfig: AddToolConfig = {
  kind: "add",
  definition: addFormFieldDefinition,
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
