"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  payload?: Record<string, string | number | boolean>;
};

export default function TrackedExternalLink({
  eventName,
  payload,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, payload);
        onClick?.(event);
      }}
    />
  );
}
