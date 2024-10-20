import { RagTypeContext } from "@/contexts/RagType.jsx";
import useQueryHandler from "@/hooks/useQuery.js";
import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useContext, useState } from "react";

function QueryInput() {
  const [query, setQuery] = useState("");
  const { handleQuerySubmit, loading } = useQueryHandler();
  const { tabPosition } = useContext(RagTypeContext);

  const onSubmit = async () => {
    const success = await handleQuerySubmit(query, tabPosition);
    if (success) setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="p-2">
      <div
        style={{
          position: "relative",
        }}
      >
        <Input.TextArea
          style={{
            resize: "none",
            borderRadius: "25px",
            padding: "10px 20px",
            paddingRight: "50px",
            fontSize: "16px",
            backgroundColor: "#333",
          }}
          disabled={loading}
          value={query}
          autoSize={{ minRows: 1, maxRows: 3 }}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query here..."
          onKeyDown={handleKeyDown}
        />
        <Button
          style={{
            paddingLeft: "3px",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "8px",
          }}
          color="default"
          variant="solid"
          icon={<SendOutlined />}
          shape="circle"
          loading={loading}
          disabled={query.trim() === ""}
          onClick={onSubmit}
        />
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "#999",
          marginTop: "8px",
        }}
      >
        This tool is under development and can make mistakes. Please verify the
        results before using them.
      </div>
    </div>
  );
}

export default QueryInput;
