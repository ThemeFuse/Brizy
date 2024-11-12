import editorComponents, { NotFoundComponent } from "visual/editorComponents";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import Editor from "visual/global/Editor";
import { getShopifyShortcodeComponents } from "visual/shopifyShortcodeComponents";
import { getShortcodeComponents } from "visual/shortcodeComponents";

const config = Config.getAll();

// components
for (const component of Object.values(editorComponents)) {
  // @ts-expect-error: Argument of type 'typeof EditorComponent'
  Editor.registerComponent(component);
}

// @ts-expect-error: Argument of type 'typeof EditorComponent'
Editor.registerNotFoundComponent(NotFoundComponent);

// shortcode
Editor.registerShortcode(getShortcodeComponents(config));

if (isCloud(config) && isShopify(config)) {
  Editor.registerShopifyShortcode(getShopifyShortcodeComponents(config));
}

const thirdPartyComponents = config.thirdPartyComponents;

if (thirdPartyComponents) {
  Object.values(thirdPartyComponents).forEach((data) => {
    Editor.registerThirdPartyElement(data);
  });
}
