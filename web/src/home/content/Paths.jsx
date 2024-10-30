import useFetchPaths from "@/hooks/usePaths.js";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, List } from "antd";
import "./Paths.scss";

const Paths = ({ url }) => {
  const { data, loading, error } = useFetchPaths(url);
  const { files } = data || {};
  return (
    <div>
      {error && (
        <div className="error">
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
              <div className="paths-list-item">
                <div className="name">
                  {item}
                </div>
                <div>
                  <Button
                    type="text"
                    size="small"
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
