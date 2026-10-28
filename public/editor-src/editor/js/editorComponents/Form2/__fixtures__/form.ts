// The markup Form2 renders for view, as the published page gets it.

interface FormMarkup {
  attributes: string;
  fields: string;
}

export const ACTION = `action="/submit"`;

export const IDS = `data-brz-form-id="form-1" data-brz-project-id="7"`;

export const form2 = ({ attributes, fields }: FormMarkup): string =>
  `<div class="brz-forms2" data-brz-form-version="2"><form class="brz-form" novalidate data-brz-form-type="default"${attributes ? ` ${attributes}` : ""}>${fields}<div class="brz-forms2__item brz-forms2__item-button"><button class="brz-btn" type="submit"><span class="brz-span">Send</span><svg class="brz-form-spinner brz-invisible"></svg></button></div><div class="brz-forms2__messages"></div></form></div>`;

interface TextMarkup {
  label: string;
  type: "Text" | "Email" | "Number" | "Hidden";
  inputType: "text" | "email" | "number" | "hidden";
  required: boolean;
  attributes: string;
}

export const textField = ({
  label,
  type,
  inputType,
  required,
  attributes
}: TextMarkup): string =>
  `<div class="brz-forms2__item"><input class="brz-input brz-forms2__field" type="${inputType}" name="${label}" data-brz-type="${type}" data-brz-label="${label}"${required ? " required" : ""}${attributes ? ` ${attributes}` : ""}></div>`;

interface ChoiceMarkup {
  label: string;
  values: string[];
  defaultValue: string;
}

export const radioField = ({
  label,
  values,
  defaultValue
}: ChoiceMarkup): string =>
  `<div class="brz-forms2__item"><div class="brz-forms2__field brz-forms2__radio"><div class="brz-control__radio brz-forms2__radio-options" data-value="${defaultValue}">${values
    .map(
      (value) =>
        `<div class="brz-control__radio-option brz-forms2__radio-option"><input class="brz-input" type="radio" name="${label}" value="${value}" data-brz-type="Radio" data-brz-label="${label}"><span class="brz-span brz-forms2__radio-option-name">${value}</span></div>`
    )
    .join("")}</div></div></div>`;

export const checkboxField = ({
  label,
  values,
  defaultValue
}: ChoiceMarkup): string =>
  `<div class="brz-forms2__item"><div class="brz-forms2__field brz-forms2__checkbox"><div class="brz-control__check-group brz-forms2__checkbox-options" data-value="${defaultValue}">${values
    .map(
      (value) =>
        `<div class="brz-control__check-group-option brz-forms2__checkbox-option"><input class="brz-input" type="checkbox" name="${label}" value="${value}" data-brz-type="Checkbox" data-brz-label="${label}"><span class="brz-span">${value}</span></div>`
    )
    .join("")}</div></div></div>`;

interface CalculatedMarkup {
  label: string;
  expression: string;
  initial: string;
}

export const calculatedField = ({
  label,
  expression,
  initial
}: CalculatedMarkup): string =>
  `<div class="brz-forms2__item"><div class="brz-forms2__field brz-forms2__calculated"><span class="brz-forms2__calculated-result" data-brz-calc-expression="${encodeURIComponent(JSON.stringify(expression))}">${initial}</span><input class="brz-input brz-hidden" type="hidden" name="${label}" data-brz-type="Calculated" data-brz-label="${label}" value="${initial}"></div></div>`;

interface UploadMarkup {
  label: string;
  placeholder: string;
  accept: string;
  maxSize: string;
}

export const uploadField = ({
  label,
  placeholder,
  accept,
  maxSize
}: UploadMarkup): string =>
  `<div class="brz-forms2__item"><div class="brz-forms2__field brz-forms2__field-fileUpload"><div class="brz-input__upload"><input id="upload-${label}" type="file" class="brz-input" name="${label}" accept="${accept}" data-brz-type="FileUpload" data-brz-label="${label}" data-brz-placeholder="${placeholder}" data-brz-file-max-size="${maxSize}"><label for="upload-${label}" class="brz-label"><span class="brz-span">${placeholder}</span><svg class="brz-icon-svg brz-input__upload-delete brz-hidden"></svg><span class="brz-button">Choose</span></label></div></div></div>`;

interface PhoneCountry {
  code: string;
  dialCode: string;
  name: string;
}

interface PhoneMarkup {
  label: string;
  defaultCountry: string;
  showCode: boolean;
  countries: PhoneCountry[];
}

export const phoneField = ({
  label,
  defaultCountry,
  showCode,
  countries
}: PhoneMarkup): string => {
  const dialCode = countries.find(
    ({ code }) => code === defaultCountry
  )?.dialCode;

  return `<div class="brz-forms2__item"><div class="brz-forms2__field brz-forms2__field-phone" data-brz-default-country="${defaultCountry}"><div class="brz-forms2__phone--country"><div class="brz-forms2__phone--country-selected"><span class="fi fi-${defaultCountry.toLowerCase()}"></span>${showCode && dialCode ? `<span class="brz-forms2__phone--country-code">${dialCode}</span>` : ""}<svg class="brz-icon-svg brz-forms2__phone--country-arrow"></svg></div><select></select></div><div class="brz-forms2__phone--number"><input type="tel" name="${label}" data-brz-type="Phone" data-brz-label="${label}" class="brz-input" value=""></div><div class="brz-forms2__field-phone--translated-data"><select>${countries
    .map(
      ({ code, dialCode, name }) =>
        `<option value="${code}" data-dial-code="${dialCode}">${name}</option>`
    )
    .join("")}</select></div></div></div>`;
};

export const RECAPTCHA = `<div class="brz-g-recaptcha" data-sitekey="site-key" data-size="invisible" data-callback="brzFormV2Captcha"></div>`;
