import { createContext, useContext, useState } from "react";

interface ICursorContext {
  cursorClassName: string;
  setCursorClassName: (className: string) => void;
}

const CursorContext = createContext<ICursorContext | null>(null);

const CursorProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [cursorClassName, setCursorClassName] = useState<string>("");

  return (
    <CursorContext.Provider
      value={{ cursorClassName, setCursorClassName }}
      {...props}
    />
  );
};

const useCursor = () => {
  const cursorContext = useContext(CursorContext);
  if (!cursorContext) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return cursorContext;
};
export { CursorProvider, useCursor };
