export const getActiveClassName = (
  className: string,
  isActive?: boolean
): string => `${className}${isActive ? "active" : "inactive"}`;

export const getCheckedClassName = (
  className: string,
  isChecked?: boolean
): string => `${className}${isChecked ? "checked" : "unchecked"}`;
