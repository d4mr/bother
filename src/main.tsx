import React from "react";
import ReactDOM from "react-dom/client";
import { indexRoute, rootRoute } from "./App"
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ThemeProvider } from "./context/Theme";
import { aboutRoute } from "./About";
import { toolsRoute } from "./tools";
import { paddingRoute } from "./tools/padding";
import { slicingRoute } from "./tools/slicing";
import { CursorProvider } from "./context/Cursor";
import { Toaster } from "./components/ui/sonner";



const routeTree = rootRoute.addChildren([
  aboutRoute,
  indexRoute,
  toolsRoute.addChildren([paddingRoute, slicingRoute]),
]);


const router = createRouter({
  routeTree,
  basepath: "/bother/"
});

// Register things for typesafetyobo
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CursorProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </CursorProvider>
  </React.StrictMode>
);
