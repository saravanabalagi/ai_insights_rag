import { createContext, useEffect, useState } from "react";

export const ResponseContext = createContext();

export const ResponseProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem("conversations");
    return savedConversations ? JSON.parse(savedConversations) : [[]];
  });
  const [currentConversation, setCurrentConversation] = useState(0);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const addResponse = (response) => {
    setConversations((prevConversations) => {
      const newConversations = [...prevConversations];
      newConversations[currentConversation] = [
        ...newConversations[currentConversation],
        response,
      ];
      return newConversations;
    });
  };

  const startNewConversation = () => {
    setConversations((prevConversations) => [...prevConversations, []]);
    setCurrentConversation(conversations.length);
  };

  return (
    <ResponseContext.Provider
      value={{
        conversations,
        currentConversation,
        addResponse,
        startNewConversation,
        setCurrentConversation,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
};
