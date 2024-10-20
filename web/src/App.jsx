// @deno-types="@types/react"
import { RagTypeProvider } from "@/contexts/RagType.jsx";
import { ResponseProvider } from "@/contexts/Responses.jsx";
import "./App.scss";
import Home from "./home/Home.jsx";

function App() {
  return (
    <>
      <ResponseProvider>
        <RagTypeProvider>
          <Home />
        </RagTypeProvider>
      </ResponseProvider>
    </>
  );
}

export default App;
