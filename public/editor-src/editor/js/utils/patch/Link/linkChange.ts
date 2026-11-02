import type { Patch } from "../types";
import { fromLinkElementModel, type LinkDCPatch } from "./linkPatch";
import { isDCPatch, type LinkPatch, type PatchValue } from "./types";

export const patchOnDCChange = ({
  linkPopulation
}: LinkDCPatch): LinkPatch => ({
  linkPopulation,
  linkExternalType: linkPopulation ? "linkPopulation" : "linkExternal"
});

export const handleLinkChange = (patch: PatchValue): Patch => {
  const linkDC = isDCPatch(patch) && fromLinkElementModel(patch);
  if (linkDC) {
    return patchOnDCChange(linkDC);
  }
  return {};
};
