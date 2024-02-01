import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

export interface IPaddingFile {
  file: File;
  nonDominantPadding?: number;
  color?: string;
}

export interface IPaddingOptionsAtom {
  targetAspectRatio: number;
  globalNonDominantPadding: number;
  globalColor: string;
}

export interface IPaddingPreviewCanvasOptionsAtom {
  bgColor: string;
  offset: [number, number];
  scale: number;
  smoothing: boolean;
}
export const paddingPreviewCanvasOptionsAtom =
  atom<IPaddingPreviewCanvasOptionsAtom>({
    bgColor: "#333333",
    offset: [0, 0],
    scale: 1,
    smoothing: false,
  });

export const paddingOptionsAtom = atom<IPaddingOptionsAtom>({
  targetAspectRatio: 1,
  globalNonDominantPadding: 0,
  globalColor: "#ffffff",
});

export const paddingFilesAtom = atom<IPaddingFile[]>([]);

export const paddingCurrentFileIndexAtom = atom<number | null>(1);

export const paddingCurrentFileAtom = atom<
  IPaddingFile | undefined,
  [IPaddingFile | undefined],
  void
>(
  (get) => {
    const files = get(paddingFilesAtom);
    const index = get(paddingCurrentFileIndexAtom);

    if (index === null || index < 0 || index >= files.length) return undefined;

    return files[index];
  },
  (get, set, arg) => {
    console.log("setter called");
    const files = get(paddingFilesAtom);
    const index = get(paddingCurrentFileIndexAtom);
    if (!arg) return;

    console.log("index", index);
    console.log("files", files);
    if (
      index === null ||
      index < 0 ||
      index >= files.length ||
      files[index] === null
    )
      return;

    files[index] = arg;
    set(paddingFilesAtom, Array.from(files));
  }
);

export const paddingCurrentFileFileAtom = focusAtom(
  paddingCurrentFileAtom,
  (optic) => optic.valueOr({} as IPaddingFile).prop("file")
);

export const paddingCurrentFileOptionsAtom = focusAtom(
  paddingCurrentFileAtom,
  (optic) =>
    optic.valueOr({} as IPaddingFile).pick(["color", "nonDominantPadding"])
);

export const paddingCurrentFileBitmapAtom = atom(async (get) => {
  const file = get(paddingCurrentFileFileAtom);
  if (!file) return null;
  return await createImageBitmap(file);
});
