import { IsEqual } from "visual/utils/types/Eq";
import { ChoiceWithPermalink } from ".";

export const eq: IsEqual<ChoiceWithPermalink> = (a, b) => a.value === b.value;
