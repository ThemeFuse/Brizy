import type { ElementModel } from "visual/component/Elements/Types";
import type { Params } from "visual/editorComponents/EditorComponent/types";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { MBMetaPrefixKey } from "../utils/types";
import { getItems as _getItems } from "./toolbarMinistryBrandsMeta";

export const toolbarMinistryBrandsMeta = (metaPrefixKey: MBMetaPrefixKey) => ({
  getItems: <
    M extends ElementModel,
    // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
    P extends Record<string, any> = Record<string, unknown>,
    // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
    S extends Record<string, any> = Record<string, unknown>
  >(
    data: Params<M, P, S>
  ): ToolbarItemType[] =>
    _getItems<M, P, S>({
      ...data,
      v: { ...data.v, metaPrefixKey }
    })
});
