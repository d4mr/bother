import { formatFileSize } from "@/lib/utils";
import * as React from "react";

interface IImagesPickerProps {
  onChange?: (files: FileList) => void;
}

const ImagesPicker: React.FunctionComponent<IImagesPickerProps> = ({
  onChange,
}) => {
  const [files, setFiles] = React.useState<FileList | null>(null);

  return (
    <div>
      <label htmlFor="images-picker">
        <div className="border border-muted p-8 rounded-sm border-dashed text-foreground">
          {(!files || files.length === 0) && (
            <div className="text-center">no images selected</div>
          )}
          {files && files.length > 0 ? (
            <div>
              <h3 className="mb-2">Selected {files.length} images:</h3>
              {Array.from(files).map((file) => {
                return (
                  <div>
                    {file.name} ({formatFileSize(file.size)})
                  </div>
                );
              })}
            </div>
          ) : undefined}
        </div>
      </label>
      <input
        id="images-picker"
        onChange={(e) => {
          setFiles(e.target.files);
          onChange?.(e.target.files!);
        }}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImagesPicker;
