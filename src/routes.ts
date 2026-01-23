import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { Models } from "./components/Models";
import { Inference } from "./components/Inference";
import { Security } from "./components/Security";
import { Setup } from "./components/Setup";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "setup", Component: Setup },
      { path: "models", Component: Models },
      { path: "inference/:modelId", Component: Inference },
      { path: "security", Component: Security },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);