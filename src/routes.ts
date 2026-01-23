import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Models } from "./components/Models";
import { Inference } from "./components/Inference";
import { Security } from "./components/Security";
import { Settings } from "./components/Settings";
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
      { index: true, Component: Home },
      { path: "models", Component: Models },
      { path: "inference/:modelId", Component: Inference },
      { path: "security", Component: Security },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);