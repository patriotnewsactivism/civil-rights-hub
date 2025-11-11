import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import EnvironmentCheck from "./components/EnvironmentCheck";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <EnvironmentCheck>
      <App />
    </EnvironmentCheck>
  </ErrorBoundary>
);
