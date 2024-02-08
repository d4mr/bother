import DragNumberInputLabel from "@/components/DragNumberInputLabel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom, useAtomValue } from "jotai";
import * as React from "react";
import {
  paddingCurrentFileAtom,
  paddingCurrentFileOptionsAtom,
  paddingOptionsAtom,
} from "./store";
import { Button } from "@/components/ui/button";

interface IImagePaddingOptionsProps {}

const ImagePaddingOptions: React.FunctionComponent<
  IImagePaddingOptionsProps
> = () => {
  const [currentOptions, setCurrentOptions] = useAtom(
    paddingCurrentFileOptionsAtom
  );
  const currentImage = useAtomValue(paddingCurrentFileAtom);
  const options = useAtomValue(paddingOptionsAtom);

  if (!currentImage)
    return (
      <p className="text-sm p-8 text-muted-foreground">
        select image to override global options for that specific image
      </p>
    );

  return (
    <div className="flex flex-col gap-2 px-4 py-2 flex-grow">
      <div className="grid grid-cols-2 items-center">
        <DragNumberInputLabel
          htmlFor="global-dominant-padding"
          onSlide={(value) => {
            setCurrentOptions({
              ...currentOptions,
              nonDominantPadding:
                (currentOptions.nonDominantPadding ??
                  options.globalNonDominantPadding) + value,
            });
          }}
        >
          Non-Dominant Axis Padding
        </DragNumberInputLabel>
        <Input
          id="global-non-dominant-padding"
          value={
            currentOptions.nonDominantPadding ??
            options.globalNonDominantPadding
          }
          onChange={(e) => {
            setCurrentOptions({
              ...currentOptions,
              nonDominantPadding: Number(e.target.value),
            });
          }}
          type="number"
          className="text-xs"
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <Label htmlFor="global-dominant-padding">Padding Color</Label>
        <Input
          value={currentOptions.color ?? options.globalColor}
          id="global-dominant-padding"
          onChange={(e) => {
            setCurrentOptions({
              ...currentOptions,
              color: e.target.value,
            });
          }}
          type="color"
          className="text-xs"
        />
      </div>
      <Button
        variant={"ghost"}
        className="mt-4"
        onClick={() => {
          setCurrentOptions({});
        }}
      >
        Reset Overrides
      </Button>
    </div>
  );
};

export default ImagePaddingOptions;
