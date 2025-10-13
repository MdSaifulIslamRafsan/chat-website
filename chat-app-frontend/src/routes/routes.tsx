import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ChatRoom from "../pages/ChatRoom";
import EmptyChat from "../pages/EmptyChat";

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
]);
