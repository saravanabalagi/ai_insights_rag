import { ResponseContext } from "@/contexts/Responses.jsx";
import { ExperimentOutlined } from "@ant-design/icons";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import "./Chat.scss";

const Chat = () => {
  const { conversations, currentConversation } = useContext(ResponseContext);
  const responses = conversations[currentConversation];

  return (
    <div className="chat-container">
      {responses.map((response, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            marginBottom: "8px",
          }}
          className={`chat-bubble ${response.isUser ? "user" : "server"}`}
        >
          {!response.isUser && (
            <div
              style={{
                padding: "4px 8px 6px",
                borderRadius: "50%",
                border: "1px solid #444",
                marginRight: "20px",
              }}
            >
              <ExperimentOutlined />
            </div>
          )}
          <div
            className="chat-text"
            style={{ marginTop: !response.isUser ? "3px" : "0" }}
          >
            <ReactMarkdown>
              {response.text}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
