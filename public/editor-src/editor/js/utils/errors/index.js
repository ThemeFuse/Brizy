// Custom Error handler
export class CustomError {
  constructor(message) {
    this.name = "CustomError";
    this.message = message;
    this.date = new Date();
  }

  getName() {
    return this.name;
  }

  getMessage() {
    return this.message;
  }
}

export class ProjectError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "Project";
  }
}

export class PageError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "Page";
  }
}

export class SavedBlocksError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "SavedBlocks";
  }
}

export class GlobalBlocksError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "GlobalBlocks";
  }
}

export class SavedLayoutError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "SavedLayout";
  }
}

// Error Codes

// polling
export const HEART_BEAT_ERROR = 1;

// project uses from another user
export const PROJECT_LOCKED_ERROR = 2;

// project data version
export const PROJECT_DATA_VERSION_ERROR = 3;

export const IRREPARABLE_ERRORS = [
  HEART_BEAT_ERROR,
  PROJECT_DATA_VERSION_ERROR
];
