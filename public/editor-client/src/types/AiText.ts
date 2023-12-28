export enum RequestOptions {
  Model = "gpt-3.5-turbo",
  Temperature = 0.2,
}

export enum Role {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

export interface Conversation {
  role: Role;
  content: string;
}

export enum Action {
  Extend = "extend",
  Shorten = "shorten",
  Simplify = "simplify",
  English = "English",
  German = "German",
  French = "French",
  Spanish = "Spanish",
  Italian = "Italian",
  Dutch = "Dutch",
  Portuguese = "Portuguese",
  Polish = "Polish",
  Professional = "Professional",
  Casual = "Casual",
  Confident = "Confident",
  Friendly = "Friendly",
}
