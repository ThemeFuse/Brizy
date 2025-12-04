import { Obj, Str } from "@brizy/readers";
import { parseStrict } from "fp-utilities";
import { Breadcrumb } from "visual/editorComponents/Breadcrumbs/types";
import { mPipe, pipe } from "visual/utils/fp";
import { readWithItemReader } from "visual/utils/reader/array";
import { onNullish, throwOnNullish } from "visual/utils/value";

const breadcrumbParser = parseStrict<unknown, Breadcrumb>({
  title: pipe(
    mPipe(Obj.read, Obj.readKey("title"), Str.read),
    throwOnNullish("Invalid: title")
  ),
  href: pipe(
    mPipe(Obj.read, Obj.readKey("url"), Str.read),
    throwOnNullish("Invalid: href")
  )
});

export const readBreadcrumbs = (content: unknown[]): Breadcrumb[] => {
  try {
    return pipe(
      Obj.read,
      readWithItemReader(breadcrumbParser),
      onNullish([] as Breadcrumb[])
    )(content);
  } catch (_) {
    return [];
  }
};
