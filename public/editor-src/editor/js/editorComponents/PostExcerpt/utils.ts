export const getPlaceholder = (type: string): string => {
  switch (type) {
    case "userEmail":
      return "{{ brizy_customer_email }}";
    case "userFirstName":
      return "{{ brizy_customer_fname }}";
    case "userLastName":
      return "{{ brizy_customer_lname }}";
    case "userUsername":
      return "{{ brizy_customer_username }}";
    case "userPhoneNumber":
      return "{{ brizy_customer_phone }}";
    case "userRoles":
      return "{{ brizy_customer_roles }}";

    default:
      return "{{ brizy_dc_post_excerpt }}";
  }
};

export const getPlaceholderIcon = (type: string): string => {
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

    default:
      return "wp-excerpt";
  }
};
