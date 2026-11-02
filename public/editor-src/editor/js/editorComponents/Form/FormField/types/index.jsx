import Email from "./Email";
import NumberField from "./Number";
import Paragraph from "./Paragraph";
import Select from "./Select";
import Text from "./Text";

// No `__proto__: null` here, unlike the sibling maps in Facebook/Countdown:
// this map is consumed from TypeScript, where `__proto__: null` becomes an own
// property of the literal's type and poisons `keyof` and `Object.values`. The
// unknown-key guard lives at the lookup site in ../index.tsx instead.
export const components = {
  Email,
  Number: NumberField,
  Paragraph,
  Select,
  Text
};
