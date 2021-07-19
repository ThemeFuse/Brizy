import { IS_WP } from "visual/utils/env";
import { ProjectError, GlobalBlocksError } from "visual/utils/errors";

// project

export const parseProject = project => {
  let data;

  if (!project.data) {
    throw new ProjectError("Project data should exist");
  } else {
    try {
      data = JSON.parse(project.data);
    } catch (e) {
      throw new ProjectError(`Failed to parse project data ${project.data}`);
    }
  }

  return { ...project, data };
};

export const stringifyProject = project => {
  let data = JSON.stringify(project.data);

  return { ...project, data };
};
// global blocks

export const parseGlobalBlock = globalBlock => {
  let data;
  let meta;
  let rules;
  let position;
  let status;

  if (!globalBlock.data) {
    throw new GlobalBlocksError("globalBlock data should exist");
  } else {
    try {
      data = JSON.parse(globalBlock.data);
    } catch (e) {
      throw new GlobalBlocksError(
        `Failed to parse globalBlock data ${globalBlock.data}`
      );
    }
  }

  if (!globalBlock.meta) {
    meta = {};
  } else {
    try {
      meta = JSON.parse(globalBlock.meta);
    } catch (e) {
      meta = {};
    }
  }

  if (!globalBlock.rules) {
    rules = [];
  } else {
    try {
      rules = IS_WP ? globalBlock.rules : JSON.parse(globalBlock.rules);
    } catch (e) {
      throw new GlobalBlocksError("globalBlock rules are wrong");
    }
  }

  if (!globalBlock.position) {
    position = {};
  } else {
    try {
      position = IS_WP
        ? globalBlock.position
        : JSON.parse(globalBlock.position);
    } catch (e) {
      throw new GlobalBlocksError("globalBlock position are wrong");
    }
  }

  // !draft.status - it's needed for old globalBlocks, which don't have status
  if (!globalBlock.status) {
    status = "publish";
  } else {
    status = globalBlock.status;
  }

  return { ...globalBlock, data, meta, position, status, rules };
};

export const stringifyGlobalBlock = globalBlock => {
  const data = JSON.stringify(globalBlock.data);
  const meta = JSON.stringify(globalBlock.meta);
  const rules = JSON.stringify(globalBlock.rules);

  return { ...globalBlock, data, meta, rules };
};
