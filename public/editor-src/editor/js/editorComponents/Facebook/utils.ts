export const toolbarConfigEmpty = {
  getItems: () => []
};

export const toolbarExtendFilter = (items: Array<{ id: string }>) =>
  items.filter((item) => item.id === "remove");
