import { createRoute } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import React, { Suspense, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCursor } from "@/context/Cursor";
import { formatFileSize } from "@/lib/utils";
import { Settings, X } from "lucide-react";
import { toolsRoute } from "..";
import ImagePaddingOptions from "./ImagePaddingOptions";
import PaddingIntro from "./Intro";
import PaddingOptions from "./PaddingOptions";
import { Preview } from "./Preview";
import PreviewCanvasOptions from "./PreviewCanvasOptions";
import {
  paddingCurrentFileAtom,
  paddingCurrentFileBitmapAtom,
  paddingCurrentFileIndexAtom,
  paddingFilesAtom,
  paddingOptionsAtom,
} from "./store";
import { BotherImage } from "@/lib/bother";

interface IPaddingProps {}

function CurrentImageMetadata() {
  const currentFileBitmap = useAtomValue(paddingCurrentFileBitmapAtom);
  const currentFile = useAtomValue(paddingCurrentFileAtom);
  const options = useAtomValue(paddingOptionsAtom);

  // TODO: try to move just the calculations to store
  const bi = useMemo(() => {
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

  if (!currentFile || !currentFileBitmap) return <></>;

  return (
    // <Suspense>
    <div className="flex flex-col text-sm">
      <div className="odd:bg-accent/50 py-1 px-4 grid grid-cols-2">
        <span className="mr-auto">width</span>
        <span className="font-mono">{currentFileBitmap.width}</span>
      </div>
      <div className="odd:bg-accent/50 py-1 px-4 grid grid-cols-2">
        <span className="mr-auto">height</span>
        <span className="font-mono">{currentFileBitmap.height}</span>
      </div>
      <div className="odd:bg-accent/50 py-1 px-4 grid grid-cols-2">
        <span className="mr-auto">original file size</span>
        <span className="font-mono">
          {formatFileSize(currentFile.file.size)}
        </span>
      </div>
      <div className="odd:bg-accent/50 py-1 px-4 grid grid-cols-2">
        <span className="mr-auto">new file width</span>
        <span className="font-mono">{bi?.width}</span>
      </div>
      <div className="odd:bg-accent/50 py-1 px-4 grid grid-cols-2">
        <span className="mr-auto">new file height</span>
        <span className="font-mono">{bi?.height}</span>
      </div>
      <div className="odd:bg-accent/50 py-1 px-4 grid grid-cols-2">
        <span className="mr-auto">actual aspect ratio</span>
        <span className="font-mono">
          {bi?.width && bi.height ? (bi.width / bi.height).toFixed(5) : "..."}
        </span>
      </div>
    </div>
    // </Suspense>
  );
}

const Padding: React.FunctionComponent<IPaddingProps> = () => {
  const [files, setFiles] = useAtom(paddingFilesAtom);
  const [activeFileIndex, setActiveFileIndex] = useAtom(
    paddingCurrentFileIndexAtom
  );

  const { cursorClassName } = useCursor();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cursorClassName}
      onDragEnter={(e) => {
        e.dataTransfer.types.includes("Files") && e.preventDefault();
      }}
      onDragOver={(e) => {
        e.dataTransfer.types.includes("Files") && e.preventDefault();
      }}
      onDrop={(e) => {
        if (!e.dataTransfer.files) return;
        setFiles([
          ...(files ?? []),
          ...(Array.from(e.dataTransfer.files)
            .filter((file) => {
              // remove non images
              console.log(file.type);
              return file.type.startsWith("image");
            })
            .map((file) => ({
              file,
            })) ?? []),
        ]);
        e.preventDefault();
      }}
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex flex-col border-muted border-y h-full">
          <div className="border-b border-muted px-4 uppercase text-xs font-semibold flex items-center justify-between">
            files
            <div className="grid place-items-center py-1">
              <div>
                <label
                  htmlFor="images-picker"
                  className="block hover:cursor-pointer"
                >
                  <Button
                    variant={"secondary"}
                    className="h-6 text-xs w-6 p-0 pointer-events-none"
                  >
                    +
                  </Button>
                </label>
                <input
                  id="images-picker"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    setFiles([
                      ...(files ?? []),
                      ...(Array.from(e.target.files).map((file) => ({
                        file,
                      })) ?? []),
                    ]);
                  }}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div className="py-2 flex flex-col gap-1 px-2">
            {files.map((file, idx) => {
              return (
                <Button
                  className="px-4 text-sm text-start group"
                  variant={activeFileIndex === idx ? "secondary" : "ghost"}
                  onClick={() => {
                    setActiveFileIndex(idx);
                  }}
                >
                  <div className="flex-grow text-ellipsis overflow-clip">
                    {file.file.name}
                  </div>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    className="p-0 m-0 h-6 w-6 group-hover:visible invisible flex-shrink-0"
                    onClick={() => {
                      setFiles(files.filter((_, i) => i !== idx));
                    }}
                  >
                    <X className="w-3 h-auto" />
                  </Button>
                </Button>
              );
            })}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="[&_div]:flex-shrink-0" />
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col border-muted border-y h-full">
          <div className="border-b border-muted px-4 py-1 uppercase text-xs font-semibold flex-shrink-0 flex items-center justify-between">
            <span>preview</span>
            <Popover>
              <PopoverTrigger>
                <Button variant={"secondary"} className="h-6 text-xs w-6 p-0">
                  <Settings className="w-3 h-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PreviewCanvasOptions />
              </PopoverContent>
            </Popover>
          </div>
          {(!files || files.length === 0) && <PaddingIntro />}
          <Suspense>
            <Preview />
          </Suspense>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="[&_div]:flex-shrink-0" />
      <ResizablePanel defaultSize={25}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <div className="flex flex-col border-muted border-t h-full">
              <div className="border-b border-muted px-4 py-2 uppercase text-xs font-semibold flex-shrink-0">
                padding options
              </div>
              <Tabs
                defaultValue="global"
                className="flex-grow flex-col flex pb-2"
              >
                <div className="px-2 pt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="global" className="text-xs">
                      Global
                    </TabsTrigger>
                    <TabsTrigger value="override" className="text-xs">
                      Override
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="global" asChild>
                  <PaddingOptions />
                </TabsContent>
                <TabsContent value="override" asChild>
                  <Suspense>
                    <ImagePaddingOptions />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="flex flex-col border-muted">
              <div className="border-b border-muted px-4 py-2 uppercase text-xs font-semibold flex-shrink-0">
                metadata
              </div>
              <Suspense>
                <CurrentImageMetadata />
              </Suspense>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export const paddingRoute = createRoute({
  path: "/padding",
  getParentRoute: () => toolsRoute,
  component: Padding,
});

export default Padding;
