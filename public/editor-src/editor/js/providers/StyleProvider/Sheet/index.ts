import classNames from "classnames";
import { css } from "visual/utils/cssStyle/css/tujur";
import type { OutputStyleWithSymbol } from "visual/utils/cssStyle/types";
import type { MValue } from "visual/utils/value";
import type { CSSOrdered, CSSSheet, ClassNamesCounter, Data } from "./types";

export class Sheet {
  private css = new Map<string, CSSSheet>();
  private doc: Document | undefined;
  private cssOrdered: CSSOrdered = {
    default: [],
    rules: [],
    custom: [],
    symbol: []
  };

  private classNamesCounter: ClassNamesCounter = {};

  constructor(doc?: Document) {
    this.doc = doc ?? (typeof window === "undefined" ? undefined : document);
  }

  setDoc(doc: Document): void {
    this.doc = doc;
  }

  getDoc(): Document | undefined {
    return this.doc;
  }

  setCSSOrdered(params: { type: keyof CSSOrdered; data: Data }): void {
    const { type, data } = params;

    this.cssOrdered[type].push(data);
  }

  incrementClassNameCounter(className: string): number {
    const count = (this.classNamesCounter[className] ?? 0) + 1;

    this.classNamesCounter[className] = count;

    return count;
  }

  isIncrementalClassName(className: string): boolean {
    const isDefault = this.cssOrdered.default.find(
      (f) => f.className === className
    );

    const isRules = this.cssOrdered.rules.find(
      (f) => f.className === className
    );

    return !!isDefault || !!isRules;
  }

  decrementClassNameCounter(className: string): number {
    const count = Math.max(0, (this.classNamesCounter[className] ?? 1) - 1);

    this.classNamesCounter[className] = count;

    return count;
  }

  getClassNamesCounter(): ClassNamesCounter {
    return this.classNamesCounter;
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

  deleteFromCSSOrdered(key: string): void {
    const types = Object.keys(this.cssOrdered) as Array<keyof CSSOrdered>;

    for (const type of types) {
      this.cssOrdered[type] = this.cssOrdered[type].filter(
        (item) => item.className !== key
      );
    }
  }

  cleanupClassName(className: string, countClassNames?: boolean): void {
    const data = this.css.get(className);

    if (!data) {
      return;
    }

    if (countClassNames) {
      const count = this.decrementClassNameCounter(className);

      if (count > 0) {
        return;
      }

      delete this.classNamesCounter[className];
    }

    if (data.node) {
      data.node.remove();
    }

    this.delete(className);
    this.deleteFromCSSOrdered(className);
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
  css: OutputStyleWithSymbol;
  customStylesClassName: string;
  className?: Array<string | Record<string, boolean>>;
}

export function createSheet(options: Options): { className: string } {
  const { className, css: _css, cache, customStylesClassName } = options;
  const { componentId, sheet } = cache;

  // Append to Body & return theirs classNames(`brz-css-${hash} brz-css-${hash}`)
  const dynamicClassNames = css(
    componentId,
    customStylesClassName,
    _css,
    sheet
  );
  const cls = classNames(className, dynamicClassNames);

  return { className: cls };
}
