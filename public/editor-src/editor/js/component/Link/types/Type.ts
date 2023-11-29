import { MRead, Reader } from "visual/utils/types/Type";

export interface LinkData {
  linkPage: string;
  linkSource: string;
  linkType: Type;
  linkExternal: string;
  linkExternalBlank: string;
  linkExternalRel: string;
  linkPopup: string;
  linkUpload: string;
  linkLightBox: string;
  linkAnchor: string;
  linkToSlide: number;
  linkPopulation: string;
  linkExternalType: ExternalType;
  linkPopulationEntityType: string;
  linkPopulationEntityId: string;
}

export type Type =
  | "external"
  | "anchor"
  | "story"
  | "lightBox"
  | "popup"
  | "upload"
  | "action"
  | "page";

export type ExternalType = "linkExternal" | "linkPopulation";

export const types: Type[] = [
  "external",
  "anchor",
  "story",
  "lightBox",
  "popup",
  "upload",
  "action",
  "page"
];

export const externalTypes: ExternalType[] = ["linkExternal", "linkPopulation"];

export const read: Reader<Type> = (v) =>
  types.includes(v as Type) ? (v as Type) : undefined;

export const empty: Type = "external";

export const mRead: MRead<Type> = (v) => read(v) ?? empty;

export const emptyExternal: ExternalType = "linkExternal";

export const readExternal: Reader<ExternalType> = (v) =>
  externalTypes.includes(v as ExternalType) ? (v as ExternalType) : undefined;

export const readExternalType: MRead<ExternalType> = (v) =>
  readExternal(v) ?? emptyExternal;
