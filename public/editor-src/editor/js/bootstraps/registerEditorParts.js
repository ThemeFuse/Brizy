import Editor from "visual/global/Editor";
import Config from "visual/global/Config";

import editorComponents, { NotFoundComponent } from "visual/editorComponents";
import shortcodeComponents from "visual/shortcodeComponents";
import shopifyComponents from "visual/shopifyShortcodeComponents";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";

// components
for (const component of Object.values(editorComponents)) {
  Editor.registerComponent(component);
}
Editor.registerNotFoundComponent(NotFoundComponent);

// shortcode
Editor.registerShortcode(shortcodeComponents);

const config = Config.getAll();

if (isCloud(config) && isShopify(config)) {
  Editor.registerShopifyShortcode(shopifyComponents);
}
