import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactDynamicFieldsExample } from "./example/react-dynamic-fields-example.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactDynamicFieldsExample />
  </StrictMode>
);
