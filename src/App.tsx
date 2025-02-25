import { Suspense } from "react";
import { IDEProvider } from "./contexts/IDEContext";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

function App() {
  const tempoRoutes = import.meta.env.VITE_TEMPO ? useRoutes(routes) : null;

  return (
    <IDEProvider>
      <Suspense fallback={<p>Loading...</p>}>
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<Home />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </Suspense>
    </IDEProvider>
  );
}

export default App;
