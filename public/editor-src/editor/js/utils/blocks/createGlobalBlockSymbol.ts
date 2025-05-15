import { ElementModelType } from "visual/component/Elements/Types";

interface Data {
  uid: string;
  blockId?: string;
}
export interface GlobalBlockSymbol extends ElementModelType {
  blockId: string;
  type: "GlobalBlock";
  value: { _id: string };
}

export function createGlobalBlockSymbol(data: Data): GlobalBlockSymbol {
  return {
    blockId: data.blockId ?? "Kit2Blank000Light",
    type: "GlobalBlock",
    value: { _id: data.uid }
  };
}
