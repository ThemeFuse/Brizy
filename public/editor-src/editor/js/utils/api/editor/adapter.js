import {
  ProjectError,
  PageError,
  GlobalBlocksError,
  SavedBlocksError
} from "visual/utils/errors";

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

// page

export const parsePage = page => {
  const id = String(page.id);
  let data;

  if (!page.data) {
    data = {};
  } else {
    try {
      data = JSON.parse(page.data);
    } catch (e) {
      throw new PageError(`Failed to parse page ${page.data}`);
    }
  }

  return { ...page, id, data };
};

export const stringifyPage = page => {
  let data = JSON.stringify(page.data);

  return { ...page, data };
};

// global blocks

export const parseGlobalBlock = globalBlock => {
  let data;

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

  return { ...globalBlock, data };
};

export const stringifyGlobalBlock = globalBlock => {
  let data = JSON.stringify(globalBlock.data);

  return { ...globalBlock, data };
};

// saved blocks
export const parseSavedBlock = savedBlock => {
  let data;

  if (!savedBlock.data) {
    throw new SavedBlocksError("savedBlock data should exist");
  } else {
    try {
      data = JSON.parse(savedBlock.data);
    } catch (e) {
      throw new SavedBlocksError(
        `Failed to parse savedBlock data ${savedBlock.data}`
      );
    }
  }

  return { ...savedBlock, data };
};

export const stringifySavedBlock = savedBlock => {
  let data = JSON.stringify(savedBlock.data);

  return { ...savedBlock, data };
};
