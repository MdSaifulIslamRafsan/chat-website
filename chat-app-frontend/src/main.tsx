import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Provider } from 'react-redux'
import { router } from "./routes/routes.tsx";
import { store } from "./redux/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <Provider store={store}>
        <RouterProvider router={router} />
         <Toaster position="top-right"  />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
