import Image from "next/image";

import { isVideoUrl } from "@/lib/media/scopes";

export interface MediaPreviewProps {
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  controls?: boolean;
}

/**
 * Renders a stored media URL as an image or, when it is a video, a `<video>`
 * element. Property media and maintenance accept both, and `next/image` cannot
 * render a video, so the choice is made in one place rather than at each call
 * site.
 */
export function MediaPreview({
  url,
  alt,
  width,
  height,
  sizes,
  className,
  priority,
  controls = false,
}: MediaPreviewProps) {
  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        className={className}
        controls={controls}
        playsInline
        preload="metadata"
        aria-label={alt === "" ? undefined : alt}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
