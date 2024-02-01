import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom, useAtomValue } from "jotai";
import * as React from "react";
import { paddingFilesAtom, paddingOptionsAtom } from "./store";
import DragNumberInputLabel from "@/components/DragNumberInputLabel";
import { Button } from "@/components/ui/button";
import { BlobWriter, ZipWriter, BlobReader } from "@zip.js/zip.js";
import { BotherImage } from "@/lib/bother";
import { toast } from "sonner";

interface IPaddingOptionsProps {}

const PaddingOptions: React.FunctionComponent<IPaddingOptionsProps> = () => {
  const [globalOptions, setGlobalOptions] = useAtom(paddingOptionsAtom);
  const files = useAtomValue(paddingFilesAtom);

  const onExport = async () => {
    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
    console.log(files);

    await Promise.all(
      files.map(async (file) => {
        console.log("File is being processed:", file.file.name);
        const options = {
          color: file.color ?? globalOptions.globalColor,
          nonDominantPadding:
            file.nonDominantPadding ?? globalOptions.globalNonDominantPadding,
        };

        const bitmap = await createImageBitmap(file.file);
        const bi = new BotherImage(bitmap);

        const targetAspectRatio = globalOptions.targetAspectRatio;
        const currentAspectRatio = bitmap.width / bitmap.height;

        bi.setPadding(
          options.color,
          currentAspectRatio > targetAspectRatio
            ? {
                e: options.nonDominantPadding,
                w: options.nonDominantPadding,
              }
            : {
                n: options.nonDominantPadding,
                s: options.nonDominantPadding,
              }
        );

        bi.toAspectRatio(targetAspectRatio, {
          color: options.color,
        });

        const blob = await bi.renderToBlob();
        console.log(blob);
        await zipWriter.add(file.file.name, new BlobReader(blob));
      })
    );

    const zipBlob = await zipWriter.close();
    const zipUrl = URL.createObjectURL(zipBlob);
    console.log(zipUrl);
    // download zipBlob
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = zipUrl;
    a.download = "bother.zip";
    a.click();
    URL.revokeObjectURL(zipUrl);
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2 flex-grow">
      <div className="grid grid-cols-2 items-center">
        <DragNumberInputLabel
          htmlFor="global-dominant-padding"
          onSlide={(delta) => {
            setGlobalOptions((options) => ({
              ...options,
              globalNonDominantPadding:
                options.globalNonDominantPadding + delta,
            }));
          }}
        >
          Non-Dominant Axis Padding
        </DragNumberInputLabel>
        <Input
          id="global-non-dominant-padding"
          value={globalOptions.globalNonDominantPadding}
          onChange={(e) => {
            setGlobalOptions({
              ...globalOptions,
              globalNonDominantPadding: Number(e.target.value),
            });
          }}
          type="number"
          className="text-xs"
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <Label htmlFor="global-padding-color">Padding Color</Label>
        <Input
          value={globalOptions.globalColor}
          id="global-padding-color"
          onChange={(e) => {
            setGlobalOptions({
              ...globalOptions,
              globalColor: e.target.value,
            });
          }}
          type="color"
          className="text-xs"
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <DragNumberInputLabel
          htmlFor="global-aspect-ratio"
          onSlide={(delta) => {
            setGlobalOptions((options) => ({
              ...options,
              targetAspectRatio:
                Math.round((options.targetAspectRatio + delta / 1000) * 1e3) /
                1e3,
            }));
          }}
        >
          Target Aspect Ratio
        </DragNumberInputLabel>
        <Input
          value={globalOptions.targetAspectRatio}
          id="global-aspect-ratio"
          onChange={(e) => {
            setGlobalOptions({
              ...globalOptions,
              targetAspectRatio: Number(e.target.value),
            });
          }}
          type="number"
          className="text-xs"
        />
      </div>
      <div className="flex-grow flex flex-col justify-end">
        <Button
          onClick={() => {
            const promise = onExport();
            toast.promise(promise, {
              loading: "Export in progress...",
              success: () => {
                return "Export Successful";
              },
              error: "Export Failed",
            });
          }}
        >
          Export As Zip
        </Button>
      </div>
    </div>
  );
};

export default PaddingOptions;
