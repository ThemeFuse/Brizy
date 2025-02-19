import { difference } from "es-toolkit";

export const checkRequiredFields = (appFields, fields, type = "select") => {
  if (type === "select") {
    const reqFields = appFields
      .filter((item) => item.required)
      .map((i) => i?.slug);
    const currentFields = fields.map((i) => i?.target);
    return !difference(reqFields, currentFields).length;
  }
  if (type === "input") {
    return fields.filter((el) => el.target === "").length === 0;
  }
};

/* eslint-disable no-useless-escape */
export const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
/* eslint-enabled no-useless-escape */
