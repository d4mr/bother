import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom, useAtomValue } from "jotai";
import * as React from "react";
import { paddingCurrentFileOptionsAtom, paddingOptionsAtom } from "./store";

interface IImagePaddingOptionsProps {}

const ImagePaddingOptions: React.FunctionComponent<
  IImagePaddingOptionsProps
> = () => {
  const [currentOptions, setCurrentOptions] = useAtom(
    paddingCurrentFileOptionsAtom
  );
  const options = useAtomValue(paddingOptionsAtom);

  if (!currentOptions) return <></>;

  return (
    <div className="flex flex-col gap-2 px-4 py-2 flex-grow">
      <div className="grid grid-cols-2 items-center">
        <Label htmlFor="global-dominant-padding">
          Non-Dominant Axis Padding
        </Label>
        <Input
          id="global-non-dominant-padding"
          value={
            currentOptions.nonDominantPadding ??
            options.globalNonDominantPadding
          }
          onChange={(e) => {
            console.log("onchange called");
            console.log(e.target.value);
            console.log(currentOptions);
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
    </div>
  );
};

export default ImagePaddingOptions;
