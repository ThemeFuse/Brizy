import { ElementModel } from "visual/component/Elements/Types";
import { isObject } from "visual/utils/reader/object";

export interface LinkPatch {
  linkPopulation: string;
  linkExternalType: "linkPopulation" | "linkExternal";
}

interface LinkPatchValue extends ElementModel, LinkPatch {}

export type PatchValue = LinkPatchValue | Record<string, unknown>;

export const isDCPatch = (v: PatchValue): v is LinkPatchValue =>
  isObject(v) && "linkPopulation" in v;
