import { modelsUrl } from "@/constants.js";
import { mutate } from "swr";

function useSelectModel() {
  const selectModel = async (model, apiKey) => {
    const response = await fetch(modelsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, api_key: apiKey }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    mutate(modelsUrl, data, false);
    return data;
  };
  return { selectModel };
}

export default useSelectModel;
