// Custom Error handler
export class CustomError {
  name = "CustomError";
  date = new Date();
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  getName(): string {
    return this.name;
  }

  getMessage(): string {
    return this.message;
  }

  getDate(): Date {
    return this.date;
  }
}

export class ProjectError extends CustomError {
  name = "Project";
}

export class PageError extends CustomError {
  name = "Page";
}

export class SavedBlocksError extends CustomError {
  name = "SavedBlocks";
}

export class GlobalBlocksError extends CustomError {
  name = "GlobalBlocks";
}

export class SavedLayoutError extends CustomError {
  name = "SavedLayout";
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
