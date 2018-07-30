import _ from "underscore";

export const getFields = (fields, appFields, editorFields, restrictions) => {
  let integrationFields = JSON.parse(fields) || [];
  const appFieldsLength = appFields.length;
  let requiredAppFieldLength = _.filter(appFields, item => item.required)
    .length;

  if (
    !_.some(integrationFields, item => item.linked === "email") &&
    _.some(editorFields, item => item.type === "email")
  ) {
    integrationFields = bundleEmailField(integrationFields, editorFields);
    requiredAppFieldLength--;
  }

  let step = 0;
  let requiredFieldCounter = 0;
  return _.map(editorFields, item => {
    const field = _.findWhere(integrationFields, { id: item._id });

    //it's a condition if app fields are full, and we cannot add _auto_generate
    let linked = null;
    if (field && field.linked && field.linked !== "_auto_generate") {
      linked = field.linked;
    } else {
      if (
        isMaxFields(appFieldsLength + requiredFieldCounter, restrictions) ||
        requiredFieldCounter < requiredAppFieldLength
      ) {
        linked = getEmptyField(appFields, integrationFields, step);
        step++;
      } else {
        linked = "_auto_generate";
      }
      requiredFieldCounter++;
    }
    return {
      id: item._id,
      title: item.label,
      linked: linked
    };
  });
};

export const getWpFields = fields => {
  return {
    ...fields
  };
};

export const bundleEmailField = (integrationFields, editorFields) => {
  const editorEmailField = _.findWhere(editorFields, { type: "email" });
  integrationFields.push({
    id: editorEmailField._id,
    title: editorEmailField.label,
    linked: "email"
  });

  return integrationFields;
};

export const isMaxFields = (fieldsLength, restrictions) => {
  return (
    restrictions &&
    typeof restrictions.maxFields == "number" &&
    fieldsLength >= restrictions.maxFields
  );
};

export const getEmptyField = (appFields, integrationFields, step) => {
  const newAppFields = _.pluck(appFields, "slug");
  const newIntegrationFields = _.pluck(integrationFields, "linked");
  return _.difference(newAppFields, newIntegrationFields)[step];
};

export const checkRequiredFields = (
  appPropsFields,
  fields,
  type = "select"
) => {
  if (type === "select") {
    const appFields = _.pluck(
      _.filter(appPropsFields, item => item.required),
      "slug"
    );
    const currentFields = _.pluck(fields, "linked");
    return !_.difference(appFields, currentFields).length;
  }
  if (type === "input") {
    return fields.filter(el => el.linked === "").length === 0;
  }
};

export const substrString = name => {
  if (name.length > 22) {
    const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    return re.test(name)
      ? `...${name.substr(-19, 19)}`
      : `${name.substr(0, 19)}...`;
  }

  return name;
};

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
