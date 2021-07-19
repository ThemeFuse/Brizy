import { NewType } from "visual/types/NewType";
import { pass } from "fp-utilities";

enum projectId {
  type = "projectId"
}

export type ProjectId = NewType<string, projectId>;

/**
 * Check if the string value is a ProjectId value
 */
export const is = (s: string): s is ProjectId =>
  !!s.match(/^\/data\/[1-9][0-9]*$/);

/**
 * Try to read a ProjectId value from a string
 */
export const fromString = pass(is);

/**
 * Create a ProjectId value from an numeric number
 */
export const fromNumber = (id: number): ProjectId => `/data/${id}` as ProjectId;

/**
 * Converts a ProjectId value to an numeric Id
 *
 * Note: A ProjectId value contains a Id value inside, so we can afford this dangerous forced conversion to number
 */
export const toId = (projectId: ProjectId): number =>
  Number(projectId.replace("/data/", ""));
