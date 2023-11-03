import { Patch } from "../types";
import { LinkDCPatch, fromLinkElementModel } from "./linkPatch";
import { LinkPatch, PatchValue, isDCPatch } from "./types";

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
