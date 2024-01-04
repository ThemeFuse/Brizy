export enum RequestOptions {
  Model = "gpt-3.5-turbo",
}

export enum Role {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

export enum Action {
  Extend = "extend",
  Shorten = "shorten",
  Simplify = "simplify",
  Professional = "Professional",
  Casual = "Casual",
  Confident = "Confident",
  Friendly = "Friendly",
}

interface ConversationMessage {
  role: Role;
  content: string;
}

export interface Conversation {
  temperature: number;
  messages: ConversationMessage[];
}

export const LanguageCodes: Record<string, string> = {
  cmn: "Mandarin Chinese",
  spa: "Spanish",
  eng: "English",
  rus: "Russian",
  arb: "Standard Arabic",
  ben: "Bengali",
  hin: "Hindi",
  por: "Portuguese",
  ind: "Indonesian",
  jpn: "Japanese",
  fra: "French",
  deu: "German",
  kor: "Korean",
  vie: "Vietnamese",
  ita: "Italian",
  tur: "Turkish",
  pol: "Polish",
  ukr: "Ukrainian",
  kan: "Kannada",
  mal: "Malayalam",
  pes: "Iranian Persian",
  swh: "Swahili",
  ron: "Romanian",
  bos: "Bosnian",
  hrv: "Croatian",
  nld: "Dutch",
  srp: "Serbian",
  tha: "Thai",
  zlm: "Malay",
  hun: "Hungarian",
  azj: "North Azerbaijani",
  ell: "Modern Greek",
  ces: "Czech",
  bel: "Belarusian",
  swe: "Swedish",
  kaz: "Kazakh",
};
