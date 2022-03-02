type Types =
  | "userEmail"
  | "userFirstName"
  | "userLastName"
  | "userUsername"
  | "userPhoneNumber"
  | "userRoles"
  | "wp";

export const getPlaceholder = (type: Types, sourceType: string): string => {
  switch (type) {
    case "userEmail":
      return `{{ brizy_customer_email context="${sourceType}" }}`;
    case "userFirstName":
      return `{{ brizy_customer_fname context="${sourceType}" }}`;
    case "userLastName":
      return `{{ brizy_customer_lname context="${sourceType}" }}`;
    case "userUsername":
      return `{{ brizy_customer_username context="${sourceType}" }}`;
    case "userPhoneNumber":
      return `{{ brizy_customer_phone context="${sourceType}" }}`;
    case "userRoles":
      return `{{ brizy_customer_roles context="${sourceType}" }}`;
    case "wp":
      return "{{ brizy_dc_post_excerpt }}";
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
    case "wp":
      return "wp-excerpt";
  }
};
