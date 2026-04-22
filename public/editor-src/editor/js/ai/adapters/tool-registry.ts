import {
  addAccordionConfig,
  updateAccordionConfig
} from "visual/editorComponents/Accordion/definitions";
import {
  addAlertConfig,
  updateAlertConfig
} from "visual/editorComponents/Alert/definitions";
import {
  addAnimatedHeadlineConfig,
  updateAnimatedHeadlineConfig
} from "visual/editorComponents/AnimatedHeadline/definitions";
import {
  addAudioConfig,
  updateAudioConfig
} from "visual/editorComponents/Audio/definitions";
import {
  addBreadcrumbsConfig,
  updateBreadcrumbsConfig
} from "visual/editorComponents/Breadcrumbs/definitions";
import {
  addButtonConfig,
  updateButtonConfig
} from "visual/editorComponents/Button/definitions";
import {
  addChartConfig,
  updateChartConfig
} from "visual/editorComponents/Chart/definitions";
import {
  addCalendlyConfig,
  updateCalendlyConfig
} from "visual/editorComponents/Calendly/definitions";
import {
  addCarouselConfig,
  updateCarouselConfig
} from "visual/editorComponents/Carousel/definitions";
import { updateCloneableConfig } from "visual/editorComponents/Cloneable/definitions";
import {
  addColumnConfig,
  updateColumnConfig
} from "visual/editorComponents/Column/definitions";
import {
  addCountdownConfig,
  updateCountdownConfig
} from "visual/editorComponents/Countdown2/definitions";
import {
  addCounterConfig,
  updateCounterConfig
} from "visual/editorComponents/Counter/definitions";
import {
  addEmbedCodeConfig,
  updateEmbedCodeConfig
} from "visual/editorComponents/EmbedCode/definitions";
import {
  addFlipboxConfig,
  updateFlipboxConfig
} from "visual/editorComponents/Flipbox/definitions";
import { addFormConfig } from "visual/editorComponents/Form2/definitions";
import {
  addIconConfig,
  updateIconConfig
} from "visual/editorComponents/Icon/definitions";
import {
  addIconTextConfig,
  updateIconTextConfig
} from "visual/editorComponents/IconText/definitions";
import {
  addImageConfig,
  updateImageConfig
} from "visual/editorComponents/Image/definitions";
import {
  addImageComparisonConfig,
  updateImageComparisonConfig
} from "visual/editorComponents/ImageComparison/definitions";
import {
  addImageGalleryConfig,
  updateImageGalleryConfig
} from "visual/editorComponents/ImageGallery/definitions";
import {
  addLineConfig,
  updateLineConfig
} from "visual/editorComponents/Line/definitions";
import {
  addLottieConfig,
  updateLottieConfig
} from "visual/editorComponents/Lottie/definitions";
import {
  addLoginConfig,
  updateLoginConfig,
  updateLoginFieldConfig
} from "visual/editorComponents/Login/definitions";
import {
  addMapConfig,
  updateMapConfig
} from "visual/editorComponents/Map/definitions";
import { addMenuConfig } from "visual/editorComponents/Menu/definitions";
import {
  addPaypalConfig,
  updatePaypalConfig
} from "visual/editorComponents/Paypal/definitions";
import {
  addProgressBarConfig,
  updateProgressBarConfig
} from "visual/editorComponents/ProgressBar/definitions";
import {
  addTextConfig,
  updateTextConfig
} from "visual/editorComponents/RichText/definitions";
import {
  addRowConfig,
  updateRowConfig
} from "visual/editorComponents/Row/definitions";
import { updateSectionItemConfig } from "visual/editorComponents/Section/SectionItem/definitions";
import { updateSectionFooterConfig } from "visual/editorComponents/SectionFooter/definitions";
import { updateSectionHeaderConfig } from "visual/editorComponents/SectionHeader/definitions";
import { addShareButtonConfig } from "visual/editorComponents/ShareButton/definitions";
import {
  addSoundCloudConfig,
  updateSoundCloudConfig
} from "visual/editorComponents/SoundCloud/definitions";
import {
  addSpacerConfig,
  updateSpacerConfig
} from "visual/editorComponents/Spacer/definitions";
import {
  addStarRatingConfig,
  updateStarRatingConfig
} from "visual/editorComponents/StarRating/definitions";
import {
  addSwitcherConfig,
  updateSwitcherConfig
} from "visual/editorComponents/Switcher/definitions";
import {
  addTableConfig,
  updateTableAsideConfig,
  updateTableBodyConfig,
  updateTableConfig,
  updateTableHeadConfig
} from "visual/editorComponents/Table/definitions";
import {
  addTableOfContentsConfig,
  updateTableOfContentsConfig
} from "visual/editorComponents/TableOfContents/definitions";
import {
  addTabsConfig,
  updateTabsConfig
} from "visual/editorComponents/Tabs/definitions";
import {
  addTimelineConfig,
  addTimelineItemConfig,
  updateTimelineConfig,
  updateTimelineItemConfig
} from "visual/editorComponents/Timeline/definitions";
import {
  addVideoConfig,
  updateVideoConfig
} from "visual/editorComponents/Video/definitions";
import {
  addVideoPlaylistConfig,
  updateVideoPlaylistConfig
} from "visual/editorComponents/VideoPlaylist/definitions";
import { updateWrapperConfig } from "visual/editorComponents/Wrapper/definitions";
import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../application/interfaces/i-project-repository";
import type { ToolDefinition, ToolHandler } from "../entities/models";
import { buildHandler } from "./handler-factory";
import { infrastructureDefinitions } from "./infrastructure-definitions";
import { createInfrastructureHandlers } from "./infrastructure-handlers";
import type { HandlerDeps, ToolConfig } from "./types";

// ===========================================
// All component tool configs in order
// ===========================================

const componentConfigs: ToolConfig[] = [
  // Add tools
  addButtonConfig,
  addImageConfig,
  addTextConfig,
  addIconConfig,
  addSpacerConfig,
  addLineConfig,
  addVideoConfig,
  addAudioConfig,
  addMapConfig,
  addFormConfig,
  addLoginConfig,
  addRowConfig,
  addColumnConfig,
  addAccordionConfig,
  addAnimatedHeadlineConfig,
  addTabsConfig,
  addCarouselConfig,
  addImageGalleryConfig,
  addCountdownConfig,
  addCounterConfig,
  addProgressBarConfig,
  addIconTextConfig,
  addEmbedCodeConfig,
  addFlipboxConfig,
  addStarRatingConfig,
  addAlertConfig,
  addMenuConfig,
  addShareButtonConfig,
  addSwitcherConfig,
  addVideoPlaylistConfig,
  addLottieConfig,
  addTimelineConfig,
  addTimelineItemConfig,
  addTableConfig,
  addCalendlyConfig,
  addPaypalConfig,
  addImageComparisonConfig,
  addTableOfContentsConfig,
  addBreadcrumbsConfig,
  addSoundCloudConfig,
  addChartConfig,

  // Update tools
  updateTextConfig,
  updateButtonConfig,
  updateLoginConfig,
  updateLoginFieldConfig,
  updateImageConfig,
  updateIconConfig,
  updateSectionItemConfig,
  updateSectionHeaderConfig,
  updateSectionFooterConfig,
  updateRowConfig,
  updateColumnConfig,
  updateSpacerConfig,
  updateVideoConfig,
  updateAudioConfig,
  updateMapConfig,
  updateLineConfig,
  updateAccordionConfig,
  updateAnimatedHeadlineConfig,
  updateTabsConfig,
  updateCarouselConfig,
  updateImageGalleryConfig,
  updateCountdownConfig,
  updateCounterConfig,
  updateProgressBarConfig,
  updateIconTextConfig,
  updateEmbedCodeConfig,
  updateFlipboxConfig,
  updateStarRatingConfig,
  updateSwitcherConfig,
  updateAlertConfig,
  updateVideoPlaylistConfig,
  updateLottieConfig,
  updateTimelineConfig,
  updateTimelineItemConfig,
  updateTableConfig,
  updateTableAsideConfig,
  updateTableHeadConfig,
  updateTableBodyConfig,
  updateCloneableConfig,
  updateWrapperConfig,
  updateCalendlyConfig,
  updatePaypalConfig,
  updateImageComparisonConfig,
  updateTableOfContentsConfig,
  updateBreadcrumbsConfig,
  updateSoundCloudConfig,
  updateChartConfig
];

// ===========================================
// Public API — same signatures as the old files
// ===========================================

/**
 * All tool definitions (infrastructure + component).
 * Preserves the exact same order as the original brizyToolDefinitions array.
 */
export const brizyToolDefinitions: ToolDefinition[] = [
  ...infrastructureDefinitions,
  ...componentConfigs.map((c) => c.definition)
];

/**
 * Get tool definitions for LLM
 */
export function getBrizyToolDefinitions(): ToolDefinition[] {
  return brizyToolDefinitions;
}

/**
 * Create tool handlers from page repository.
 * These handlers execute the actual tool operations.
 */
export function createBrizyToolHandlers(
  pageRepository: IPageRepository,
  projectRepository: IProjectRepository,
  store: ISharedStore
): Record<string, ToolHandler> {
  const deps: HandlerDeps = { pageRepository, projectRepository, store };

  // Infrastructure handlers (read, block, generic element tools)
  const infraHandlers = createInfrastructureHandlers(deps);

  // Component handlers (built from configs via the factory)
  const componentHandlers: Record<string, ToolHandler> = {};
  for (const config of componentConfigs) {
    const toolName = config.definition.name;
    componentHandlers[toolName] = buildHandler(config, deps);
  }

  return {
    ...infraHandlers,
    ...componentHandlers
  };
}
