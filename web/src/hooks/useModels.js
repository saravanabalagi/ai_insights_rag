import { modelsUrl } from "@/constants.js";
import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

function useModels() {
  const { data, error } = useSWR(modelsUrl, fetcher);
  const loading = !data && !error;
  const models = data?.models || [];
  const model = data?.model;
  return { models, model, loading, error };
}

export default useModels;
