import { Obj } from "@brizy/readers";
import { get } from "es-toolkit/compat";
import { Dispatch } from "redux";
import { ElementModelType2 } from "visual/component/Elements/Types";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { readElementType } from "visual/global/Config/types/configs/ElementTypes";
import { symbolsSelector } from "visual/redux/selectors";
import { getFlatShortcodes } from "visual/shortcodeComponents/utils";
import { t } from "visual/utils/i18n";
import { handleComponentSymbolCreate } from "visual/utils/symbols";
import { ElementModelWithSymbols } from "visual/utils/symbols/types";
import { MValue } from "visual/utils/value";
import type { Value } from "./index";

const getTranslationsMap = (): Record<string, string> => ({
  RichText: t("Text"),
  Image: t("Image"),
  Video: t("Video"),
  VideoPlaylist: t("Playlist"),
  Spacer: t("Spacer"),
  Line: t("Line"),
  Map: t("Map"),
  EmbedCode: t("Embed"),
  Form: t("Form"),
  Form2: t("Form"),
  IconText: t("Icon Box"),
  SoundCloud: t("SoundCloud"),
  Counter: t("Counter"),
  Countdown: t("Countdown"),
  Countdown2: t("Countdown"),
  Tabs: t("Tabs"),
  TimeLine: t("Timeline"),
  BusinessHour: t("Business Hour"),
  Switcher: t("Switcher"),
  ProgressBar: t("Progress"),
  Accordion: t("Accordion"),
  ImageGallery: t("Gallery"),
  Carousel: t("Carousel"),
  Row: t("Row"),
  Column: t("Column"),
  WPSidebar: t("Sidebar"),
  WPCustomShortcode: t("Shortcode"),
  WPPostsTitle: t("Post Title"),
  WPNavigation: t("Menu"),
  WPPostExcerpt: t("Post Excerpt"),
  WPPostNavigation: t("Post Navigation"),
  Posts: t("Posts"),
  Archives: t("Archives"),
  Menu: t("Menu"),
  FacebookButton: t("Facebook Button"),
  FacebookComments: t("Comments"),
  FacebookEmbed: t("Facebook Embed"),
  FacebookPage: t("Facebook Page"),
  FacebookGroup: t("Facebook Group"),
  WPBreadcrumbs: t("Breadcrumbs"),
  WPPostInfo: t("Post Info"),
  WPPostContent: t("Post Content"),
  // WPPostInfo: t("Post info")
  Audio: t("Audio"),
  Twitter: t("Twitter"),
  Facebook: t("Facebook"),
  WPComments: t("Comments"),
  Search: t("Search"),
  WOOProductMeta: t("Product Meta"),
  WOORating: t("Product Rating"),
  WOOCart: t("WooCommerce Cart"),
  Login: t("Login"),
  Shape: t("Shape"),
  Icon: t("Icon"),
  Button: t("Button")
});

export default {
  getItems
};

function getItems(v: Value, component: EditorComponent) {
  const config = component.getGlobalConfig();
  const { essentials } = getFlatShortcodes(config);

  const { icon = "" } =
    essentials?.find(
      (item) =>
        get(item, ["component", "resolve", "value", "items", "type"]) ===
        v.items[0].type
    )?.component || {};
  const translations = getTranslationsMap();

  const model = v.items[0] as MValue<ElementModelType2>;
  const { type: _type, value: _value } = model ?? {};
  const type = readElementType(_type);
  const value = Obj.read(_value);

  const store = component.getReduxStore().getState();
  const symbols = symbolsSelector(store);

  const currentSymbolUid = (value as ElementModelWithSymbols)?.classes?.[0];

  const symbolModel = symbols.classes.find((s) => s.uid === currentSymbolUid)
    ?.model.v;

  return [
    {
      id: "main",
      type: "group",
      title: translations[v.items[0].type],
      icon,
      items: [
        {
          id: "symbol",
          type: "button",
          title: t("Create Symbol"),
          helperText: () => "",
          disabled: true,
          onChange: () => {
            if (type && value) {
              handleComponentSymbolCreate({
                type,
                value: {
                  ...symbolModel,
                  ...value
                },
                store,
                onChange: component.getReduxDispatch() as Dispatch
              });
            }
          }
        }
      ]
    }
  ];
}
