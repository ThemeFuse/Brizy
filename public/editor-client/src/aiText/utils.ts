import { Action, Conversation, LanguageCodes, Role } from "../types/AiText";

interface Params {
  action?: Action;
  language: string;
  prompt: string;
}

export const createConversation = ({
  action,
  language,
  prompt
}: Params): Conversation => {
  const languageCode = LanguageCodes[language];
  const outputLanguage = languageCode
    ? `Write the result in "${LanguageCodes[language]}".`
    : "";

  switch (action) {
    case Action.Extend:
      return {
        temperature: 0.5,
        messages: [
          {
            role: Role.System,
            content: `Please expand the text wrapped in parentheses. Increase the length by adding additional aspects or expanding the existing information. Provide more details or supplementary information to enhance the content. ${outputLanguage}`
          },
          {
            role: Role.User,
            content: `[${prompt}]`
          }
        ]
      };
    case Action.Shorten:
      return {
        temperature: 0.2,
        messages: [
          {
            role: Role.System,
            content: `Please shorten the text wrapped in parentheses. Condense the content by removing unnecessary details or aspects. Focus on the essential information while maintaining clarity. ${outputLanguage}`
          },
          {
            role: Role.User,
            content: `[${prompt}]`
          }
        ]
      };
    case Action.Simplify:
      return {
        temperature: 0.8,
        messages: [
          {
            role: Role.System,
            content: `Please make the text wrapped in parentheses simpler. Streamline the content by using simpler language and clearer expressions. Make the information more easily understandable. ${outputLanguage}`
          },
          {
            role: Role.User,
            content: `[${prompt}]`
          }
        ]
      };
    case Action.Professional:
    case Action.Casual:
    case Action.Confident:
    case Action.Friendly:
      return {
        temperature: 0.7,
        messages: [
          {
            role: Role.System,
            content: `Paraphrase text wrapped in parentheses in "${action}" tone. ${outputLanguage}`
          },
          {
            role: Role.User,
            content: `[${prompt}]`
          }
        ]
      };
    default:
      return {
        temperature: 0,
        messages: [
          {
            role: Role.Assistant,
            content: prompt
          }
        ]
      };
  }
};
