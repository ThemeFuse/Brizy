import { ApiProxy } from "./ApiProxy";

export type DynamicContentObj = { [k: string]: string };
export type DynamicContentObjComplete = {
  type: "complete";
  obj: DynamicContentObj;
};
export type DynamicContentObjIncomplete = {
  type: "incomplete";
  _getCompleteAborted: boolean;
  partial: DynamicContentObj;
  getComplete: () => Promise<DynamicContentObj>;
  abortGetComplete: () => void;
};

export function getDynamicContentObj(placeholders: {
  [k: string]: string;
}): DynamicContentObjComplete | DynamicContentObjIncomplete {
  if (IS_PREVIEW) {
    return {
      type: "complete",
      obj: placeholders
    };
  }

  const toFetchK: string[] = [];
  const toFetchV: string[] = [];
  const partial: DynamicContentObj = {};

  for (const [key, placeholder] of Object.entries(placeholders)) {
    const cached = ApiProxy.cache.get(placeholder);

    if (cached === undefined) {
      toFetchK.push(key);
      toFetchV.push(placeholder);
    } else {
      partial[key] = cached;
    }
  }

  if (toFetchK.length === 0) {
    // partial is complete here
    return {
      type: "complete",
      obj: partial
    };
  } else {
    return {
      type: "incomplete",
      _getCompleteAborted: false,
      partial,
      async getComplete(): Promise<DynamicContentObj> {
        const r = await ApiProxy.getDynamicContent(toFetchV);

        if (this._getCompleteAborted) {
          throw "";
        }

        const missing: DynamicContentObj = {};
        for (let i = 0; i < r.length; i++) {
          missing[toFetchK[i]] = r[i];
        }

        return {
          ...partial,
          ...missing
        };
      },
      abortGetComplete(): void {
        this._getCompleteAborted = true;
      }
    };
  }
}
