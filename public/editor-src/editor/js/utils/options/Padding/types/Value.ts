import type { Positive } from "visual/utils/math/Positive";
import type { Spacing } from "visual/utils/options/utils/Spacing";
import type { SpacingUnit } from "visual/utils/options/utils/SpacingUnit";

export * from "visual/utils/options/utils/Spacing";

export type Value = Spacing<Positive, SpacingUnit>;
