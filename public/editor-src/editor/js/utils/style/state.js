// Style State
export function styleState({ v, state }) {
  const { tabsState } = v;

  return tabsState === "tabHover" ? "hover" : "normal";
}
