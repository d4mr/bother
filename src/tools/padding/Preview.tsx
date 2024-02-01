import { useAtom, useAtomValue } from "jotai";
import {
  paddingCurrentFileAtom,
  paddingCurrentFileBitmapAtom,
  paddingOptionsAtom,
  paddingPreviewCanvasOptionsAtom,
} from "./store";
import { useEffect, useMemo, useRef } from "react";

import { useGesture } from "@use-gesture/react";
import { clamp } from "@/lib/utils";
import { BotherImage } from "@/lib/bother";

export function Preview() {
  const currentFileBitmap = useAtomValue(paddingCurrentFileBitmapAtom);
  const currentFile = useAtomValue(paddingCurrentFileAtom);
  const options = useAtomValue(paddingOptionsAtom);

  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [paddingPreviewCanvasOptions, setPaddingPreviewCanvasOptions] = useAtom(
    paddingPreviewCanvasOptionsAtom
  );

  const inverseScale = 1 / paddingPreviewCanvasOptions.scale;

  // moving this logic to the atom would be cleaner
  // but dependency on an async atom causes long rerenders (1ms+)
  // here, we have the currentFileBitmap as a dependency
  // but its not recalculated on every render
  // in an atom it would be
  const botherImage = useMemo(() => {
    if (!currentFileBitmap) return;

    const overridenOptions = {
      nonDominantPadding:
        currentFile?.nonDominantPadding ?? options.globalNonDominantPadding,
      color: currentFile?.color ?? options.globalColor,
    };

    const bi = new BotherImage(currentFileBitmap);
    const targetAspectRatio = options.targetAspectRatio;
    const currentAspectRatio =
      currentFileBitmap.width / currentFileBitmap.height;

    bi.setPadding(
      currentFile?.color ?? options.globalColor,
      currentAspectRatio > targetAspectRatio
        ? {
            e: overridenOptions.nonDominantPadding,
            w: overridenOptions.nonDominantPadding,
          }
        : {
            n: overridenOptions.nonDominantPadding,
            s: overridenOptions.nonDominantPadding,
          }
    );

    bi.toAspectRatio(targetAspectRatio, {
      color: currentFile?.color ?? options.globalColor,
    });

    return bi;
  }, [options, currentFileBitmap, currentFile]);

  useEffect(() => {
    if (!canvas.current || !botherImage) return;
    let cleanedUp = false;

    const draw = (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.height = canvasContainerRef.current?.clientHeight || 0;
      canvas.width = canvasContainerRef.current?.clientWidth || 0;

      ctx.scale(
        paddingPreviewCanvasOptions.scale,
        paddingPreviewCanvasOptions.scale
      );

      ctx.fillStyle = paddingPreviewCanvasOptions.bgColor;
      ctx.fillRect(
        0,
        0,
        canvas.width * inverseScale,
        canvas.height * inverseScale
      );

      ctx.imageSmoothingEnabled = paddingPreviewCanvasOptions.smoothing;

      ctx.fillStyle = botherImage.paddingColor;
      ctx.fillRect(
        paddingPreviewCanvasOptions.offset[0],
        paddingPreviewCanvasOptions.offset[1],
        botherImage.width,
        botherImage.height
      );

      ctx.drawImage(
        botherImage.image,
        paddingPreviewCanvasOptions.offset[0] +
          botherImage.padding.w +
          botherImage.margin.w,
        paddingPreviewCanvasOptions.offset[1] +
          botherImage.padding.n +
          botherImage.margin.n
      );

      //   options.targetAspectRatio;
      if (!cleanedUp) requestAnimationFrame(() => draw(canvas));
    };

    draw(canvas.current);

    return () => {
      cleanedUp = true;
    };
  }, [options, paddingPreviewCanvasOptions, inverseScale, botherImage]);

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();

    document.addEventListener("gesturestart", handler);
    document.addEventListener("gestureend", handler);
    document.addEventListener("gesturechange", handler);

    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gestureend", handler);
      document.removeEventListener("gesturechange", handler);
    };
  }, []);

  useGesture(
    {
      onPinch: ({ origin, delta }) => {
        // get canvas location at pinch origin
        const canvasRect = canvas.current?.getBoundingClientRect();
        if (!canvasRect) return;
        const canvasOrigin = [
          origin[0] - canvasRect.left,
          origin[1] - canvasRect.top,
        ];

        setPaddingPreviewCanvasOptions((options) => {
          const prevScale = options.scale;
          const newScale = clamp(options.scale + delta[0], 0.1, 3);

          // offset is being calculated to scale the canvas at the same origin as the pinch
          // calculations explained at https://excalidraw.com/#json=xpuwQ38nEnJYctjop7wSo,q-G8rjdbtXuXR4CgoKL1gA
          return {
            ...options,
            offset: [
              options.offset[0] +
                (canvasOrigin[0] / newScale - canvasOrigin[0] / prevScale),
              options.offset[1] +
                (canvasOrigin[1] / newScale - canvasOrigin[1] / prevScale),
            ],
            scale: newScale,
          };
        });
      },
      onDrag: ({ delta }) => {
        setPaddingPreviewCanvasOptions((options) => ({
          ...options,
          offset: [
            options.offset[0] + delta[0] * inverseScale,
            options.offset[1] + delta[1] * inverseScale,
          ],
        }));
      },
    },
    {
      target: canvasContainerRef,
      pinch: {
        scaleBounds: {
          max: 3,
          min: 0.1,
        },
      },
    }
  );

  if (!currentFile || !currentFileBitmap) return <></>;

  return (
    <div className="flex-grow touch-none" ref={canvasContainerRef}>
      <canvas
        style={{ imageRendering: "pixelated" }}
        height={canvasContainerRef.current?.clientHeight}
        width={canvasContainerRef.current?.clientWidth}
        ref={canvas}
      />
    </div>
  );
}
