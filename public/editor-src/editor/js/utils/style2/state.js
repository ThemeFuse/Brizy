// Style State
export function styleState({ v }) {
  const { tabsState } = v;

  return tabsState === "tabHover" ? "hover" : "normal";
}
