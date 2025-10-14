import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ChatRoom from "../pages/ChatRoom";
import EmptyChat from "../pages/EmptyChat";
import Register from "../pages/Register";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        index: true,
        element: <EmptyChat />,
      },
      {
        path: "/:id",
        element: <ChatRoom />,
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
