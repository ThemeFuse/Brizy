import { difference } from "es-toolkit";

const bundleEmailField = (integrationFields, editorFields) => {
  const editorEmailField = editorFields.find(
    ({ type }) => type && type.toLowerCase() === "email"
  );

  integrationFields.push({
    sourceId: editorEmailField._id,
    sourceTitle: editorEmailField.label,
    target: "email"
  });

  return integrationFields;
};

export const getFields = (fieldsMap, fields, formFields, restrictions) => {
  let integrationFields = (fieldsMap && JSON.parse(fieldsMap)) || [];
  const appFieldsLength = (fields && fields.length) || 0;
  let requiredAppFieldLength = fields.filter((item) => item.required).length;

  if (
    !integrationFields.some(({ target }) => target === "email") &&
    formFields.some(({ type }) => type && type.toLowerCase() === "email")
  ) {
    integrationFields = bundleEmailField(integrationFields, formFields);
    requiredAppFieldLength--;
  }

  let step = 0;
  let requiredFieldCounter = 0;
  return formFields.map(({ _id, label }) => {
    const field = integrationFields.find(({ sourceId }) => sourceId === _id);

    //it's a condition if app fields are full, and we cannot add _auto_generate
    let target = null;
    if (field && field.target && field.target !== "_auto_generate") {
      target = field.target;
    } else {
      if (
        isMaxFields(appFieldsLength + requiredFieldCounter, restrictions) ||
        requiredFieldCounter < requiredAppFieldLength
      ) {
        target = getEmptyField(fields, integrationFields, step);
        step++;
      } else {
        target = "_auto_generate";
      }

      requiredFieldCounter++;
    }

    return {
      sourceId: _id,
      sourceTitle: label,
      target
    };
  });
};

export const isMaxFields = (fieldsLength, restrictions) => {
  return restrictions && fieldsLength >= restrictions.maxFields;
};

export const getEmptyField = (appFields, integrationFields, step) => {
  const newAppFields = appFields.map((o) => o.slug);
  const newIntegrationFields = integrationFields.map((o) => o.target);
  return difference(newAppFields, newIntegrationFields)[step];
};

export const substrString = (name) => {
  if (name.length > 22) {
    /* eslint-disable no-useless-escape */
    const re =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    /* eslint-enabled no-useless-escape */
    return re.test(name)
      ? `...${name.substr(-19, 19)}`
      : `${name.substr(0, 19)}...`;
  }

  return name;
};
