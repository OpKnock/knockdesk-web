"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Icon } from "./Icon";

/**
 * The primary download call to action.
 *
 * The label names the platform the visitor is actually on, so the nav button
 * and the hero button say the same thing instead of offering two different
 * ways to ask for the same file. The platform is read from the user agent on
 * the client; useSyncExternalStore keeps the server snapshot during
 * hydration, so there is no flash of the wrong label and no mismatch warning.
 */

type Platform = "windows" | "macos" | "linux" | "unknown";

const readPlatform = (): Platform => {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac OS X|Macintosh/i.test(ua)) return "macos";
  if (/Linux|X11/i.test(ua)) return "linux";
  return "unknown";
};

const labels: Record<Platform, string> = {
  windows: "Download for Windows",
  macos: "Download for macOS",
  linux: "Download for Linux",
  unknown: "Download KnockDesk",
};

export function DownloadCta({ className }: { className?: string }) {
  const platform = useSyncExternalStore<Platform>(
    () => () => {},
    readPlatform,
    () => "unknown",
  );

  return (
    <Link href="/download" className={className ?? "kd-btn kd-btn-primary"}>
      <Icon name="download" />
      {labels[platform]}
    </Link>
  );
}
