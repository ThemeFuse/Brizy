import produce from "immer";

export default function importState(
  data,
  state,
  options = { page: true, project: true }
) {
  return produce(data, draft => {
    if (options.page) {
      draft.page.data = state.page.data;
    }

    if (options.project) {
      draft.project.data = state.project.data;
    }
  });
}
