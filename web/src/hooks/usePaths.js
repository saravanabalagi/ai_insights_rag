import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const useFetchPaths = (url) => {
  const { data, error } = useSWR(url, fetcher);
  const loading = !data && !error;
  return { data, loading, error };
};

export default useFetchPaths;
