import { makePlaceholder } from "visual/utils/dynamicContent";
import { DCPlaceholderStartObj } from "visual/utils/dynamicContent/types";

type Types =
  | "userEmail"
  | "userFirstName"
  | "userLastName"
  | "userUsername"
  | "userPhoneNumber"
  | "userRoles"
  | "wp"
  | "blogPostExcerpt";

export const getPlaceholder = (
  type: Types,
  sourceType: string,
  textPopulation: string,
  attr: DCPlaceholderStartObj["attr"]
): string => {
  switch (type) {
    case "userEmail":
      return makePlaceholder({
        content: "{{ brizy_customer_email }}",
        attr: { context: sourceType }
      });
    case "userFirstName":
      return makePlaceholder({
        content: "{{ brizy_customer_fname }}",
        attr: { context: sourceType }
      });
    case "userLastName":
      return makePlaceholder({
        content: "{{ brizy_customer_lname }}",
        attr: { context: sourceType }
      });
    case "userUsername":
      return makePlaceholder({
        content: "{{ brizy_customer_username }}",
        attr: { context: sourceType }
      });
    case "userPhoneNumber":
      return makePlaceholder({
        content: "{{ brizy_customer_phone }}",
        attr: { context: sourceType }
      });
    case "userRoles":
      return makePlaceholder({
        content: "{{ brizy_customer_roles }}",
        attr: { context: sourceType }
      });
    case "blogPostExcerpt":
    case "wp":
      return makePlaceholder({ content: textPopulation, attr });
  }
};

export const getPlaceholderIcon = (type: Types): string => {
  switch (type) {
    case "userEmail":
      return "user-email";
    case "userFirstName":
    case "userLastName":
    case "userUsername":
      return "user-details";
    case "userPhoneNumber":
      return "user-phone-number";
    case "userRoles":
      return "user-roles";
    case "blogPostExcerpt":
    case "wp":
      return "wp-excerpt";
  }
};
