import { mPipe } from "fp-utilities";
import { PageCommon } from "visual/types";
import { pipe } from "visual/utils/fp/pipe";
import { MValue, onNullish } from "visual/utils/value";
import * as Json from "../json";
import * as Num from "../number";
import * as Obj from "../object";
import { readWithParser } from "../readWithParser";
import * as Str from "../string";

export const parsePageCommon = (page: unknown): MValue<PageCommon> => {
  const reader = mPipe(
    Obj.read,
    readWithParser<Record<string, unknown>, PageCommon>({
      id: mPipe(Obj.readKey("id"), Str.read),
      data: pipe(
        Obj.readKey("data"),
        Json.read,
        Obj.read as () => PageCommon["data"] | undefined, // TODO: needs more thorough checking
        onNullish({ items: [] } as PageCommon["data"])
      ),
      dataVersion: pipe(Obj.readKey("dataVersion"), Num.read, onNullish(0)),
      title: pipe(Obj.readKey("title"), Str.read, onNullish("")),
      slug: pipe(Obj.readKey("slug"), Str.read, onNullish("")),
      status: (page) => {
        const status = mPipe(Obj.readKey("status"), Str.read)(page);

        switch (status) {
          case "draft":
            return "draft";
          case "publish":
          case "published":
            return "publish";
          default:
            // TODO: WP sends at export only id and data.
            // figure out what to do with all these defaults later
            return "draft"; // should be return undefined;
        }
      }
    })
  );

  return reader(page);
};
