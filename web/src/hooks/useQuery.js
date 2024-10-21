import { queryUrl } from "@/constants.js";
import { ResponseContext } from "@/contexts/Responses.jsx";
import { useContext, useState } from "react";

const useQueryHandler = () => {
  const [loading, setLoading] = useState(false);
  const { currentChat, addResponse, startNewChat, nextChatId } = useContext(
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
      const data = await response.json();
      addResponse(id, { text: data.response, isUser: false });
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
