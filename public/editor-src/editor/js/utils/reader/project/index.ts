import { mPipe, parseStrict } from "fp-utilities";
import { Project } from "visual/types";
import { pipe } from "visual/utils/fp";
import { MValue, onNullish, throwOnNullish } from "visual/utils/value";
import * as Json from "../json";
import * as Num from "../number";
import * as Obj from "../object";
import * as Str from "../string";

type ProjectData = Project["data"];

export const parseProject = (
  project: Record<string, unknown>
): MValue<Project> => {
  const reader = parseStrict<Record<string, unknown>, Project>({
    id: pipe(mPipe(Obj.readKey("id"), Str.read), throwOnNullish("id")),
    data: pipe(
      mPipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => MValue<ProjectData>
      ),
      throwOnNullish("data")
    ),
    dataVersion: pipe(mPipe(Obj.readKey("dataVersion"), Num.read), onNullish(0))
  });

  try {
    return reader(project);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
