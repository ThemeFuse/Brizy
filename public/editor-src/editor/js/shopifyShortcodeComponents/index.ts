import Config from "visual/global/Config";
import { Shortcodes } from "visual/types";
import getAddToCart from "./AddToCart";
import getBlogDescription from "./BlogPostContent";
import getBlogPostExcerpt from "./BlogPostExcerpt";
import getBlogPostImage from "./BlogPostImage";
import getBlogPostList from "./BlogPostList";
import getBlogPostMeta from "./BlogPostMeta";
import getBlogTitle from "./BlogTitle";
import getCollectionDescription from "./CollectionDescription";
import getCollectionImage from "./CollectionImage";
import getCollectionList from "./CollectionList";
import getCollectionTitle from "./CollectionTitle";
import getPrice from "./Price";
import getProductDescription from "./ProductDescription";
import getProductImage from "./ProductImage";
import getProductList from "./ProductList";
import getProductMetafield from "./ProductMetafield";
import getProductTitle from "./ProductTitle";
import getQuantity from "./Quantity";
import getVariant from "./Variant";
import getVendor from "./Vendor";

// import AliExpressReview from "./AliExpressReview";
// import AppstleSubscription from "./AppstleSubscription";
// import AreviewReviews from "./AreviewReviews";
// import AutomazilyOrderTracking from "./AutomazilyOrderTracking";
// import BISStock from "./BISStock";
// import BoldProduct from "./BoldProduct";
// import BoldSubscription from "./BoldSubscription";
// import EmailMarketing from "./EmailMarketing";
// import FastSimonUpsell from "./FastSimonUpsell";
// import FeraReviews from "./FeraReviews";
// import FrequentlyBought from "./FrequentlyBought";
// import GrowaveWishlist from "./GrowaveWishlist";
// import HeroWishList from "./HeroWishList";
// import HextomBadges from "./HextomBadges";
// import HulkOptions from "./HulkOptions";
// import InfiniteOptions from "./InfiniteOptions";
// import KiwiChart from "./KiwiChart";
// import KlavyioMarketing from "./KlavyioMarketing";
// import LaiReviews from "./LaiReviews";
// import LooxReview from "./LooxReview";
// import MarselloMarketing from "./MarselloMarketing";
// import OkendoReview from "./OkendoReview";
// import OmegaTracking from "./OmegaTracking";
// import OmnisendMarketing from "./OmnisendMarketing";
// import OnVoard from "./OnVoard";
// import ParcelPanel from "./ParcelPanel";
// import PaywhirlSubscription from "./PaywhirlSubscription";
// import PowrContactForm from "./PowrContactForm";
// import PreProduct from "./PreProduct";
// import ProductOptions from "./ProductOptions";
// import ProductReview from "./ProductReview";
// import PushOwlNotifications from "./PushOwlNotifications";
// import Quantity from "./Quantity";
// import RechargeSubscriptions from "./RechargeSubscriptions";
// import ReferralCandy from "./ReferralCandy";
// import ReviewByJudge from "./ReviewByJudge";
// import ReviewByOpinew from "./ReviewByOpinew";
// import ReviewByVitals from "./ReviewByVitals";
// import ReviewGrowave from "./ReviewGrowave";
// import SealSubscription from "./SealSubscription";
// import SnowBall from "./SnowBall";
// import SpecialOffers from "./SpecialOffers";
// import StampedBadge from "./StampedBadges";
// import StampedReviews from "./StampedReviews";
// import SwymWishList from "./SwymWishList";
// import TipoBooking from "./TipoBooking";
// import TrustedBadge from "./TrustedBadge";
// import TrustMeBadge from "./TrustMeBadge";
// import TrustProductRating from "./TrustProductRating";
// import TrustProductReview from "./TrustProductReview";
// import TrustSeals from "./TrustSeals";
// import UploadKit from "./UploadKit";
// import UpsellLimeSpot from "./UpsellLimeSpot";
// import Variations from "./Variations";
// import VideoShopping from "./VideoShopping";
// import WideBundle from "./WideBundle";
// import YotPoReview from "./YotPoReview";
// import ZeptoPersonalizer from "./ZeptoPersonalizer";
// import ZoorixUpsell from "./ZoorixUpsell";
// import AliReviews from "./ReviewByAli";
// import SMSMarketing from "./SMSMarketing";
// import PickyStory from "./PickyStory";
// import UnlimitedBundles from "./UnlimitedBundles";
// import WiserUpsell from "./WiserUpsell";
// import BoldBundles from "./BoldBundles";
// import CrossSell from "./CrossSell";

const config = ((): Shortcodes => {
  const config = Config.getAll();
  return {
    base: [
      { component: getProductTitle(config), pro: false },
      { component: getProductDescription(config), pro: false },
      { component: getProductImage(config), pro: false },
      { component: getProductList(config), pro: false },
      { component: getAddToCart(config), pro: false },
      { component: getPrice(config), pro: false },
      { component: getQuantity(config), pro: false },
      { component: getProductMetafield(config), pro: false },
      { component: getVariant(config), pro: false },
      // { component: Quantity, pro: false },
      // { component: ProductReview, pro: false },
      // { component: KlavyioMarketing, pro: false },
      // { component: PreProduct, pro: false },
      // { component: TrustSeals, pro: false },
      // { component: TrustProductRating, pro: false },
      // { component: TrustProductReview, pro: false },
      // { component: ReviewByVitals, pro: false },
      // { component: AliExpressReview, pro: false },
      // { component: SealSubscription, pro: false },
      // { component: OmegaTracking, pro: false },
      // { component: AppstleSubscription, pro: false },
      // { component: BoldSubscription, pro: false },
      // { component: ReviewByOpinew, pro: false },
      // { component: UploadKit, pro: false },
      // { component: BISStock, pro: false },
      // { component: ZeptoPersonalizer, pro: false },
      // { component: StampedReviews, pro: false },
      // { component: PaywhirlSubscription, pro: false },
      // { component: FastSimonUpsell, pro: false },
      // { component: TipoBooking, pro: false },
      // { component: ReviewByJudge, pro: false },
      // { component: ReviewGrowave, pro: false },
      // { component: YotPoReview, pro: false },
      // { component: UpsellLimeSpot, pro: false },
      // { component: GrowaveWishlist, pro: false },
      // { component: BoldProduct, pro: false },
      // { component: SnowBall, pro: false },
      // { component: HeroWishList, pro: false },
      // { component: SpecialOffers, pro: false },
      // { component: TrustedBadge, pro: false },
      // { component: OnVoard, pro: false },
      // { component: WideBundle, pro: false },
      // { component: HextomBadges, pro: false },
      // { component: ZoorixUpsell, pro: false },
      // { component: VideoShopping, pro: false },
      // { component: PushOwlNotifications, pro: false },
      // { component: InfiniteOptions, pro: false },
      // { component: HulkOptions, pro: false },
      // { component: KiwiChart, pro: false },
      // { component: OmnisendMarketing, pro: false },
      // { component: MarselloMarketing, pro: false },
      // { component: PowrContactForm, pro: false },
      // { component: EmailMarketing, pro: false },
      // { component: ParcelPanel, pro: false },
      // { component: ReferralCandy, pro: false },
      // { component: LaiReviews, pro: false },
      // { component: ProductOptions, pro: false },
      // { component: RechargeSubscriptions, pro: false },
      // { component: TrustMeBadge, pro: false },
      // { component: FeraReviews, pro: false },
      // { component: FrequentlyBought, pro: false },
      // { component: LooxReview, pro: false },
      // { component: AreviewReviews, pro: false },
      // { component: SwymWishList, pro: false },
      // { component: AutomazilyOrderTracking, pro: false },
      // { component: StampedBadge, pro: false },
      // { component: OkendoReview, pro: false },
      // { component: AliReviews, pro: false },
      // { component: SMSMarketing, pro: false },
      // { component: PickyStory, pro: false },
      // { component: UnlimitedBundles, pro: false },
      // { component: WiserUpsell, pro: false },
      // { component: BoldBundles, pro: false },
      // { component: Variations, pro: false },
      // { component: WiserUpsell, pro: false },
      // { component: CrossSell, pro: false },
      { component: getVendor(config), pro: false }
    ],
    blog: [
      { component: getBlogTitle(config), pro: false },
      { component: getBlogDescription(config), pro: false },
      { component: getBlogPostImage(config), pro: false },
      { component: getBlogPostList(config), pro: false },
      { component: getBlogPostMeta(config), pro: false },
      { component: getBlogPostExcerpt(config), pro: false }
    ],
    collection: [
      { component: getCollectionTitle(config), pro: false },
      { component: getCollectionDescription(config), pro: false },
      { component: getCollectionImage(config), pro: false },
      { component: getCollectionList(config), pro: false }
    ]
  };
})();

export default config;
