import { pathsCustomUrl, pathsDefaultUrl, uploadUrl } from "@/constants.js";
import { RagTypeContext } from "@/contexts/RagType.jsx";
import Paths from "@/home/content/Paths.jsx";
import { InboxOutlined } from "@ant-design/icons";
import { message, Radio, Upload } from "antd";
import { useContext } from "react";
import "./FileUpload.scss";

function FileUpload() {
  const { tabPosition, setTabPosition } = useContext(RagTypeContext);
  const changeTabPosition = (e) => setTabPosition(e.target.value);

  const handleFileChange = (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.debug(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="rag-disk-wrapper">
      <div className="rag-disk-choices">
        <Radio.Group
          value={tabPosition}
          onChange={changeTabPosition}
          buttonStyle="solid"
        >
          <Radio.Button value="default">Default Disk</Radio.Button>
          <Radio.Button value="none">No RAG Disk</Radio.Button>
        </Radio.Group>
      </div>

      {tabPosition === "custom" && (
        <Upload.Dragger
          name="file"
          multiple={true}
          accept=".xlsx"
          action={uploadUrl}
          onChange={handleFileChange}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Upload one or more XSLX files to analyze. Do NOT upload sensitive
            data.
          </p>
        </Upload.Dragger>
      )}
      {tabPosition === "default" && <Paths url={pathsDefaultUrl} />}
    </div>
  );
}

export default FileUpload;
