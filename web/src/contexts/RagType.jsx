import { createContext, useState } from "react";

export const RagTypeContext = createContext();

export const RagTypeProvider = ({ children }) => {
  const [tabPosition, setTabPosition] = useState("default");

  return (
    <RagTypeContext.Provider value={{ tabPosition, setTabPosition }}>
      {children}
    </RagTypeContext.Provider>
  );
};
