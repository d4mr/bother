import * as React from "react";
import { Label } from "./ui/label";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

interface IDragNumberInputProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  onSlide?: (value: number) => void;
}

const DragNumberInputLabel: React.FC<IDragNumberInputProps> = ({
  children,
  className,
  onSlide,
  ...props
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const labelRef = React.useRef<HTMLLabelElement | null>(null);

  return (
    <Label
      ref={labelRef}
      onMouseDown={() => {
        labelRef.current?.requestPointerLock();
        setIsDragging(true);
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        onSlide?.(e.movementX);
      }}
      onMouseUp={() => {
        setIsDragging(false);
        document.exitPointerLock();
      }}
      className={cn(
        "cursor-ew-resize select-none",
        isDragging && "font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </Label>
  );
};

export default DragNumberInputLabel;
