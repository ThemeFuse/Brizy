import editorComponents, { NotFoundComponent } from "visual/editorComponents";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import Editor from "visual/global/Editor";
import shopifyComponents from "visual/shopifyShortcodeComponents";
import shortcodeComponents from "visual/shortcodeComponents";

// components
for (const component of Object.values(editorComponents)) {
  // @ts-expect-error: Argument of type 'typeof EditorComponent'
  Editor.registerComponent(component);
}

// @ts-expect-error: Argument of type 'typeof EditorComponent'
Editor.registerNotFoundComponent(NotFoundComponent);

// shortcode
Editor.registerShortcode(shortcodeComponents);

const config = Config.getAll();

if (isCloud(config) && isShopify(config)) {
  Editor.registerShopifyShortcode(shopifyComponents);
}

const thirdPartyComponents = config.thirdPartyComponents;

if (thirdPartyComponents) {
  Object.values(thirdPartyComponents).forEach((data) => {
    Editor.registerThirdPartyElement(data);
  });
}
