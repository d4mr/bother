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
  const [lastX, setLastX] = React.useState<number>(0);
  const labelRef = React.useRef<HTMLLabelElement | null>(null);

  return (
    <Label
      ref={labelRef}
      onMouseDown={(e) => {
        labelRef.current?.setPointerCapture(1);
        setIsDragging(true);
        setLastX(e.clientX);
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        onSlide?.(e.clientX - lastX);
        setLastX(e.clientX);
      }}
      onMouseUp={() => {
        setIsDragging(false);
        labelRef.current?.releasePointerCapture(1);
      }}
      className={cn("cursor-ew-resize select-none ", className)}
      {...props}
    >
      {children}
    </Label>
  );
};

export default DragNumberInputLabel;
