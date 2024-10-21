import { queryUrl } from "@/constants.js";
import { ResponseContext } from "@/contexts/Responses.jsx";
import { useContext, useState } from "react";

const useQueryHandler = () => {
  const [loading, setLoading] = useState(false);
  const {
    currentChat,
    addResponse,
    startNewChat,
    nextChatId,
    updateLastResponseChunk,
  } = useContext(
    ResponseContext,
  );

  const handleQuerySubmit = async (query, ragType) => {
    setLoading(true);
    if (currentChat == null) startNewChat();
    const id = currentChat ?? nextChatId;
    addResponse(id, { text: query, isUser: true });
    try {
      const response = await fetch(queryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msg: query,
          rag_type: ragType,
        }),
      });

      if (response.ok) {
        addResponse(id, { text: "", isUser: false });
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        updateLastResponseChunk(id, chunk);
      }
      return true;
    } catch (error) {
      console.error("Error submitting query:", error);
      addResponse(id, {
        text: "Error submitting query.",
        isUser: false,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleQuerySubmit, loading };
};

export default useQueryHandler;
