import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { Models } from "./components/Models";
import { Inference } from "./components/Inference";
import { Security } from "./components/Security";
import { History } from "./components/History";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "models", Component: Models },
      { path: "inference", Component: Inference },
      { path: "security", Component: Security },
      { path: "history", Component: History },
    ],
  },
]);
