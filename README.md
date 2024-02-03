![image](https://res.cloudinary.com/dr2xlumqw/image/upload/f_auto,q_auto/ne7yhkhxrl7yn3ekxpla)

# bother
bother is a free open source toolkit for batch processing images in the browser.

## features
> [!IMPORTANT]
> Current bother supports only padding, but slicing is being developed actively.

### padding
padding tool allows adding borders to images (supports batch processing) to get them all to the same target aspect ratio.

![Frame 1 (5)](https://github.com/d4mr/bother/assets/16459486/047c5744-801f-4741-af55-9e0af56ebba1)

use cases include adding white borders to images to make them square, eg, for instagram. you can choose to add padding on the non-dominant axis too, see a live preview, and download the images individually or as a zip file.

### slicing
the slicing tools allows extraction of multiple images from within the same image. this goes beyond parametric grid based splitting of images, instead it uses image processing to calculate possible bounding boxes for images.

the ideal use case is scanning albums or polaroids, where each scanned page has multiple images

image processing first utilises gpu accelerated canny edge detection, and then probablistic hough line transforms to detect lines. these lines are then used to calculate possible bounding boxes for images.

bounding boxes can be adjusted before export.

optionally, all extracted images can be loaded to padding, for aspect ratio to be corrected before final export.

## why bother?
bother was born out of a need to add white borders to images to make
them square, but the process was very bothersome.

existing tools didn't allow for batch processing. some others required
uploading to servers which introduced unnecessary latency and
bottlenecks, especially since browsers today are a more than capable
platform for performing these operations locally on the client.
tools are ad-ridden, have shoddy ui, usage limits, etc. you get the
idea.

bother runs entirely on your browser, and doesn't require any
registration or payment. it's free and open source.
