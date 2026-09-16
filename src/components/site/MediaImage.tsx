import { useEffect, useState } from "react";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

export function useMediaUrl(value: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    resolveMediaUrl(value).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [value]);
  return url;
}

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
};

export function MediaImage({ src, alt, className, imgClassName, onClick }: Props) {
  const url = useMediaUrl(src);
  return (
    <div
      className={cn("relative overflow-hidden bg-surface-2", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {url ? (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 will-change-transform",
            imgClassName,
          )}
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-xs uppercase tracking-widest text-muted-foreground">
          TSI
        </div>
      )}
    </div>
  );
}
