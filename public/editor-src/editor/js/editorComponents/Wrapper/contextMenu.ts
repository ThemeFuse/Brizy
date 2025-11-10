import { Str } from "@brizy/readers";
import type { Dispatch } from "redux";
import { getIn } from "timm";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ContextGetItems } from "visual/editorComponents/EditorComponent/types";
import {
  createClassName,
  createPatch,
  createWrapperClassName,
  flattenDefaultValue
} from "visual/editorComponents/EditorComponent/utils";
import {
  ElementTypes,
  readElementType
} from "visual/global/Config/types/configs/ElementTypes";
import { type SymbolsCreatePayload, createSymbol } from "visual/redux/actions2";
import { symbolsSelector } from "visual/redux/selectors";
import { getFlatShortcodes } from "visual/shortcodeComponents/utils";
import { ECWID_CATEGORY_TYPE, ECWID_PRODUCT_TYPE } from "visual/utils/ecwid";
import { t } from "visual/utils/i18n";
import { isModel } from "visual/utils/models";
import { omitSymbolsKey } from "visual/utils/symbols";
import { type ElementModelWithSymbols } from "visual/utils/symbols/types";
import {
  getComponentDefaultValue,
  getComponentRulesValue
} from "visual/utils/traverse/common";
import { uuid } from "visual/utils/uuid";
import { getThirdPartyShortcodeTitle } from "./utils";

type Title<T extends ElementModel = ElementModel> = (v: T) => string;

type Translation<T extends ElementModel = ElementModel> = Record<
  string,
  string | Title<T>
>;

export const getTranslationsMap = (): Translation => ({
  RichText: t("Text"),
  Image: t("Image"),
  Video: t("Video"),
  VideoPlaylist: t("Playlist"),
  Spacer: t("Spacer"),
  Line: t("Line"),
  AnimatedHeadline: t("Animated Headline"),
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
  Timeline: t("Timeline"),
  Switcher: t("Switcher"),
  Table: t("Table"),
  ProgressBar: t("Progress"),
  Accordion: t("Accordion"),
  ImageGallery: t("Gallery"),
  Carousel: t("Carousel"),
  Row: t("Row"),
  Column: t("Column"),
  Posts: (v) => {
    const { type, component } = v;

    switch (component) {
      case ECWID_PRODUCT_TYPE:
        return t("Products");
      case ECWID_CATEGORY_TYPE:
        return t("Categories");
    }

    return type === "posts"
      ? t("Posts")
      : type === "upsell"
        ? t("Upsell")
        : type === "relatedProducts"
          ? t("Related Products")
          : type === "categories"
            ? t("Categories")
            : t("Products");
  },
  Archives: t("Archives"),
  Menu: t("Menu"),
  FacebookButton: t("Facebook Button"),
  FacebookComments: (v) => (v.review === "true" ? t("Review") : t("Comments")),
  FacebookEmbed: t("Facebook Embed"),
  FacebookPage: t("Facebook Page"),
  FacebookGroup: t("Facebook Group"),
  WPBreadcrumbs: (v) =>
    v.type === "woo" ? t("Product Breadcrumbs") : t("Breadcrumbs"),
  Audio: t("Audio"),
  Twitter: t("Twitter"),
  Facebook: t("Facebook"),
  Search: t("Search"),
  Login: t("Login"),
  Lottie: t("Lottie"),
  Filters: t("Filters"),
  StarRating: t("Rating"),
  ProtectedPage: t("Protected Form"),
  ResetPassword: t("Reset Password"),
  Translation: t("Translation"),
  Calendly: t("Calendly"),

  Alert: t("Alert"),
  TableOfContents: t("Table of Contents"),
  Flipbox: t("Flipbox"),
  PostInfo: t("Post Info"),
  PostNavigation: t("Post Navigation"),
  Breadcrumbs: t("Breadcrumbs"),
  ShareButton: t("Share Button"),
  Paypal: t("Paypal"),
  InstagramFeed: t("Instagram Feed"),
  LinkedinFeed: t("Linkedin Feed"),
  Chart: t("Chart"),

  // WP
  WPSidebar: t("Sidebar"),
  WPCustomShortcode: t("Shortcode"),
  WPPostNavigation: t("Post Navigation"),
  WPPostsTitle: (v) =>
    v?.type === "woo" ? t("Product Title") : t("Post Title"),
  WPPostContent: (v) =>
    v?.type === "woo" ? t("Product Content") : t("Post Content"),
  WPPostExcerpt: t("Post Excerpt"),
  WPNavigation: t("Menu"),
  WPPostInfo: t("Post Info"),
  WPComments: t("Comments"),
  WOOExcerpt: t("Product Excerpt"),
  WOOProductMeta: t("Product Meta"),
  WOORating: t("Product Rating"),
  WOOCart: t("Shop Cart"),
  WOOAddToCart: t("Add to cart"),
  WOOPrice: t("Product Price"),
  WOOStock: t("Product Stock"),
  WOOSku: t("Product SKU"),
  WOOGallery: t("Product Gallery"),
  WOOAttributes: t("Product Attributes"),
  WOOCategories: t("Shop Categories"),
  WOOProducts: t("Shop Products"),
  WOOPages: t("Shop Pages"),
  EcwidMyAccount: t("My Account"),
  EcwidCart: t("Cart & Checkout"),
  EcwidProduct: t("Product"),
  EcwidProducts: t("Products"),
  EcwidShoppingBag: t("Shopping Bag"),
  EcwidFavorites: t("Favorites"),
  EcwidSearch: t("Filters"),
  EcwidPrice: t("Price"),
  EcwidAddToCart: t("Add To Cart"),

  // Shopify
  AddToCart: t("Add To Cart"),
  Quantity: t("Quantity"),
  Price: t("Price"),
  KlavyioMarketing: t("Email Marketing by Klaviyo"),
  PreProduct: t("PreProduct"),
  TrustProductReview: t("Trust Product Review"),
  TrustProductRating: t("Trust Product Rating"),
  TrustSeals: t("Trust Product Seals"),
  ReviewVitals: t("Reviews by Vitals"),
  AliExpressReview: t("Widgets by AliExpress"),
  SealSubscription: t("Subscription by Seal"),
  OmegaTracking: t("Tracking by Omega"),
  AppstleSubscription: t("Subscription by Appstle"),
  BoldSubscription: t("Subscription by Bold"),
  ReviewOpinew: t("Review by Opinew"),
  UploadKit: t("Upload Fields by UploadKit"),
  BISStock: t("Back in Stock"),
  ZeptoPersonalizer: t("Personalizer by Zepto"),
  StampedReviews: t("Reviews by Stamped"),
  PaywhirlSubscription: t("Subscription by Paywhirl"),
  FastSimonUpsell: t("Upsell by FastSimon"),
  TipoBooking: t("Appointment Booking by Tipo"),
  ReviewJudgeMe: t("Review by Judge"),
  ReviewGrowave: t("Review by Growave"),
  YotPoReview: t("YotPo Product Review"),
  LimeSpot: t("Upsell by LimeSpot"),
  GrowaveWishlist: t("Wishlist by Growave"),
  BoldProduct: t("Product Options by Bold"),
  SnowBall: t("Marketing by Social SnowBall"),
  HeroWishList: t("Wishlist by Hero"),
  SpecialOffers: t("Special Offers"),
  TrustedBadge: t("Badges by Trusted"),
  OnVoard: t("Notifications by OnVoard"),
  WideBundle: t("WideBundle"),
  HextomBadges: t("Badges by Hextom"),
  ZoorixUpsell: t("Upsell by Zoorix"),
  VideoShopping: t("Video Shopping"),
  PushOwlNotifications: t("Notifications by PushOwl"),
  InfiniteOptions: t("Infinite Options by ShopPad"),
  HulkOptions: t("Product Options by Hulk"),
  KiwiChart: t("Kiwi Size Chart & Recommender"),
  OmnisendMarketing: t("Marketing by Omnisend"),
  MarselloMarketing: t("Marketing by Marsello"),
  PowrContactForm: t("Advanced Contact Form by POWR"),
  EmailMarketing: t("Email Marketing"),
  ParcelPanel: t("Parcel Panel Order Tracking"),
  ReferralCandy: t("Notifications by ReferralCandy"),
  LaiReviews: t("Reviews by Lai"),
  ProductOptions: t("Product Options"),
  RechargeSubscriptions: t("Subscriptions by Recharge"),
  FeraReviews: t("Reviews by Fera"),
  FrequentlyBought: t("Frequently Bought"),
  LooxReview: t("Review by Loox"),
  AreviewReviews: t("Reviews by Areview"),
  SwymWishList: t("WishList by Swym"),
  AutomizelyOrderTracking: t("Order Tracking by Automizely"),
  StampedBadge: t("Badges by Stamped"),
  OkendoReview: t("Review by Okendo"),
  AliReviews: t("Reviews by Ali"),
  SMSMarketing: t("SMS Marketing by Yotpo"),
  PickyStory: t("Widgets by PickyStory"),
  ReviewRivyo: t("Review by Rivyo"),
  UnlimitedBundles: t("Unlimited Bundles"),
  WiserUpsell: t("Upsell by Wiser"),
  BoldBundles: t("Bundles by Bold"),
  CrossSell: t("Cross Sell"),
  ProductMetafield: t("Metafield"),
  BlogPostMeta: t("Meta"),
  Vendor: t("Vendor"),
  Variant: t("Variant"),

  // Ministry Brands
  MinistryBrandsGroupLayout: t("Group Layout"),
  MinistryBrandsGroupSlider: t("Group Slider"),
  MinistryBrandsEventLayout: t("Event Layout"),
  MinistryBrandsEventCalendar: t("Event Calendar"),
  MinistryBrandsSermonLayout: t("Sermon Layout"),
  MinistryBrandsSermonList: t("Sermon List"),
  MinistryBrandsSermonFeatured: t("Sermon Featured"),
  MinistryBrandsSermonDetail: t("Sermon Detail"),
  MinistryBrandsGroupList: t("Group List"),
  MinistryBrandsGroupDetail: t("Group Detail"),
  MinistryBrandsEventFeatured: t("Event Featured"),
  MinistryBrandsGroupFeatured: t("Group Featured"),
  MinistryBrandsEventList: t("Event List"),
  MinistryBrandsEventDetail: t("Event Detail"),
  MinistryBrandsFormWidget: t("FMS Forms"),
  MinistryBrandsPrayerWidget: t("Prayer Widget"),
  MinistryBrandsArticleDetail: t("Article Detail"),
  MinistryBrandsArticleList: t("Article List"),
  MinistryBrandsStaffDetail: t("Staff Detail"),
  MinistryBrandsArticleFeatured: t("Article Featured"),

  // Leadific
  Leadific: t("Leadific")
});

const getItems: ContextGetItems<ElementModel> = (v, component) => {
  const config = component.getGlobalConfig();
  const store = component.getReduxStore().getState();
  const symbols = symbolsSelector(store);

  const shortcodes = getFlatShortcodes(config);
  const { items } = v;
  const model = items?.[0] ?? {};

  if (!isModel(model)) {
    return [];
  }

  const { type: _type, value } = model;
  const type = readElementType(_type);

  const flattedShortcodes = Object.values(shortcodes).flat();
  const { icon } = flattedShortcodes
    .map((item) => ({
      type: getIn(item.component.resolve, ["value", "items", 0, "type"] ?? ""),
      icon: item.component.icon
    }))
    .find((item) => item.type === type) ?? { icon: "" };

  const translates = getTranslationsMap();
  const thirdPartyId = value?.thirdPartyId;
  let title = type
    ? translates[type]
    : getThirdPartyShortcodeTitle(flattedShortcodes, Str.read(thirdPartyId)); // TODO: See if we'll need icons & prop

  if (typeof title === "function") {
    title = title(value);
  }

  const currentSymbolUid = (value as ElementModelWithSymbols)?.classes?.[0];

  const symbolModel = symbols.classes.find((s) => s.uid === currentSymbolUid)
    ?.model.v;

  return [
    {
      id: "main",
      type: "group",
      title,
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
              const dispatch = component.getReduxDispatch() as Dispatch;
              const defaultValue = getComponentDefaultValue(type);
              const rulesValue = getComponentRulesValue(store, value);
              const wrapperDefaultValue = getComponentDefaultValue(
                ElementTypes.Wrapper
              );
              const wrapperRulesValue = component.getStylesValue();

              const defaultStyle = flattenDefaultValue(
                defaultValue?.style ?? {}
              );
              const defaultWrapperStyle = flattenDefaultValue(
                getComponentDefaultValue(ElementTypes.Wrapper)?.style ?? {}
              );

              const childrenSymbolId = uuid();
              const wrapperSymbolId = uuid();

              const className = `brz-${type.toLowerCase()}-${childrenSymbolId}`;
              const label = createClassName(type, symbols.classes);
              const wrapperLabel = createWrapperClassName(
                ElementTypes.Wrapper,
                type,
                symbols.classes
              );
              const wrapperClassName = `brz-${ElementTypes.Wrapper.toLowerCase()}-${wrapperSymbolId}`;

              const patch =
                createPatch({ ...symbolModel, ...value }, defaultStyle).style ??
                ({} as ElementModel);

              const wrapperPatch = {
                ...(createPatch(v, defaultWrapperStyle).style ??
                  ({} as ElementModel)),
                childrenId: childrenSymbolId
              };

              const newSymbols: SymbolsCreatePayload = {
                element: undefined,
                cssClasses: [
                  {
                    uid: childrenSymbolId,
                    label,
                    className,
                    type,
                    model: {
                      vd: omitSymbolsKey(defaultValue?.style ?? {}),
                      vs: rulesValue ?? {},
                      v: omitSymbolsKey(patch)
                    }
                  },
                  {
                    uid: uuid(),
                    label: wrapperLabel,
                    className: wrapperClassName,
                    type: ElementTypes.Wrapper,
                    model: {
                      vd: omitSymbolsKey(wrapperDefaultValue?.style ?? {}),
                      vs: wrapperRulesValue ?? {},
                      v: omitSymbolsKey(wrapperPatch)
                    }
                  }
                ]
              };

              dispatch(createSymbol(newSymbols));
            } else {
              console.warn("Missing Type & Value");
            }
          }
        }
      ]
    }
  ];
};

export default {
  getItems
};
