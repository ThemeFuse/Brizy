import { getEditorToolCatalog } from "@brizy/ai-tools";
import type { ISharedStore } from "visual/plugins/SharedStore";
import type { Translation } from "visual/utils/i18n/t";
import type { IPageRepository } from "../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../application/interfaces/i-project-repository";
import type { ToolDefinition, ToolHandler } from "../entities/models";
import { buildHandler } from "./handler-factory";
import { createInfrastructureHandlers } from "./infrastructure-handlers";
import { componentConfigs } from "./tool-configs";
import type { HandlerDeps } from "./types";

/**
 * Where the catalog meets the editor.
 *
 * `@brizy/ai-tools` owns what the LLM sees; this file owns what runs. The two
 * are joined by `alias`: an element is exposed as many small tools —
 * `updateButtonBackground`, `updateButtonPadding` — that all carry the alias
 * `updateButton` and so all resolve to the one handler its config builds.
 * Splitting an element further therefore costs no handler work at all.
 *
 * The catalog advertises only the split names, but the handler map answers to
 * the alias as well, because `ai-chatbot-api` resolves an incoming call to its
 * alias before emitting it: that is what keeps its own references — the image
 * strategy, the prompts, the tool pool — working when a concern split renames
 * a tool. Both names reach the same handler, so which one arrives is
 * immaterial to what runs.
 *
 * This is safe for the confirmation gate only because every tool carrying
 * `requiresConfirmation` is its own alias, so the alias a caller emits is the
 * name `ai-chat` looks up. `packages/ai-tools` holds that as an invariant; if
 * it ever broke, a gated tool would arrive under a name the catalog does not
 * know and run unconfirmed.
 */
export function getBrizyToolDefinitions(t: Translation): ToolDefinition[] {
  return [...getEditorToolCatalog(t)];
}

export function createBrizyToolHandlers(
  pageRepository: IPageRepository,
  projectRepository: IProjectRepository,
  store: ISharedStore
): Record<string, ToolHandler> {
  const deps: HandlerDeps = { pageRepository, projectRepository, store };

  const byAlias = new Map<string, ToolHandler>();
  for (const config of componentConfigs) {
    byAlias.set(config.alias, buildHandler(config, deps));
  }

  const componentHandlers: Record<string, ToolHandler> = {};
  for (const tool of getEditorToolCatalog((key) => key)) {
    const handler = byAlias.get(tool.alias);
    if (handler !== undefined) {
      componentHandlers[tool.name] = handler;
      componentHandlers[tool.alias] = handler;
    }
  }

  return {
    ...createInfrastructureHandlers(deps),
    ...componentHandlers
  };
}
