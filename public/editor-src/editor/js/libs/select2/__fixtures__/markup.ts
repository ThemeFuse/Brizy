// Markup the published page gives select2 to work on.

export interface OptionMarkup {
  value: string;
  text: string;
  attributes: string;
}

export const option = (value: string, text: string): OptionMarkup => ({
  value,
  text,
  attributes: ""
});

export const optionWith = (
  value: string,
  text: string,
  attributes: string
): OptionMarkup => ({ value, text, attributes });

export const COLORS: OptionMarkup[] = [
  option("", "Color"),
  option("red", "Red"),
  option("green", "Green"),
  option("blue", "Blue")
];

// Without the empty option a select with a placeholder starts with.
export const SOLID_COLORS: OptionMarkup[] = [
  option("red", "Red"),
  option("green", "Green"),
  option("blue", "Blue")
];

const optionsHtml = (options: OptionMarkup[]): string =>
  options
    .map(
      ({ value, text, attributes }) =>
        `<option value="${value}"${attributes ? ` ${attributes}` : ""}>${text}</option>`
    )
    .join("");

// A bare select inside the element that receives the dropdown.
export const plainSelect = (
  attributes: string,
  options: OptionMarkup[]
): string =>
  `<div class="parent"><select${attributes ? ` ${attributes}` : ""}>${optionsHtml(options)}</select></div>`;

export interface FormSelectMarkup {
  id: string;
  label: string;
  multiple: boolean;
  required: boolean;
  placeholder: string | undefined;
  defaultValue: string;
  options: OptionMarkup[];
}

// The select field Form2 renders for view (`Form2Field/types/Select.tsx`).
export const formSelect = ({
  id,
  label,
  multiple,
  required,
  placeholder,
  defaultValue,
  options
}: FormSelectMarkup): string => {
  const attributes = [
    `id="${id}"`,
    `name="${id}"`,
    required ? "required" : "",
    `data-brz-type="Select"`,
    `data-brz-label="${label}"`,
    placeholder === undefined ? "" : `data-brz-placeholder="${placeholder}"`,
    multiple ? "multiple" : "",
    `data-brz-max-item-dropdown="5"`,
    `data-value="${defaultValue}"`,
    `class="brz-select"`
  ]
    .filter(Boolean)
    .join(" ");
  const className = multiple
    ? "brz-forms2__field brz-forms2__field-select brz-forms2__field-select--multiple"
    : "brz-forms2__field brz-forms2__field-select";

  return `<div class="brz-forms2__item"><div class="${className}"><select ${attributes}>${optionsHtml(options)}</select><svg class="brz-icon-svg brz-forms2__select--arrow"></svg></div></div>`;
};

export interface LanguageMarkup {
  code: string;
  name: string;
  selected: boolean;
}

interface TranslationMarkup {
  showFlags: "on" | "off";
  showName: "on" | "off";
  languages: LanguageMarkup[];
}

// The language switcher: `Translation` wraps what `{{translation_switcher}}` resolves to.
export const translation = ({
  showFlags,
  showName,
  languages
}: TranslationMarkup): string =>
  `<div class="brz-translation" data-brz-showflags="${showFlags}" data-brz-showname="${showName}"><div class="brz-translation__dc h-full"><select class="brz-select">${languages
    .map(
      ({ code, name, selected }) =>
        `<option value="${code}" data-flag="/flags/${code}.svg" data-href="#lang-${code}"${selected ? " selected" : ""}>${name}</option>`
    )
    .join("")}</select></div></div>`;
