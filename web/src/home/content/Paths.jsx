import useFetchPaths from "@/hooks/usePaths.js";
import { List } from "antd";

const Paths = ({ url }) => {
  const { data, loading, error } = useFetchPaths(url);
  const { paths } = data || {};
  return (
    <div>
      {error && (
        <div style={{ color: "red", padding: "20px" }}>
          Error loading files: {error}
        </div>
      )}
      {paths?.length > 0 && (
        <List
          size="small"
          loading={loading}
          bordered
          dataSource={paths}
          renderItem={(item) => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Paths;
