import { or, parseStrict } from "fp-utilities";
import { Breadcrumb } from "visual/editorComponents/Breadcrumbs/types";
import { mPipe, pipe } from "visual/utils/fp";
import { readWithItemReader } from "visual/utils/reader/array";
import { read as readJson } from "visual/utils/reader/json";
import { readKey, read as readObject } from "visual/utils/reader/object";
import { read as readString } from "visual/utils/reader/string";
import { onNullish, throwOnNullish } from "visual/utils/value";

const breadcrumbParser = parseStrict<unknown, Breadcrumb>({
  title: pipe(
    mPipe(readObject, readKey("title"), readString),
    throwOnNullish("Invalid: title")
  ),
  href: pipe(
    mPipe(readObject, readKey("url"), readString),
    throwOnNullish("Invalid: href")
  )
});

export const readBreadcrumbs = (content: string): Breadcrumb[] => {
  try {
    return pipe(
      readJson,
      readObject,
      or(
        readWithItemReader(breadcrumbParser),
        mPipe(breadcrumbParser, (v) => [v])
      ),
      onNullish([] as Breadcrumb[])
    )(content);
  } catch (e) {
    return [];
  }
};
