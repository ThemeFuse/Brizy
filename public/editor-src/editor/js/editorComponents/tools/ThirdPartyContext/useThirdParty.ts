import { useContext } from "react";
import { ThirdPartyContext } from "./context";

export const useThirdParty = () => {
  const context = useContext(ThirdPartyContext);

  if (!context) {
    throw new Error("useThirdParty must be used within a ThirdPartyProvider");
  }

  return context;
};
