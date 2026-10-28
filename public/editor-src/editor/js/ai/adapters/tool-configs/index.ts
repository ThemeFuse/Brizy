import type { ToolConfig } from "../types";
import { addAccordionConfig, updateAccordionConfig } from "./accordion";
import { addAlertConfig, updateAlertConfig } from "./alert";
import {
  addAnimatedHeadlineConfig,
  updateAnimatedHeadlineConfig
} from "./animatedHeadline";
import { addAudioConfig, updateAudioConfig } from "./audio";
import { addBreadcrumbsConfig, updateBreadcrumbsConfig } from "./breadcrumbs";
import { addButtonConfig, updateButtonConfig } from "./button";
import { addCalendlyConfig, updateCalendlyConfig } from "./calendly";
import { addCarouselConfig, updateCarouselConfig } from "./carousel";
import { addChartConfig, updateChartConfig } from "./chart";
import { updateCloneableConfig } from "./cloneable";
import { addColumnConfig, updateColumnConfig } from "./column";
import { addCountdownConfig, updateCountdownConfig } from "./countdown2";
import { addCounterConfig, updateCounterConfig } from "./counter";
import { addEmbedCodeConfig, updateEmbedCodeConfig } from "./embedCode";
import { addFlipboxConfig, updateFlipboxConfig } from "./flipbox";
import {
  addFormConfig,
  addFormFieldConfig,
  updateFormConfig,
  updateFormFieldConfig
} from "./form2";
import { addIconConfig, updateIconConfig } from "./icon";
import { addIconTextConfig, updateIconTextConfig } from "./iconText";
import { addImageConfig, updateImageConfig } from "./image";
import {
  addImageComparisonConfig,
  updateImageComparisonConfig
} from "./imageComparison";
import {
  addImageGalleryConfig,
  addImageGalleryPhotosConfig,
  updateImageGalleryConfig
} from "./imageGallery";
import {
  addInstagramFeedConfig,
  updateInstagramFeedConfig
} from "./instagramFeed";
import { addLineConfig, updateLineConfig } from "./line";
import {
  addLoginConfig,
  updateLoginConfig,
  updateLoginFieldConfig
} from "./login";
import { addLottieConfig, updateLottieConfig } from "./lottie";
import { addMapConfig, updateMapConfig } from "./map";
import { addMenuConfig, updateMenuConfig } from "./menu";
import { addPaypalConfig, updatePaypalConfig } from "./paypal";
import {
  addPostNavigationConfig,
  updatePostNavigationConfig
} from "./postNavigation";
import { addProgressBarConfig, updateProgressBarConfig } from "./progressBar";
import {
  addProtectedFormConfig,
  updateProtectedFormConfig
} from "./protectedPage";
import {
  addResetPasswordConfig,
  updateResetPasswordConfig
} from "./resetPassword";
import { addTextConfig, updateTextConfig } from "./richText";
import { addRowConfig, updateRowConfig } from "./row";
import { updateSectionFooterConfig } from "./sectionFooter";
import {
  updateSectionHeaderItemConfig,
  updateSectionHeaderStickyItemConfig
} from "./sectionHeader";
import { updateSectionItemConfig } from "./sectionItem";
import { addShapeConfig, updateShapeConfig } from "./shape";
import { addShareButtonConfig } from "./shareButton";
import { addSoundCloudConfig, updateSoundCloudConfig } from "./soundCloud";
import { addSpacerConfig, updateSpacerConfig } from "./spacer";
import { addStarRatingConfig, updateStarRatingConfig } from "./starRating";
import { addSwitcherConfig, updateSwitcherConfig } from "./switcher";
import {
  addTableConfig,
  updateTableAsideConfig,
  updateTableBodyConfig,
  updateTableConfig,
  updateTableHeadConfig
} from "./table";
import {
  addTableOfContentsConfig,
  updateTableOfContentsConfig
} from "./tableOfContents";
import { addTabsConfig, updateTabsConfig } from "./tabs";
import {
  addTimelineConfig,
  addTimelineItemConfig,
  updateTimelineConfig,
  updateTimelineItemConfig
} from "./timeline";
import { addTranslationConfig, updateTranslationConfig } from "./translation";
import { addVideoConfig, updateVideoConfig } from "./video";
import {
  addVideoPlaylistConfig,
  updateVideoPlaylistConfig
} from "./videoPlaylist";
import { updateWrapperConfig } from "./wrapper";

/**
 * Every element's wiring, keyed by the alias its catalog tools resolve through.
 *
 * The tools the LLM sees live in `@brizy/ai-tools`; what is here is the half
 * that only the editor can supply — the element type, the prop normalisation,
 * and the hooks that need the element's stored state.
 */
export const componentConfigs: ToolConfig[] = [
  addAccordionConfig,
  addAlertConfig,
  addAnimatedHeadlineConfig,
  addAudioConfig,
  addBreadcrumbsConfig,
  addButtonConfig,
  addCalendlyConfig,
  addCarouselConfig,
  addChartConfig,
  addColumnConfig,
  addCountdownConfig,
  addCounterConfig,
  addEmbedCodeConfig,
  addFlipboxConfig,
  addFormConfig,
  addFormFieldConfig,
  addIconConfig,
  addIconTextConfig,
  addImageComparisonConfig,
  addImageConfig,
  addImageGalleryConfig,
  addImageGalleryPhotosConfig,
  addInstagramFeedConfig,
  addLineConfig,
  addLoginConfig,
  addLottieConfig,
  addMapConfig,
  addMenuConfig,
  addPaypalConfig,
  addPostNavigationConfig,
  addProgressBarConfig,
  addProtectedFormConfig,
  addResetPasswordConfig,
  addRowConfig,
  addShapeConfig,
  addShareButtonConfig,
  addSoundCloudConfig,
  addSpacerConfig,
  addStarRatingConfig,
  addSwitcherConfig,
  addTableConfig,
  addTableOfContentsConfig,
  addTabsConfig,
  addTextConfig,
  addTimelineConfig,
  addTimelineItemConfig,
  addTranslationConfig,
  addVideoConfig,
  addVideoPlaylistConfig,

  updateAccordionConfig,
  updateAlertConfig,
  updateAnimatedHeadlineConfig,
  updateAudioConfig,
  updateBreadcrumbsConfig,
  updateButtonConfig,
  updateCalendlyConfig,
  updateCarouselConfig,
  updateChartConfig,
  updateCloneableConfig,
  updateColumnConfig,
  updateCountdownConfig,
  updateCounterConfig,
  updateEmbedCodeConfig,
  updateFlipboxConfig,
  updateFormConfig,
  updateFormFieldConfig,
  updateIconConfig,
  updateIconTextConfig,
  updateImageComparisonConfig,
  updateImageConfig,
  updateImageGalleryConfig,
  updateInstagramFeedConfig,
  updateLineConfig,
  updateLoginConfig,
  updateLoginFieldConfig,
  updateLottieConfig,
  updateMapConfig,
  updateMenuConfig,
  updatePaypalConfig,
  updatePostNavigationConfig,
  updateProgressBarConfig,
  updateProtectedFormConfig,
  updateResetPasswordConfig,
  updateRowConfig,
  updateSectionFooterConfig,
  updateSectionHeaderItemConfig,
  updateSectionHeaderStickyItemConfig,
  updateSectionItemConfig,
  updateShapeConfig,
  updateSoundCloudConfig,
  updateSpacerConfig,
  updateStarRatingConfig,
  updateSwitcherConfig,
  updateTableAsideConfig,
  updateTableBodyConfig,
  updateTableConfig,
  updateTableHeadConfig,
  updateTableOfContentsConfig,
  updateTabsConfig,
  updateTextConfig,
  updateTimelineConfig,
  updateTimelineItemConfig,
  updateTranslationConfig,
  updateVideoConfig,
  updateVideoPlaylistConfig,
  updateWrapperConfig
];
