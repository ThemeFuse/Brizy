import classNames from "classnames";
import { css } from "visual/utils/cssStyle/css/tujur";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { MValue } from "visual/utils/value";
import { CSSOrdered, CSSSheet } from "./types";

export class Sheet {
  private css = new Map<string, CSSSheet>();
  private doc: Document | undefined;
  private cssOrdered: CSSOrdered = {
    default: [],
    rules: [],
    custom: []
  };

  constructor(doc?: Document) {
    this.doc = doc ?? (typeof window === "undefined" ? undefined : document);
  }

  setDoc(doc: Document): void {
    this.doc = doc;
  }

  getDoc(): Document | undefined {
    return this.doc;
  }

  getCSSOrdered(): CSSOrdered {
    return this.cssOrdered;
  }

  set(key: string, value: CSSSheet) {
    this.css.set(key, value);
  }

  get(key: string): MValue<CSSSheet> {
    return this.css.get(key);
  }

  delete(key: string) {
    this.css.delete(key);
  }

  purge() {
    this.css.clear();
  }

  getStyles(): Array<{ className: string; cssText: string }> {
    const styles: Array<{ className: string; cssText: string }> = [];

    for (const css of this.css.values()) {
      styles.push({
        className: css.className,
        cssText: css.cssText
      });
    }

    return styles;
  }
}

interface Cache {
  sheet: Readonly<Sheet>;
  id: string;
  componentId: string;
}

export function createCache({
  id,
  componentId,
  sheet
}: {
  id: string;
  componentId: string;
  sheet?: Readonly<Sheet>;
}): Cache {
  return {
    id,
    componentId,
    sheet: sheet ?? new Sheet()
  };
}

interface Options {
  cache: Cache;
  css: OutputStyle;
  className?: Array<string | Record<string, boolean>>;
}

export function createSheet(options: Options): { className: string } {
  const { className, css: _css, cache } = options;
  const { componentId, id, sheet } = cache;

  // Append to Body & return theirs classNames(`brz-css-${hash} brz-css-${hash}`)
  const dynamicClassNames = css(componentId, id, _css, sheet);
  const cls = classNames(className, dynamicClassNames);

  return { className: cls };
}
