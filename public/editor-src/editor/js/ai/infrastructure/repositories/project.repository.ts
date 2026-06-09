import FuzzySearch from "fuzzy-search";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  addFonts,
  addNewGlobalStyle,
  deleteFont as deleteFontAction,
  updateCurrentStyle,
  updateCurrentStyleId,
  updateDefaultFont
} from "visual/redux/actions2";
import {
  currentStyleIdSelector,
  currentStyleSelector,
  defaultFontSelector,
  extraStylesSelector,
  fontsSelector,
  stylesSelector,
  unDeletedFontsSelector
} from "visual/redux/selectors";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { Palette } from "visual/types/Style";
import { addAdobeFonts, getAdobeFonts } from "visual/utils/api";
import { getGroupFontsById } from "visual/utils/fonts/getFontById";
import { getGoogleFonts } from "visual/utils/fonts/getGoogleFonts";
import { getGoogleFontDetails, tripId } from "visual/utils/fonts/transform";
import type {
  AddFontParams,
  FontSummary,
  GoogleFontSummary,
  IProjectRepository,
  StyleDetail,
  StyleSummary
} from "../../application/interfaces/i-project-repository";
import type { BrizyToolResult } from "../../entities/models";
import type { UpdateStyleInput } from "./utils";
import {
  buildNewStyle,
  duplicateCurrentStyle,
  mergeStyleUpdate,
  toFontSummaries,
  toStyleDetail,
  toStyleSummary
} from "./utils";

class ProjectRepository implements IProjectRepository {
  constructor(
    private readonly getState: () => ReduxState,
    private readonly dispatch: TypedDispatch,
    private readonly config: ConfigCommon
  ) {}

  // ===========================================
  // Styles
  // ===========================================

  getProjectStyles(): BrizyToolResult<{
    currentStyleId: string;
    currentStyle: StyleDetail;
    styles: StyleSummary[];
    extraStyles: StyleSummary[];
  }> {
    const state = this.getState();

    return {
      success: true,
      data: {
        currentStyleId: currentStyleIdSelector(state),
        currentStyle: toStyleDetail(currentStyleSelector(state)),
        styles: stylesSelector(state).map(toStyleSummary),
        extraStyles: extraStylesSelector(state).map(toStyleSummary)
      }
    };
  }

  changeStyle(styleId: string): BrizyToolResult<{ styleId: string }> {
    const styles = stylesSelector(this.getState());
    const style = styles.find((s) => s.id === styleId);

    if (!style) {
      return {
        success: false,
        error: `Style with ID "${styleId}" not found. Use getProjectStyles to see available styles.`
      };
    }

    this.dispatch(updateCurrentStyleId(styleId));

    return {
      success: true,
      data: { styleId }
    };
  }

  addStyle(params: {
    title: string;
    colorPalette?: Palette[];
    fontStyles?: Record<string, unknown>[];
  }): BrizyToolResult<{ styleId: string; title: string }> {
    const currentStyle = currentStyleSelector(this.getState());
    const newStyle = buildNewStyle({ ...params, currentStyle });

    this.dispatch(addNewGlobalStyle(newStyle));

    return {
      success: true,
      data: {
        styleId: newStyle.id,
        title: newStyle.title
      }
    };
  }

  updateStyle(params: UpdateStyleInput): BrizyToolResult<{ styleId: string }> {
    const currentStyle = currentStyleSelector(this.getState());
    const updated = mergeStyleUpdate(currentStyle, params);

    this.dispatch(updateCurrentStyle(updated));

    return {
      success: true,
      data: { styleId: updated.id }
    };
  }

  duplicateStyle(title?: string): BrizyToolResult<{
    originalStyleId: string;
    newStyleId: string;
    title: string;
  }> {
    const currentStyle = currentStyleSelector(this.getState());
    const newStyle = duplicateCurrentStyle(currentStyle, title);

    this.dispatch(addNewGlobalStyle(newStyle));

    return {
      success: true,
      data: {
        originalStyleId: currentStyle.id,
        newStyleId: newStyle.id,
        title: newStyle.title
      }
    };
  }

  // ===========================================
  // Fonts
  // ===========================================

  getProjectFonts(): BrizyToolResult<{
    defaultFont: string;
    fonts: FontSummary[];
  }> {
    const state = this.getState();

    return {
      success: true,
      data: {
        defaultFont: defaultFontSelector(state),
        fonts: toFontSummaries(unDeletedFontsSelector(state))
      }
    };
  }

  async getGoogleFonts(params: {
    search: string;
    limit?: number;
  }): Promise<BrizyToolResult<{ fonts: GoogleFontSummary[] }>> {
    try {
      const allFonts = await getGoogleFonts({ config: this.config });
      const limit = params.limit ?? 20;

      const searcher = new FuzzySearch(allFonts, ["family"], {
        caseSensitive: false
      });

      const matched = searcher
        .search(params.search)
        .slice(0, limit)
        .map((f) => {
          const details = getGoogleFontDetails(f);
          return {
            id: details.id,
            title: details.title,
            family: details.family,
            category: f.category,
            variants: f.variants,
            weights: details.weights
          };
        });

      return {
        success: true,
        data: { fonts: matched }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async addFont(
    params: AddFontParams
  ): Promise<BrizyToolResult<{ family: string; type: string }>> {
    try {
      let family: string;

      switch (params.type) {
        case "google": {
          const allFonts = await getGoogleFonts({ config: this.config });
          const font = allFonts.find(
            (f) => f.family.toLowerCase() === params.family.toLowerCase()
          );

          if (!font) {
            return {
              success: false,
              error: `Google font "${params.family}" not found. Use getGoogleFonts to search.`
            };
          }

          const fontDetails = getGoogleFontDetails(font);
          const existingFont = getGroupFontsById(
            fontsSelector(this.getState()),
            fontDetails.id
          );

          if (existingFont) {
            const newFont = {
              type: existingFont.group,
              fonts: [{ ...existingFont.font, deleted: false }]
            };
            this.dispatch(addFonts([newFont]));
          } else {
            this.dispatch(addFonts([{ type: "google", fonts: [font] }]));
          }

          family = font.family;
          break;
        }
        case "adobe": {
          const { status } = await addAdobeFonts(this.config.api, {
            group: "adobe",
            key: params.adobeKitId
          });

          if (status !== 200) {
            return {
              success: false,
              error: "Failed to connect Adobe Fonts kit. Check the project ID."
            };
          }

          const result = await getAdobeFonts(this.config.api);
          const adobeKitId = result.kit.id;
          const fonts = result.kit.families;

          this.dispatch(addFonts([{ type: "adobe", id: adobeKitId, fonts }]));
          family = fonts.map((f: { family: string }) => f.family).join(", ");
          break;
        }
      }

      if (params.setAsDefault) {
        this.dispatch(updateDefaultFont(family));
      }

      return {
        success: true,
        data: { family, type: params.type }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  deleteFont(params: {
    brizyId: string;
    type: string;
  }): BrizyToolResult<{ brizyId: string }> {
    const fontGroup = getGroupFontsById(
      fontsSelector(this.getState()),
      params.brizyId
    );

    if (!fontGroup) {
      return {
        success: false,
        error: `Font with brizyId "${params.brizyId}" not found`
      };
    }

    this.dispatch(
      deleteFontAction({
        type: fontGroup.group,
        fonts: [fontGroup.font]
      })
    );

    return {
      success: true,
      data: { brizyId: params.brizyId }
    };
  }

  changeDefaultFont(font: string): BrizyToolResult<{ font: string }> {
    this.dispatch(updateDefaultFont(font));

    return {
      success: true,
      data: { font }
    };
  }

  fontExists(fontFamily: string): boolean {
    const fonts = unDeletedFontsSelector(this.getState());
    return !!getGroupFontsById(fonts, tripId(fontFamily));
  }
}

/**
 * Create project repository
 */
export function createProjectRepository(
  getState: () => ReduxState,
  dispatch: TypedDispatch,
  config: ConfigCommon
): IProjectRepository {
  return new ProjectRepository(getState, dispatch, config);
}
