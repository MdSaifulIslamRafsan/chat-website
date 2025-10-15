import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ChatRoom from "../pages/ChatRoom";
import EmptyChat from "../pages/EmptyChat";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <EmptyChat />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:id",
        element: (
          <ProtectedRoute>
            <ChatRoom />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
]);
