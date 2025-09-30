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

export class AuthError extends CustomError {
  name = "Auth";
}

export class ConfigError extends CustomError {
  name = "Config";
}

// Error Codes
export enum ErrorCodes {
  HEART_BEAT_ERROR = 1, // polling
  PROJECT_LOCKED_ERROR = 2, // project uses from another user
  PROJECT_DATA_VERSION_ERROR = 3, // project data version
  SYNC_ERROR = 4, // Shopify sync error,
  REMOVE_GLOBAL_BLOCK = 5 // confirmation when user trying to remove global block
}

export const IRREPARABLE_ERRORS = [
  ErrorCodes.HEART_BEAT_ERROR,
  ErrorCodes.PROJECT_DATA_VERSION_ERROR
];
