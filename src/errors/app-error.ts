// Sign Up
export const EMAIL_ALREADY_EXISTS = "Email already registered.";

// Auth
export const INVALID_CREDENTIALS = "Invalid credentials.";
export const NOT_AUTHORIZED = "Not authorized.";
export const NO_TOKEN_PROVIDED = "No token provided.";
export const FAIL_AUTH_TOKEN = "Failed to authenticate token.";
export const ERROR_SIGNUP = "Error signing up.";

// Reminder
export const REMINDERS_NOT_FOUND = "Reminders not found";
export const MISSING_USER_ID = "Missing user ID.";
export const MISSING_USER_EMAIL = "Missing user email.";
export const ERROR_CREATE_REMINDER = "Error creating reminder.";
export const ERROR_UPDATE_REMINDER = "Error updating reminder.";
export const ERROR_DELETE_REMINDER = "Error deleting reminder.";

// Generic
export const NOT_CREATED = "Not created.";
export const NOT_UPDATED = "Not updated.";
export const NOT_DELETED = "Not deleted.";
export const NO_LOGS = "No logs found.";
export const INVALID_QUERY = "Invalid query.";
export const INTERNAL_ERROR = "Internal error.";
export const INVALID_REQUEST = "Invalid request.";

class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
