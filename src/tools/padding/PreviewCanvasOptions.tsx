import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import * as React from "react";
import { paddingPreviewCanvasOptionsAtom } from "./store";
import { Switch } from "@/components/ui/switch";

interface IPreviewCanvasOptionsProps {}

const PreviewCanvasOptions: React.FunctionComponent<
  IPreviewCanvasOptionsProps
> = () => {
  const [paddingPreviewCanvasOptions, setPaddingPreviewCanvasOptions] = useAtom(
    paddingPreviewCanvasOptionsAtom
  );

  return (
    <div className="flex flex-col gap-3 pb-2 [&_div]:gap-x-4">
      <div className="grid grid-cols-2 items-center">
        <Label>Offset X</Label>
        <Input
          type="number"
          value={paddingPreviewCanvasOptions.offset[0]}
          onChange={(e) => {
            setPaddingPreviewCanvasOptions({
              ...paddingPreviewCanvasOptions,
              offset: [
                Number(e.target.value),
                paddingPreviewCanvasOptions.offset[1],
              ],
            });
          }}
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <Label>Offset Y</Label>
        <Input
          type="number"
          value={paddingPreviewCanvasOptions.offset[1]}
          onChange={(e) => {
            setPaddingPreviewCanvasOptions({
              ...paddingPreviewCanvasOptions,
              offset: [
                paddingPreviewCanvasOptions.offset[0],
                Number(e.target.value),
              ],
            });
          }}
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <Label>Scale</Label>
        <Input
          type="number"
          value={paddingPreviewCanvasOptions.scale}
          onChange={(e) => {
            setPaddingPreviewCanvasOptions({
              ...paddingPreviewCanvasOptions,
              scale: Number(e.target.value),
            });
          }}
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <Label>Background Color</Label>
        <Input
          type="color"
          value={paddingPreviewCanvasOptions.bgColor}
          onChange={(e) => {
            setPaddingPreviewCanvasOptions({
              ...paddingPreviewCanvasOptions,
              bgColor: e.target.value,
            });
          }}
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <Label>Image Smoothing</Label>
        <Switch
          checked={paddingPreviewCanvasOptions.smoothing}
          onCheckedChange={(checked) => {
            setPaddingPreviewCanvasOptions({
              ...paddingPreviewCanvasOptions,
              smoothing: checked,
            });
          }}
        />
      </div>
    </div>
  );
};

export default PreviewCanvasOptions;
