import { translate } from "./translate";

export const t = (key: string): string => translate({}, key);
