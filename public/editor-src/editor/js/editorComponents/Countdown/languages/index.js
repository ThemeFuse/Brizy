import de from "./de.js";
import en from "./en.js";
import es from "./es.js";
import fr from "./fr.js";
import it from "./it.js";
import nl from "./nl.js";
import ru from "./ru.js";

// `__proto__: null` keeps `languages[id]` behaving like the module namespace
// object this replaced: an unknown id yields undefined rather than an
// inherited Object.prototype member, so the `|| languages.en` fallback holds.
export const languages = { __proto__: null, de, en, es, fr, it, nl, ru };
