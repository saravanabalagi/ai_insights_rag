import { ResponseContext } from "@/contexts/Responses.jsx";
import { ExperimentOutlined } from "@ant-design/icons";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import "./Chat.scss";

const Chat = () => {
  const { chats, currentChat } = useContext(ResponseContext);
  const { responses } = chats[currentChat] || {};

  return (
    <div className="chat-container">
      {responses?.map((response, index) => (
        <div
          key={index}
          className={`chat-bubble ${response.isUser ? "user" : "server"}`}
        >
          {!response.isUser && (
            <div className="chat-icon">
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
