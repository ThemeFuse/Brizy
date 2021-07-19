import produce from "immer";
import { parsePage, parseProject } from "visual/utils/api/adapter";

export default function importLog(data, log) {
  return produce(data, draft => {
    draft.pages = JSON.parse(log.paj).map(parsePage);
    draft.project = parseProject(JSON.parse(log.prj));
  });
}
