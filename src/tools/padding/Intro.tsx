import ImagesPicker from "@/components/ImagesPicker";
import { useAtom } from "jotai";
import * as React from "react";
import { paddingFilesAtom } from "./store";

interface IPaddingIntroProps {}

const PaddingIntro: React.FunctionComponent<IPaddingIntroProps> = () => {
  const [, setFiles] = useAtom(paddingFilesAtom);

  return (
    <div className="grid place-items-center flex-grow">
      <div className="max-w-lg space-y-2">
        <h1 className="text-4xl pb-4 font-semibold">padding</h1>
        <p>
          padding tool allows you to add borders to images (supports batch
          processing) to get them all to the same target aspect ratio. Use a 1:1
          ration to get square images, ideal for instagram.
        </p>
        <p>
          get started by selecting images to process. you can drag and drop them
          anywhere, or clicking the button.
        </p>
        <div className="pt-8">
          <ImagesPicker
            onChange={(files) => {
              setFiles(Array.from(files).map((file) => ({ file })));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaddingIntro;
