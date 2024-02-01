import { rootRoute } from "@/App";
import { Outlet, createRoute } from "@tanstack/react-router";

export const toolsRoute = createRoute({
  path: "/tools",
  getParentRoute: () => rootRoute,
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
