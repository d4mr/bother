import { createRoute } from "@tanstack/react-router";
import React from "react";
import { toolsRoute } from "..";

interface ISlicingProps {}

const Slicing: React.FunctionComponent<ISlicingProps> = () => {
  return (
    <div className="grid place-items-center flex-grow">
      <div className="max-w-lg space-y-2">
        <div className="mb-4 text-xs text-card-foreground font-semibold uppercase inline-block rounded-full border border-border px-4 py-2">
          In development
        </div>
        <h1 className="text-4xl pb-4 font-semibold">slicing</h1>
        <p>
          the slicing tools allows you to extract multiple images from within
          the same image. this goes beyond parametric grid based splitting of
          images, instead it uses image processing to calculate possible
          bounding boxes for images.
        </p>
        <p>
          the ideal use case is scanning albums or polaroids, where each scanned
          page has multiple images
        </p>
        <p>
          image processing first utilises gpu accelerated canny edge detection,
          and then probablistic hough line transforms to detect lines. these
          lines are then used to calculate possible bounding boxes for images.
        </p>
        <p>bounding boxes can be adjusted before export.</p>
        <p>
          optionally, all extracted images can be loaded to padding, for aspect
          ratio to be corrected before final export.
        </p>
      </div>
    </div>
  );
};

export const slicingRoute = createRoute({
  path: "/slicing",
  getParentRoute: () => toolsRoute,
  component: Slicing,
});

export default Slicing;
