import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ChatRoom from "../pages/ChatRoom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/:id",
        element: <ChatRoom />,
      },
    ],
  },
]);
