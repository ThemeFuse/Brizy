export const getCollapsedCategories = (): string[] => {
  const collapsedCategories = localStorage.getItem("brz-collapsed-categories");

  try {
    return JSON.parse(collapsedCategories ?? "[]");
  } catch (_) {
    return [];
  }
};

export const setCollapsedCategories = (categories: string[]) => {
  localStorage.setItem("brz-collapsed-categories", JSON.stringify(categories));
};
