import { ElementModel } from "visual/component/Elements/Types";
import { Params } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { MBMetaPrefixKey } from "../utils/types";
import { getItems as _getItems } from "./toolbarMinistryBrandsMeta";

export const toolbarMinistryBrandsMeta = (metaPrefixKey: MBMetaPrefixKey) => ({
  getItems: <
    M extends ElementModel,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    P extends Record<string, any> = Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    S extends Record<string, any> = Record<string, unknown>
  >(
    data: Params<M, P, S>
  ): ToolbarItemType[] =>
    _getItems<M, P, S>({
      ...data,
      v: { ...data.v, metaPrefixKey }
    })
});
