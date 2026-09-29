import type { IsEqual } from "visual/utils/types/Eq";
import type { ChoiceWithPermalink } from ".";

export const eq: IsEqual<ChoiceWithPermalink> = (a, b) => a.value === b.value;
