import Navbar from "@/components/Navbar";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import "./index.css";
import { createRoute } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import { BoxSelect, PocketKnife } from "lucide-react";
import React from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

function Index() {
  return (
    <div className={`grid place-items-center bg-card flex-grow`}>
      <div className="max-w-xl space-y-3">
        <h2 className="text-4xl font-semibold pb-4">welcome to bother</h2>
        <p>
          bother is a free open source toolkit for batch processing images. it's
          a web app, so you can use it on any device, and it works offline too.
        </p>
        <p>Get Started:</p>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/tools/padding">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BoxSelect /> padding
                </CardTitle>
                <CardDescription>
                  add borders to images to make them square
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/tools/slicing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PocketKnife /> slicing
                </CardTitle>
                <CardDescription>
                  extract multiple images from within the same image
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
        <p>
          <Link to="/about" className="underline">
            why bother?
          </Link>
        </p>
      </div>
    </div>
  );
}
