import _ from "underscore";

export const checkRequiredFields = (appFields, fields, type = "select") => {
  if (type === "select") {
    const reqFields = _.pluck(appFields.filter(item => item.required), "slug");
    const currentFields = _.pluck(fields, "target");
    return !_.difference(reqFields, currentFields).length;
  }
  if (type === "input") {
    return fields.filter(el => el.target === "").length === 0;
  }
};

/* eslint-disable no-useless-escape */
export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
/* eslint-enabled no-useless-escape */
