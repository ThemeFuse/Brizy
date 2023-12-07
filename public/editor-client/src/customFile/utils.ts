import { validateLottie } from "./lottieFile";

export const validateByComponent = (
  file: File,
  componentId: string
): Promise<unknown> => {
  switch (componentId) {
    case "Lottie":
      return validateLottie(file);
    default:
      return Promise.resolve();
  }
};
