export class BotherImage {
  /*
   * @remarks
   * A BotherImage simplifies operations like padding and compositing images. It does computation and stores parameters without affecting the original bitmap.
   * In fact, it doesn't even create any new bitmaps until you call render() or compose().
   * This is useful to add padding to images in a realtime canvas application, where you don't want to create a new bitmap every time you change the padding.
   * Computation for all operations is done lazily, so you can change the padding and margin as many times as you want without worrying about performance.
   * Drawing to the canvas can happen in one go, so you don't have to worry about performance there either.
   */
  constructor(public image: ImageBitmap) {}

  public padding: {
    n: number;
    s: number;
    e: number;
    w: number;
  } = {
    n: 0,
    s: 0,
    e: 0,
    w: 0,
  };

  public margin: {
    n: number;
    s: number;
    e: number;
    w: number;
  } = {
    n: 0,
    s: 0,
    e: 0,
    w: 0,
  };

  public marginColor: string = "#ffffff";
  public paddingColor: string = "#ffffff";

  public get width(): number {
    return (
      this.image.width +
      this.padding.e +
      this.padding.w +
      this.margin.e +
      this.margin.w
    );
  }

  public get height(): number {
    return (
      this.image.height +
      this.padding.n +
      this.padding.s +
      this.margin.n +
      this.margin.s
    );
  }

  public get nonDominantAxis(): "x" | "y" | undefined {
    if (this.margin.e || this.margin.w) return "y";
    if (this.margin.n || this.margin.s) return "x";
  }

  public get aspectRatio(): number {
    return this.width / this.height;
  }

  public get originalAspectRatio(): number {
    return this.image.width / this.image.height;
  }

  public renderToBlob() {
    const canvas = new OffscreenCanvas(this.width, this.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get context");

    context.fillStyle = this.marginColor;
    context.fillRect(0, 0, this.width, this.height);
    context.drawImage(
      this.image,
      this.padding.w + this.margin.w,
      this.padding.n + this.margin.n
    );

    // TODO: make quality configurable
    return canvas.convertToBlob({
      quality: 0.5,
      type: "image/jpeg",
    });
  }

  public render() {
    const canvas = new OffscreenCanvas(this.width, this.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get context");

    context.fillStyle = this.marginColor;
    context.fillRect(0, 0, this.width, this.height);
    context.drawImage(
      this.image,
      this.padding.n + this.margin.n,
      this.padding.w + this.margin.w
    );

    return new BotherImage(canvas.transferToImageBitmap());
  }

  public compose(
    other: BotherImage,
    x: number,
    y: number,
    w: number,
    h: number
  ): BotherImage {
    const canvas = new OffscreenCanvas(this.width, this.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get context");
    context.drawImage(this.render().image, 0, 0);
    context.drawImage(other.image, x, y, w, h);

    return new BotherImage(canvas.transferToImageBitmap());
  }

  public copy() {
    return new BotherImage(this.image);
  }

  public setPadding(
    color: string,
    paddingDimensions: { n?: number; s?: number; e?: number; w?: number }
  ) {
    let { n, s, e, w } = paddingDimensions;
    n ??= 0;
    s ??= 0;
    e ??= 0;
    w ??= 0;

    this.padding = {
      n,
      s,
      e,
      w,
    };

    this.paddingColor = color;
  }

  public toAspectRatio(
    aspectRatio: number,
    {
      color,
      alignX,
      alignY,
      xOffset,
      yOffset,
    }: {
      color: string;
      alignX?: "left" | "right" | "center";
      alignY?: "top" | "bottom" | "center";
      xOffset?: number;
      yOffset?: number;
    }
  ) {
    alignX ??= "center";
    alignY ??= "center";

    xOffset ??= 0;
    yOffset ??= 0;

    color ??= "#ffffff";

    // find which axis needs to be padded
    const currentAspectRatio = this.aspectRatio;
    const currentWidth = this.width;
    const currentHeight = this.height;

    const width =
      currentAspectRatio > aspectRatio
        ? currentWidth
        : currentHeight * aspectRatio;
    const height =
      currentAspectRatio > aspectRatio
        ? currentWidth / aspectRatio
        : currentHeight;

    const xPadding = width - currentWidth;
    const yPadding = height - currentHeight;

    const xPaddingLeft = Math.floor(xPadding / 2);
    const yPaddingTop = Math.floor(yPadding / 2);

    this.margin = {
      n: yPaddingTop,
      s: yPadding - yPaddingTop,
      e: xPadding - xPaddingLeft,
      w: xPaddingLeft,
    };

    this.marginColor = color;
  }
}
