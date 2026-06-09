import type { z } from "zod";
import type { ISharedStore } from "visual/plugins/SharedStore";
import type { IPageRepository } from "../application/interfaces/i-page-repository";
import type { IProjectRepository } from "../application/interfaces/i-project-repository";
import type { ToolDefinition } from "../entities/models";

/** Type alias for tool handler arguments */
export type ToolArgs = Record<string, unknown>;

/**
 * Dependencies injected into tool handlers
 */
export interface HandlerDeps {
  readonly pageRepository: IPageRepository;
  readonly projectRepository: IProjectRepository;
  readonly store: ISharedStore;
}

/**
 * Config for an "add element" tool.
 *
 * Standard flow: extract containerId/insertIndex, apply defaults,
 * validate with Zod schema, call pageRepository.addElement.
 */
export interface AddToolConfig {
  readonly kind: "add";
  /** The ToolDefinition that describes this tool to the LLM */
  readonly definition: ToolDefinition;
  /** ElementTypes enum value (e.g. ElementTypes.Button) */
  readonly elementType: string;
  /** Zod schema for property validation */
  readonly schema: z.ZodTypeAny;
  /** Optional defaults function applied before schema validation */
  readonly defaults?: (props: ToolArgs) => ToolArgs;
  /**
   * Optional transform applied to parsed data before passing to addElement.
   * Return the initialProperties object.
   */
  readonly transformProps?: (
    parsed: Record<string, unknown>
  ) => Record<string, unknown>;
  /**
   * Optional post-add hook for additional operations after element creation.
   * Receives the parsed props and the add result.
   */
  readonly afterAdd?: (
    deps: HandlerDeps,
    parsed: Record<string, unknown>,
    result: { success: boolean; data?: { childElementId?: string } }
  ) => void;
  /**
   * Escape hatch: if the standard flow does not fit,
   * provide a full custom handler. When set, all other fields
   * except `definition` are ignored.
   */
  readonly handler?: (deps: HandlerDeps, args: ToolArgs) => unknown;
}

/**
 * Config for an "update element" tool.
 *
 * Standard flow: extract elementId, apply defaults,
 * validate with Zod schema, call pageRepository.updateElement.
 */
export interface UpdateToolConfig {
  readonly kind: "update";
  /** The ToolDefinition that describes this tool to the LLM */
  readonly definition: ToolDefinition;
  /** ElementTypes enum value — passed to pageRepository.updateElement */
  readonly elementType: string;
  /** Zod schema for property validation */
  readonly schema: z.ZodTypeAny;
  /** Optional defaults function applied before schema validation */
  readonly defaults?: (props: ToolArgs) => ToolArgs;
  /**
   * Optional transform applied to parsed data before passing to updateElement.
   * Return the changes object.
   */
  readonly transformProps?: (
    parsed: Record<string, unknown>
  ) => Record<string, unknown>;
  /**
   * Optional type validation: fetches the element and checks its type
   * before applying updates.
   */
  readonly validateType?: {
    readonly expectedType: string;
    readonly errorMessage: string;
  };
  /**
   * Override the update method called on pageRepository.
   * Default is "updateElement". Use "updateColumn" for Column, etc.
   */
  readonly updateMethod?: "updateElement" | "updateColumn";
  /**
   * Optional pre-update hook that can modify changes based on current element state.
   * Receives deps, elementId, and the parsed changes. Return the final changes object.
   */
  readonly beforeUpdate?: (
    deps: HandlerDeps,
    elementId: string,
    parsed: Record<string, unknown>
  ) => Record<string, unknown>;
  /**
   * Escape hatch: if the standard flow does not fit,
   * provide a full custom handler.
   */
  readonly handler?: (deps: HandlerDeps, args: ToolArgs) => unknown;
}

/**
 * Config for an "add-only" tool (no schema, just containerId + elementType).
 * Used for Form, Menu, ShareButton, etc.
 */
export interface AddNoPropsToolConfig {
  readonly kind: "addNoProps";
  readonly definition: ToolDefinition;
  readonly elementType: string;
}

/** Union of all tool config types */
export type ToolConfig =
  | AddToolConfig
  | UpdateToolConfig
  | AddNoPropsToolConfig;
