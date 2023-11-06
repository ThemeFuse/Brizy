export interface User {
  isAuthorized: boolean;
  // ours dashboard role manager
  role: "admin" | "limited";

  isGuest: boolean;
  allowScripts: boolean;
}
