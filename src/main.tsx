import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DiceField } from "./features/DiceField/DiceField.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DiceField />
  </StrictMode>,
);
