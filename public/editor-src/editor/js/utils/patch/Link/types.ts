import { ElementModel } from "visual/component/Elements/Types";

export interface LinkPatch {
  linkPopulation: string;
  linkExternalType: "linkPopulation" | "linkExternal";
}

interface LinkPatchValue extends ElementModel, LinkPatch {}

export type PatchValue = LinkPatchValue | Record<string, unknown>;

export const isDCPatch = (v: PatchValue): v is LinkPatchValue =>
  typeof v === "object" && "linkPopulation" in v;
