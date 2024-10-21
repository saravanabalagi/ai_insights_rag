import { createContext, useEffect, useState } from "react";

export const ResponseContext = createContext();

export const ResponseProvider = ({ children }) => {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats) : {};
  });
  const [currentChat, setCurrentChat] = useState(null);
  const [nextId, setNextId] = useState(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? Object.keys(JSON.parse(savedChats)).length : 0;
  });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const addResponse = (id, response) => {
    if (id == null) {
      console.error("No chat selected to add response to.");
      return;
    }
    setChats((prevChats) => ({
      ...prevChats,
      [id]: {
        ...prevChats[id],
        responses: [...prevChats[id].responses, response],
        modified: new Date().toISOString(),
      },
    }));
  };

  const startNewChat = () => {
    const newId = nextId;
    setChats((prevChats) => ({
      ...prevChats,
      [newId]: {
        name: `Chat ${newId + 1}`,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        responses: [],
      },
    }));
    setCurrentChat(newId);
    setNextId(newId + 1);
  };

  const renameChat = (index, newName) => {
    setChats((prevChats) => ({
      ...prevChats,
      [index]: {
        ...prevChats[index],
        name: newName,
        modified: new Date().toISOString(),
      },
    }));
  };

  const deleteChat = (index) => {
    index = Number(index);
    if (currentChat === index) {
      setCurrentChat(null);
    }
    setChats((prevChats) => {
      const { [index]: _, ...newChats } = prevChats;
      return newChats;
    });
  };

  return (
    <ResponseContext.Provider
      value={{
        chats,
        currentChat,
        addResponse,
        startNewChat,
        setCurrentChat,
        renameChat,
        deleteChat,
        nextChatId: nextId,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
};
