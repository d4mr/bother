import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./App";

export const aboutRoute = createRoute({
  path: "/about",
  getParentRoute: () => rootRoute,
  component: About,
});

export function About() {
  return (
    <div className="grid place-items-center bg-card flex-grow">
      <div className="max-w-xl space-y-3">
        <h2 className="text-4xl font-semibold pb-4">why bother?</h2>
        <p>
          bother was born out of a need to add white borders to images to make
          them square, but the process was very bothersome.
        </p>
        <p>
          existing tools didn't allow for batch processing. some others required
          uploading to servers which introduced unnecessary latency and
          bottlenecks, especially since browsers today are a more than capable
          platform for performing these operations locally on the client.
        </p>
        <p>
          tools are ad-ridden, have shoddy ui, usage limits, etc. you get the
          idea.
        </p>
        <p>
          bother runs entirely on your browser, and doesn't require any
          registration or payment. it's free and open source.
        </p>
        <p>currenly it supports two functions:</p>
        <ul className="list-disc list-outside pl-4 space-y-2">
          <li>
            <strong>padding: </strong>adding white borders to images to make
            them square, ideal use case is for instagram. you can choose to add
            padding on the non-dominant axis too, see a live preview, and
            download the images individually or as a zip file.
          </li>
          <li>
            <strong>slicing: </strong> extracting multiple images from within an
            image, ideal use case is for scanning photo albums pages and
            polaroids. a preview of the extracted images is shown, you can
            modify the bounds of every slice, and you can download them
            individually or as a zip file.
          </li>
        </ul>
        <p>
          feel free to suggest more features via issues on github. contributions
          are welcome. if this tool helped, consider{" "}
          <a
            href="https://ko-fi.com/prithvish"
            className="underline"
            target="_blank"
          >
            donating
          </a>{" "}
          , or{" "}
          <a
            href="https://d4mr.github.io"
            className="underline"
            target="_blank"
          >
            following me
          </a>
          .{" "}
        </p>
      </div>
    </div>
  );
}
