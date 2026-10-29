// The markup the first version of the form renders for view.

interface LegacyFormMarkup {
  attributes: string;
  fields: string;
}

export const ACTION = `action="/submit" data-brz-redirect=""`;

export const IDS = `data-brz-form-id="form-1" data-brz-project-id="7"`;

export const form1 = ({ attributes, fields }: LegacyFormMarkup): string =>
  `<div class="brz-forms" data-brz-form-version="1"><form class="brz-form" novalidate${attributes ? ` ${attributes}` : ""}><div class="brz-forms__fields">${fields}</div><div class="brz-forms__item brz-forms__item--button"><button class="brz-btn" type="submit">Send</button></div></form></div>`;

interface LegacyInputMarkup {
  label: string;
  type: string;
  required: boolean;
  attributes: string;
}

export const inputField = ({
  label,
  type,
  required,
  attributes
}: LegacyInputMarkup): string =>
  `<div class="brz-forms__item"><input class="brz-input brz-forms__field" type="text" name="${label}" data-brz-type="${type}" data-brz-label="${label}"${required ? " required" : ""}${attributes ? ` ${attributes}` : ""}></div>`;

interface LegacySelectMarkup {
  label: string;
  required: boolean;
  options: string[];
}

// `component/Controls/Select` for view: a current label, the options and a hidden input.
export const selectField = ({
  label,
  required,
  options
}: LegacySelectMarkup): string =>
  `<div class="brz-forms__item"><div class="brz-control__select brz-control__select--bottom-left"><div class="brz-control__select-current brz-control__select-current__input"><div class="brz-control__select-option">${label}</div></div><div class="brz-control__select-options">${options
    .map(
      (value) =>
        `<div class="brz-control__select-option" data-value="${value}"><b>${value}</b></div>`
    )
    .join(
      ""
    )}</div><input type="hidden" name="${label}" data-brz-type="Select" data-brz-label="${label}" value=""${required ? " required" : ""}></div></div>`;

// The rule of `forms.scss` the control relies on to start closed.
export const SELECT_STYLE = `<style>.brz-control__select-options { display: none; }</style>`;
