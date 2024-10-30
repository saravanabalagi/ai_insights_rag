import useFetchPaths from "@/hooks/usePaths.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, List } from "antd";

const Paths = ({ url }) => {
  const { data, loading, error } = useFetchPaths(url);
  const { files } = data || {};
  return (
    <div>
      {error && (
        <div style={{ color: "red", padding: "20px" }}>
          Error loading files: {error}
        </div>
      )}
      {files?.length > 0 && (
        <List
          size="small"
          loading={loading}
          bordered
          dataSource={files}
          renderItem={(item) => (
            <List.Item>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>{item}</div>
                <div>
                  <Button
                    type="text"
                    onClick={() => window.open(`${url}/${item}`)}
                    icon={<DownloadOutlined />}
                  />
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Paths;
